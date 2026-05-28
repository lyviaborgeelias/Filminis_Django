from django.db import models
from django.contrib.auth.models import User


class PerfilUsuario(models.Model):
    TIPO_CHOICES = (
        ("comum", "Comum"),
        ("admin", "Administrador"),
    )

    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil")
    nome = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    foto = models.ImageField(upload_to="usuarios/", blank=True, null=True)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default="comum")

    def __str__(self):
        return self.nome


class Filme(models.Model):
    STATUS_CHOICES = (
        ("pendente", "Pendente"),
        ("aprovado", "Aprovado"),
        ("recusado", "Recusado"),
    )

    titulo = models.CharField(max_length=150)
    ano = models.IntegerField()
    genero = models.CharField(max_length=100)
    sinopse = models.TextField()
    poster = models.URLField(max_length=500, blank=True, null=True)   
    diretor = models.CharField(max_length=100)
    atores = models.TextField()
    produtora = models.CharField(max_length=100)
    orcamento = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    pais = models.CharField(max_length=80)
    linguagem = models.CharField(max_length=80)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pendente")
    criado_por = models.ForeignKey(User, on_delete=models.CASCADE, related_name="filmes_criados")
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class Favorito(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favoritos")
    filme = models.ForeignKey(Filme, on_delete=models.CASCADE, related_name="favoritado_por")

    class Meta:
        unique_together = ("usuario", "filme")

    def __str__(self):
        return f"{self.usuario.username} - {self.filme.titulo}"


class SolicitacaoEdicao(models.Model):
    STATUS_CHOICES = (
        ("pendente", "Pendente"),
        ("aprovado", "Aprovado"),
        ("recusado", "Recusado"),
    )

    filme = models.ForeignKey(Filme, on_delete=models.CASCADE, related_name="solicitacoes_edicao")
    solicitado_por = models.ForeignKey(User, on_delete=models.CASCADE)

    dados_antes = models.JSONField()
    dados_depois = models.JSONField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pendente")
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Edição - {self.filme.titulo}"