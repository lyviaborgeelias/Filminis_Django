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
                "titulo": "Elementos",
                "ano": 2023,
                "genero": "Animação / Comédia / Fantasia",
                "sinopse": "Em uma cidade onde fogo, água, terra e ar convivem, uma jovem de fogo e um rapaz de água descobrem suas diferenças.",
                "poster": "https://upload.wikimedia.org/wikipedia/en/9/98/Elemental_%282023_film%29.png",
                "diretor": "Peter Sohn",
                "atores": "Leah Lewis, Mamoudou Athie",
                "produtora": "Pixar",
                "orcamento": "200000000.00",
                "pais": "Estados Unidos",
                "linguagem": "Inglês",
                "status": "aprovado",
            },
            {
                "titulo": "Encanto",
                "ano": 2021,
                "genero": "Animação / Musical / Fantasia",
                "sinopse": "Uma jovem sem poderes mágicos tenta salvar sua família extraordinária.",
                "poster": "https://upload.wikimedia.org/wikipedia/en/0/00/Encanto_poster.jpg",
                "diretor": "Jared Bush",
                "atores": "Stephanie Beatriz, María Cecilia Botero",
                "produtora": "Walt Disney Animation Studios",
                "orcamento": "150000000.00",
                "pais": "Estados Unidos",
                "linguagem": "Inglês",
                "status": "aprovado",
            },
            {
                "titulo": "Zootopia",
                "ano": 2016,
                "genero": "Animação / Comédia / Aventura",
                "sinopse": "A coelha Judy Hopps se torna policial e investiga um caso misterioso ao lado da raposa Nick Wilde.",
                "poster": "https://upload.wikimedia.org/wikipedia/en/e/ea/Zootopia.jpg",
                "diretor": "Byron Howard, Rich Moore",
                "atores": "Ginnifer Goodwin, Jason Bateman, Idris Elba",
                "produtora": "Walt Disney Animation Studios",
                "orcamento": "150000000.00",
                "pais": "Estados Unidos",
                "linguagem": "Inglês",
                "status": "aprovado",
            },
            {
                "titulo": "Frozen 2",
                "ano": 2019,
                "genero": "Animação / Musical / Fantasia",
                "sinopse": "Elsa, Anna, Kristoff, Olaf e Sven embarcam em uma jornada para descobrir a origem dos poderes de Elsa.",
                "poster": "https://upload.wikimedia.org/wikipedia/en/8/83/Frozen_2_poster.jpg",
                "diretor": "Chris Buck, Jennifer Lee",
                "atores": "Idina Menzel, Kristen Bell, Josh Gad",
                "produtora": "Walt Disney Animation Studios",
                "orcamento": "150000000.00",
                "pais": "Estados Unidos",
                "linguagem": "Inglês",
                "status": "aprovado",
            },
            {
                "titulo": "Filme Pendente de Teste",
                "ano": 2026,
                "genero": "Animação / Aventura",
                "sinopse": "Filme criado para testar a tela de aprovação do administrador.",
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