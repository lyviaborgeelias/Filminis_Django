from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PerfilUsuario, Filme, Favorito, SolicitacaoEdicao


class CadastroSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(write_only=True)
    telefone = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "nome", "telefone"]

    def create(self, validated_data):
        nome = validated_data.pop("nome")
        telefone = validated_data.pop("telefone", "")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        PerfilUsuario.objects.create(
            usuario=user,
            nome=nome,
            telefone=telefone,
            tipo="comum",
        )

        return user


class PerfilSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="usuario.username", read_only=True)
    email = serializers.EmailField(source="usuario.email", read_only=True)

    class Meta:
        model = PerfilUsuario
        fields = ["id", "username", "email", "nome", "telefone", "foto", "tipo"]


class FilmeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filme
        fields = "__all__"
        read_only_fields = ["criado_por", "status", "criado_em"]


class FavoritoSerializer(serializers.ModelSerializer):
    filme = FilmeSerializer(read_only=True)

    class Meta:
        model = Favorito
        fields = ["id", "filme"]


class SolicitacaoEdicaoSerializer(serializers.ModelSerializer):
    filme_titulo = serializers.CharField(source="filme.titulo", read_only=True)
    usuario = serializers.CharField(source="solicitado_por.username", read_only=True)

    class Meta:
        model = SolicitacaoEdicao
        fields = "__all__"
        read_only_fields = ["solicitado_por", "dados_antes", "status", "criado_em"]