--->> ⚙️BACKEND
cd backend
py -m venv env
.\env\Scripts\activate
pip install -r requirements.txt

--->> 🛢️CRIAR BANCO NO MYSQL (antes de terminar de rodar o backend)
CREATE DATABASE filminis_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE filminis_db;

py manage.py makemigrations
py manage.py migrate
py manage.py popular_banco
py manage.py runserver

--->> 🎨FRONTEND
cd frontend
npm install
npm run dev

--->> 🛡️LOGIN ADM
Email: admin@filminis.com
Senha: admin123

--->> 👤LOGIN USUARIO
Email: usuario@filminis.com
Senha: usuario123
