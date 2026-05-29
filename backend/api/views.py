from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PerfilUsuario, Filme, Favorito, SolicitacaoEdicao
from .serializers import (
    CadastroSerializer,
    PerfilSerializer,
    FilmeSerializer,
    FavoritoSerializer,
    SolicitacaoEdicaoSerializer,
)
from .permissions import IsAdminPerfil


def get_perfil(user):
    return get_object_or_404(PerfilUsuario, usuario=user)


class CadastroView(generics.CreateAPIView):
    serializer_class = CadastroSerializer
    permission_classes = [AllowAny]


class PerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        perfil = get_perfil(request.user)
        serializer = PerfilSerializer(perfil)
        return Response(serializer.data)

    def put(self, request):
        perfil = get_perfil(request.user)
        serializer = PerfilSerializer(perfil, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


class LoginEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"erro": "E-mail e senha são obrigatórios."}, status=400)

        user = User.objects.filter(email=email).first()

        if not user or not user.check_password(password):
            return Response({"erro": "E-mail ou senha inválidos."}, status=401)

        perfil = PerfilUsuario.objects.filter(usuario=user).first()
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "nome": perfil.nome if perfil else user.username,
                "tipo": perfil.tipo if perfil else "comum",
                "foto": perfil.foto.url if perfil and perfil.foto else None,
            }
        })


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
        perfil = get_perfil(request.user)

        serializer = FilmeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                criado_por=request.user,
                status="aprovado" if perfil.tipo == "admin" else "pendente",
            )
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class FilmeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        perfil = get_perfil(request.user)
        filme = get_object_or_404(Filme, pk=pk)

        if filme.status != "aprovado" and perfil.tipo != "admin":
            return Response({"erro": "Filme não aprovado."}, status=403)

        serializer = FilmeSerializer(filme)
        return Response(serializer.data)

    def put(self, request, pk):
        perfil = get_perfil(request.user)
        filme = get_object_or_404(Filme, pk=pk)

        if perfil.tipo != "admin":
            return Response(
                {"erro": "Usuário comum deve solicitar edição."},
                status=403
            )

        serializer = FilmeSerializer(filme, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        perfil = get_perfil(request.user)

        if perfil.tipo != "admin":
            return Response({"erro": "Apenas administradores podem deletar filmes."}, status=403)

        filme = get_object_or_404(Filme, pk=pk)
        filme.delete()

        return Response({"mensagem": "Filme deletado com sucesso."})


class SolicitarEdicaoFilmeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        perfil = get_perfil(request.user)

        if perfil.tipo == "admin":
            return Response(
                {"erro": "Administrador pode editar diretamente."},
                status=400
            )

        filme = get_object_or_404(Filme, pk=pk, status="aprovado")

        dados_antes = FilmeSerializer(filme).data
        dados_depois = request.data.copy()

        solicitacao = SolicitacaoEdicao.objects.create(
            filme=filme,
            solicitado_por=request.user,
            dados_antes=dados_antes,
            dados_depois=dados_depois,
            status="pendente",
        )

        serializer = SolicitacaoEdicaoSerializer(solicitacao)
        return Response(serializer.data, status=201)


class FilmesPendentesView(APIView):
    permission_classes = [IsAdminPerfil]

    def get(self, request):
        filmes = Filme.objects.filter(status="pendente").order_by("-criado_em")
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
        edicoes = SolicitacaoEdicao.objects.filter(status="pendente").order_by("-criado_em")
        serializer = SolicitacaoEdicaoSerializer(edicoes, many=True)
        return Response(serializer.data)


class AprovarEdicaoView(APIView):
    permission_classes = [IsAdminPerfil]

    def post(self, request, pk):
        solicitacao = get_object_or_404(SolicitacaoEdicao, pk=pk, status="pendente")
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
        solicitacao = get_object_or_404(SolicitacaoEdicao, pk=pk, status="pendente")
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


class AlterarFotoPerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        perfil = get_perfil(request.user)

        if "foto" not in request.FILES:
            return Response({"erro": "Nenhuma imagem enviada."}, status=400)

        perfil.foto = request.FILES["foto"]
        perfil.save()

        serializer = PerfilSerializer(perfil)
        return Response(serializer.data)