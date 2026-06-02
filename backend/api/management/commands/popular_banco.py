from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import PerfilUsuario, Filme


class Command(BaseCommand):
    help = "Popula o banco com usuários e filmes iniciais"

    def handle(self, *args, **kwargs):
        admin, criado_admin = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@filminis.com",
                "first_name": "Admin",
            }
        )

        if criado_admin:
            admin.set_password("admin123")
            admin.is_staff = True
            admin.is_superuser = True
            admin.save()

        PerfilUsuario.objects.get_or_create(
            usuario=admin,
            defaults={
                "nome": "Administrador",
                "telefone": "11999999999",
                "tipo": "admin",
            }
        )

        comum, criado_comum = User.objects.get_or_create(
            username="usuario",
            defaults={
                "email": "usuario@filminis.com",
                "first_name": "Usuário",
            }
        )

        if criado_comum:
            comum.set_password("usuario123")
            comum.save()

        PerfilUsuario.objects.get_or_create(
            usuario=comum,
            defaults={
                "nome": "Usuário Comum",
                "telefone": "11888888888",
                "tipo": "comum",
            }
        )

        filmes = [
        {
            "titulo": "Crepúsculo",
            "ano": 2008,
            "genero": "Romance / Fantasia",
            "sinopse": "Bella Swan se muda para Forks e conhece Edward Cullen, um jovem misterioso que guarda um segredo sobrenatural. Entre romance e perigo, os dois vivem uma história que mudará suas vidas para sempre.",
            "poster": "https://es.hollywoodreporter.com/wp-content/uploads/2025/08/Crepusculo-regresa-a-cines-por-su-vigesimo-aniversario.jpg",
            "diretor": "Catherine Hardwicke",
            "atores": "Kristen Stewart, Robert Pattinson, Taylor Lautner",
            "produtora": "Summit Entertainment",
            "orcamento": "37000000.00",
            "pais": "Estados Unidos",
            "linguagem": "Inglês",
            "status": "aprovado",
        },
        {
            "titulo": "Encanto",
            "ano": 2021,
            "genero": "Animação / Musical / Fantasia",
            "sinopse": "Uma jovem sem poderes mágicos tenta salvar sua família extraordinária.",
            "poster": "https://lumiere-a.akamaihd.net/v1/images/cg_encanto_disney_22332_e9192d19.jpeg?region=0,0,800,800",
            "diretor": "Jared Bush",
            "atores": "Stephanie Beatriz, María Cecilia Botero",
            "produtora": "Disney",
            "orcamento": "150000000.00",
            "pais": "Estados Unidos",
            "linguagem": "Inglês",
            "status": "aprovado",
        },
        {
            "titulo": "Elementos",
            "ano": 2023,
            "genero": "Animação / Comédia / Fantasia",
            "sinopse": "Uma jovem de fogo e um rapaz de água descobrem que têm muito em comum.",
            "poster": "https://lumiere-a.akamaihd.net/v1/images/elemental_bport_765442cf.png",
            "diretor": "Peter Sohn",
            "atores": "Leah Lewis, Mamoudou Athie",
            "produtora": "Pixar",
            "orcamento": "200000000.00",
            "pais": "Estados Unidos",
            "linguagem": "Inglês",
            "status": "aprovado",
        },
        {
            "titulo": "Zootopia 2",
            "ano": 2016,
            "genero": "Animação / Comédia / Aventura",
            "sinopse": "Uma coelha policial investiga um caso misterioso.",
            "poster": "https://lumiere-a.akamaihd.net/v1/images/nest_instagram_teaser2_poster_brazil_75c497e5.jpeg",
            "diretor": "Byron Howard",
            "atores": "Ginnifer Goodwin, Jason Bateman",
            "produtora": "Disney",
            "orcamento": "150000000.00",
            "pais": "Estados Unidos",
            "linguagem": "Inglês",
            "status": "aprovado",
        },
        {
            "titulo": "Frozen 2",
            "ano": 2019,
            "genero": "Animação / Fantasia / Musical",
            "sinopse": "Elsa busca a origem de seus poderes.",
            "poster": "https://lumiere-a.akamaihd.net/v1/images/image_bf2c13ad.jpeg?region=0,0,540,810",
            "diretor": "Chris Buck",
            "atores": "Idina Menzel, Kristen Bell",
            "produtora": "Disney",
            "orcamento": "150000000.00",
            "pais": "Estados Unidos",
            "linguagem": "Inglês",
            "status": "aprovado",
        },
        {
            "titulo": "Operação Big Hero",
            "ano": 2014,
            "genero": "Animação / Aventura / Ficção Científica",
            "sinopse": "Hiro e Baymax formam uma equipe de heróis.",
            "poster": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjIiYOuFFstT-qp_LpxL75m5rP-PG5yIgATg&s",
            "diretor": "Don Hall",
            "atores": "Ryan Potter, Scott Adsit",
            "produtora": "Disney",
            "orcamento": "165000000.00",
            "pais": "Estados Unidos",
            "linguagem": "Inglês",
            "status": "aprovado",
        },
        {
            "titulo": "Moana 2",
            "ano": 2016,
            "genero": "Animação / Aventura",
            "sinopse": "Uma jovem navegadora parte em uma missão para salvar seu povo.",
            "poster": "https://lumiere-a.akamaihd.net/v1/images/garland_intl_teaser2_poster_brazil_c487c296.jpeg",
            "diretor": "Ron Clements",
            "atores": "Auli'i Cravalho, Dwayne Johnson",
            "produtora": "Disney",
            "orcamento": "150000000.00",
            "pais": "Estados Unidos",
            "linguagem": "Inglês",
            "status": "aprovado",
        },
        {
            "titulo": "Coraline",
            "ano": 2009,
            "genero": "Animação / Fantasia / Terror",
            "sinopse": "Uma garota descobre uma realidade paralela assustadora.",
            "poster": "https://m.media-amazon.com/images/S/pv-target-images/272cac634d75633052a6e94d1772753a62dabbf340f86201acc0b0b306a4e6ca.jpg",
            "diretor": "Henry Selick",
            "atores": "Dakota Fanning, Teri Hatcher",
            "produtora": "Laika",
            "orcamento": "60000000.00",
            "pais": "Estados Unidos",
            "linguagem": "Inglês",
            "status": "aprovado",
        },
        {
            "titulo": "O Castelo Animado",
            "ano": 2004,
            "genero": "Animação / Fantasia",
            "sinopse": "Uma jovem é amaldiçoada e busca ajuda no castelo do mago Howl.",
            "poster": "https://upload.wikimedia.org/wikipedia/pt/5/5d/Hauru_no_Ugoku_Shiro_%28cartaz%29.jpg",
            "diretor": "Hayao Miyazaki",
            "atores": "Chieko Baisho, Takuya Kimura",
            "produtora": "Studio Ghibli",
            "orcamento": "24000000.00",
            "pais": "Japão",
            "linguagem": "Japonês",
            "status": "aprovado",
        },
        {
            "titulo": "A Viagem de Chihiro",
            "ano": 2001,
            "genero": "Animação / Fantasia",
            "sinopse": "Uma menina entra em um mundo mágico para salvar seus pais.",
            "poster": "https://static.wikia.nocookie.net/disney/images/8/80/A_Viagem_de_Chihiro_-_P%C3%B4ster_Nacional.jpeg/revision/latest?cb=20221206031633&path-prefix=pt-br",
            "diretor": "Hayao Miyazaki",
            "atores": "Rumi Hiiragi, Miyu Irino",
            "produtora": "Studio Ghibli",
            "orcamento": "19000000.00",
            "pais": "Japão",
            "linguagem": "Japonês",
            "status": "aprovado",
        },
        {
            "titulo": "Divertida Mente",
            "ano": 2015,
            "genero": "Animação / Comédia",
            "sinopse": "As emoções de uma garota controlam suas decisões.",
            "poster": "https://lumiere-a.akamaihd.net/v1/images/gife454xsaa8wv-_3e8071e7.jpeg",
            "diretor": "Pete Docter",
            "atores": "Amy Poehler, Phyllis Smith",
            "produtora": "Pixar",
            "orcamento": "175000000.00",
            "pais": "Estados Unidos",
            "linguagem": "Inglês",
            "status": "aprovado",
        },
        {
            "titulo": "Filme Pendente de Teste",
            "ano": 2026,
            "genero": "Animação / Aventura",
            "sinopse": "Filme criado para testar a aprovação de filmes.",
            "poster": "https://upload.wikimedia.org/wikipedia/en/3/33/Luca_%282021_film%29.png",
            "diretor": "Diretor Teste",
            "atores": "Ator Teste 1, Ator Teste 2",
            "produtora": "Estúdio Teste",
            "orcamento": "1000000.00",
            "pais": "Brasil",
            "linguagem": "Português",
            "status": "pendente",
        },
    ]

        for dados in filmes:
            Filme.objects.get_or_create(
                titulo=dados["titulo"],
                defaults={
                    **dados,
                    "criado_por": admin,
                }
            )

        self.stdout.write(self.style.SUCCESS("Banco populado com sucesso!"))
        self.stdout.write(self.style.SUCCESS("ADMIN"))
        self.stdout.write(self.style.SUCCESS("Email: admin@filminis.com"))
        self.stdout.write(self.style.SUCCESS("Senha: admin123"))
        self.stdout.write(self.style.SUCCESS("USUÁRIO COMUM"))
        self.stdout.write(self.style.SUCCESS("Email: usuario@filminis.com"))
        self.stdout.write(self.style.SUCCESS("Senha: usuario123"))