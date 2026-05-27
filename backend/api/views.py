from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from .models import PerfilUsuario, Filme, Favorito, SolicitacaoEdicao
from .serializers import (
    CadastroSerializer,
    PerfilSerializer,
    FilmeSerializer,
    FavoritoSerializer,
    SolicitacaoEdicaoSerializer,
)
from .permissions import IsAdminPerfil


class CadastroView(generics.CreateAPIView):
    serializer_class = CadastroSerializer
    permission_classes = [AllowAny]


class PerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        perfil = get_object_or_404(PerfilUsuario, usuario=request.user)
        serializer = PerfilSerializer(perfil)
        return Response(serializer.data)

    def put(self, request):
        perfil = get_object_or_404(PerfilUsuario, usuario=request.user)
        serializer = PerfilSerializer(perfil, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


class FilmeListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        filmes = Filme.objects.filter(status="aprovado")

        titulo = request.query_params.get("titulo")
        genero = request.query_params.get("genero")
        ano = request.query_params.get("ano")
        diretor = request.query_params.get("diretor")
        ator = request.query_params.get("ator")

        if titulo:
            filmes = filmes.filter(titulo__icontains=titulo)
        if genero:
            filmes = filmes.filter(genero__icontains=genero)
        if ano:
            filmes = filmes.filter(ano=ano)
        if diretor:
            filmes = filmes.filter(diretor__icontains=diretor)
        if ator:
            filmes = filmes.filter(atores__icontains=ator)

        serializer = FilmeSerializer(filmes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FilmeSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            perfil = request.user.perfil

            status_filme = "aprovado" if perfil.tipo == "admin" else "pendente"

            serializer.save(
                criado_por=request.user,
                status=status_filme
            )

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class FilmeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        filme = get_object_or_404(Filme, pk=pk)

        if filme.status != "aprovado" and request.user.perfil.tipo != "admin":
            return Response({"erro": "Filme não aprovado."}, status=403)

        serializer = FilmeSerializer(filme)
        return Response(serializer.data)

    def put(self, request, pk):
        filme = get_object_or_404(Filme, pk=pk)

        if request.user.perfil.tipo == "admin":
            serializer = FilmeSerializer(filme, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=400)

        dados_antes = FilmeSerializer(filme).data

        solicitacao = SolicitacaoEdicao.objects.create(
            filme=filme,
            solicitado_por=request.user,
            dados_antes=dados_antes,
            dados_depois=request.data,
        )

        serializer = SolicitacaoEdicaoSerializer(solicitacao)
        return Response(serializer.data, status=201)

    def delete(self, request, pk):
        if request.user.perfil.tipo != "admin":
            return Response({"erro": "Apenas administradores podem deletar filmes."}, status=403)

        filme = get_object_or_404(Filme, pk=pk)
        filme.delete()

        return Response({"mensagem": "Filme deletado com sucesso."})


class FilmesPendentesView(APIView):
    permission_classes = [IsAdminPerfil]

    def get(self, request):
        filmes = Filme.objects.filter(status="pendente")
        serializer = FilmeSerializer(filmes, many=True)
        return Response(serializer.data)


class AprovarFilmeView(APIView):
    permission_classes = [IsAdminPerfil]

    def post(self, request, pk):
        filme = get_object_or_404(Filme, pk=pk)
        filme.status = "aprovado"
        filme.save()

        return Response({"mensagem": "Filme aprovado com sucesso."})


class RecusarFilmeView(APIView):
    permission_classes = [IsAdminPerfil]

    def post(self, request, pk):
        filme = get_object_or_404(Filme, pk=pk)
        filme.status = "recusado"
        filme.save()

        return Response({"mensagem": "Filme recusado."})


class EdicoesPendentesView(APIView):
    permission_classes = [IsAdminPerfil]

    def get(self, request):
        edicoes = SolicitacaoEdicao.objects.filter(status="pendente")
        serializer = SolicitacaoEdicaoSerializer(edicoes, many=True)
        return Response(serializer.data)


class AprovarEdicaoView(APIView):
    permission_classes = [IsAdminPerfil]

    def post(self, request, pk):
        solicitacao = get_object_or_404(SolicitacaoEdicao, pk=pk)
        filme = solicitacao.filme

        for campo, valor in solicitacao.dados_depois.items():
            if hasattr(filme, campo):
                setattr(filme, campo, valor)

        filme.save()

        solicitacao.status = "aprovado"
        solicitacao.save()

        return Response({"mensagem": "Edição aprovada com sucesso."})


class RecusarEdicaoView(APIView):
    permission_classes = [IsAdminPerfil]

    def post(self, request, pk):
        solicitacao = get_object_or_404(SolicitacaoEdicao, pk=pk)
        solicitacao.status = "recusado"
        solicitacao.save()

        return Response({"mensagem": "Edição recusada."})


class FavoritosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favoritos = Favorito.objects.filter(usuario=request.user)
        serializer = FavoritoSerializer(favoritos, many=True)
        return Response(serializer.data)


class FavoritarFilmeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        filme = get_object_or_404(Filme, pk=pk, status="aprovado")

        favorito, criado = Favorito.objects.get_or_create(
            usuario=request.user,
            filme=filme
        )

        if criado:
            return Response({"mensagem": "Filme favoritado com sucesso."})

        return Response({"mensagem": "Filme já estava nos favoritos."})


class DesfavoritarFilmeView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        favorito = Favorito.objects.filter(usuario=request.user, filme_id=pk).first()

        if not favorito:
            return Response({"erro": "Filme não está nos favoritos."}, status=404)

        favorito.delete()
        return Response({"mensagem": "Filme removido dos favoritos."})