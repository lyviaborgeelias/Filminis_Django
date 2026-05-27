from django.contrib import admin
from .models import PerfilUsuario, Filme, Favorito, SolicitacaoEdicao

admin.site.register(PerfilUsuario)
admin.site.register(Filme)
admin.site.register(Favorito)
admin.site.register(SolicitacaoEdicao)