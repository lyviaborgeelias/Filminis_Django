from django.urls import path
from .views import (
    CadastroView,
    PerfilView,
    FilmeListCreateView,
    FilmeDetailView,
    FilmesPendentesView,
    AprovarFilmeView,
    RecusarFilmeView,
    EdicoesPendentesView,
    AprovarEdicaoView,
    RecusarEdicaoView,
    FavoritosView,
    FavoritarFilmeView,
    DesfavoritarFilmeView,
)

urlpatterns = [
    path("cadastro/", CadastroView.as_view()),
    path("perfil/", PerfilView.as_view()),

    path("filmes/", FilmeListCreateView.as_view()),
    path("filmes/<int:pk>/", FilmeDetailView.as_view()),

    path("filmes/pendentes/", FilmesPendentesView.as_view()),
    path("filmes/<int:pk>/aprovar/", AprovarFilmeView.as_view()),
    path("filmes/<int:pk>/recusar/", RecusarFilmeView.as_view()),

    path("edicoes/pendentes/", EdicoesPendentesView.as_view()),
    path("edicoes/<int:pk>/aprovar/", AprovarEdicaoView.as_view()),
    path("edicoes/<int:pk>/recusar/", RecusarEdicaoView.as_view()),

    path("favoritos/", FavoritosView.as_view()),
    path("filmes/<int:pk>/favoritar/", FavoritarFilmeView.as_view()),
    path("filmes/<int:pk>/desfavoritar/", DesfavoritarFilmeView.as_view()),
]