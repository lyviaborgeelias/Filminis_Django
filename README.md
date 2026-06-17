# 🎬 Filminis

Sistema de catálogo de filmes desenvolvido com **Django REST Framework** no backend e **React + Vite** no frontend.

---

# 📋 Pré-requisitos

Antes de começar, instale os seguintes programas na sua máquina:

* [Python](https://www.python.org/downloads/?utm_source=chatgpt.com) (3.12 ou superior)
* [Node.js](https://nodejs.org/?utm_source=chatgpt.com) (18 ou superior)
* [MySQL](https://dev.mysql.com/downloads/mysql/?utm_source=chatgpt.com)
* Um editor de código, como o [Visual Studio Code](https://code.visualstudio.com/?utm_source=chatgpt.com)

---

# 🗄️ 1. Configurando o Banco de Dados

O projeto utiliza **MySQL** como banco de dados.

Abra o **MySQL Workbench** ou o terminal MySQL e execute:

```sql
CREATE DATABASE filminis_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

---

## 🔐 Configuração padrão do banco

O projeto já vem configurado com as seguintes credenciais:

| Configuração | Valor       |
| ------------ | ----------- |
| Usuário      | `root`      |
| Senha        | `senai`     |
| Host         | `localhost` |
| Porta        | `3306`      |

O projeto está configurado para usar estes dados no arquivo `backend/backend/settings.py`:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "filminis_db",
        "USER": "root",
        "PASSWORD": "senai",
        "HOST": "localhost",
        "PORT": "3306",
    }
}
```

Se o seu MySQL tiver outra senha, altere o campo `PASSWORD` no arquivo `settings.py`.

---

# ⚙️ 2. Rodando o Backend (Django)

Abra um terminal dentro da pasta do projeto.

---

## 📁 2.1 — Entrar na pasta do backend

```bash
cd backend
```

---

## 🐍 2.2 — Criar ambiente virtual

### Windows

```bash
py -m venv env
```

### Mac/Linux

```bash
python3 -m venv env
```

O ambiente virtual serve para instalar as dependências do projeto separadamente do sistema operacional.

---

## ▶️ 2.3 — Ativar ambiente virtual

### Windows

```bash
.\env\Scripts\activate
```

### Mac/Linux

```bash
source env/bin/activate
```

Se funcionar corretamente, aparecerá:

```bash
(env)
```

no começo da linha do terminal.

---

## 📦 2.4 — Instalar dependências

```bash
pip install -r requirements.txt
```

Serão instaladas bibliotecas como:

* Django
* Django REST Framework
* JWT Authentication
* Pillow
* mysqlclient

---

## 🧱 2.5 — Criar as tabelas no banco

```bash
py manage.py makemigrations
py manage.py migrate
```

> Caso esteja usando Mac/Linux, substitua `py` por `python3`.

---

## 🌱 2.6 — Popular o banco com dados iniciais

```bash
py manage.py popular_banco
```

Esse comando cria automaticamente:

* Filmes
* Usuários
* Dados de exemplo

---

## 🚀 2.7 — Iniciar o servidor backend

```bash
py manage.py runserver
```

O backend estará disponível em:

```bash
http://127.0.0.1:8000
```

---

# 🎨 3. Rodando o Frontend (React + Vite)

Abra um **novo terminal** sem fechar o backend.

---

## 📁 3.1 — Entrar na pasta frontend

```bash
cd frontend
```

---

## 📦 3.2 — Instalar dependências

```bash
npm install
```

---

## ▶️ 3.3 — Rodar o frontend

```bash
npm run dev
```

O frontend estará disponível em:

```bash
http://localhost:5173
```

---

# 🔗 Integração Frontend + Backend

O frontend já está configurado para consumir a API em:

```bash
http://127.0.0.1:8000/api
```

Arquivo responsável:

```bash
frontend/src/services/api.js
```

---

# 🔑 Contas para Login

Após executar o comando:

```bash
py manage.py popular_banco
```

Você poderá acessar com:

| Tipo             | E-mail                                              | Senha      |
| ---------------- | --------------------------------------------------- | ---------- |
| 👑 Administrador | [admin@filminis.com](mailto:admin@filminis.com)     | admin123   |
| 👤 Usuário       | [usuario@filminis.com](mailto:usuario@filminis.com) | usuario123 |

---

# 📁 Estrutura do Projeto

```bash
Filminis_Django-main/
│
├── backend/
│   ├── api/                 # Models, views, serializers e rotas
│   ├── backend/             # Configurações principais do Django
│   ├── media/               # Uploads e imagens
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/      # Componentes reutilizáveis
    │   ├── pages/           # Páginas do sistema
    │   ├── services/        # Configuração da API
    │   └── styles/          # Arquivos CSS
    │
    └── package.json
```

---

# 🚀 Resumo Rápido

## Backend

```bash
cd backend

py -m venv env
.\env\Scripts\activate

pip install -r requirements.txt

py manage.py makemigrations
py manage.py migrate
py manage.py popular_banco

py manage.py runserver
```

---

## Frontend

```bash
cd frontend

npm install
npm run dev
```

---

# ❓ Problemas Comuns

## ❌ `django.db.utils.OperationalError`

### Possíveis causas:

* MySQL desligado
* Usuário/senha incorretos
* Banco não criado

### Solução:

Verifique o arquivo:

```bash
backend/backend/settings.py
```

---

## ❌ `'py' não é reconhecido`

Tente usar:

```bash
python
```

ou:

```bash
python3
```

---

## ❌ Página branca no frontend

Verifique se o backend está rodando corretamente em:

```bash
http://127.0.0.1:8000
```

---

## ❌ Erro ao instalar dependências do Python

Atualize o pip:

```bash
python -m pip install --upgrade pip
```

Depois tente novamente:

```bash
pip install -r requirements.txt
```

---

# 🛠️ Tecnologias Utilizadas

## Backend

* Python
* Django
* Django REST Framework
* JWT Authentication
* MySQL

## Frontend

* React
* Vite
* Axios
* CSS

---

# 👨‍💻 Desenvolvido para fins educacionais

Projeto desenvolvido para estudo de integração entre frontend e backend utilizando Django REST API e React.
