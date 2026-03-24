# Sistema de Login & Registro

Aplicacao full stack com autenticacao, painel administrativo e CRUD de usuarios.

## Acessar projeto

[Abrir aplicacao](https://sistema-login-register-web.onrender.com)

## Estrutura

- `backend`: API Flask na porta `5000`
- `frontend`: interface React na porta `3000`

## Funcionalidades

### Backend
- Registro de novos usuarios
- Login com validacao
- CRUD completo de usuarios
- API REST
- Senhas com hash

### Frontend
- Tela de login
- Tela de cadastro
- Dashboard do usuario
- Graficos com Chart.js
- Tabela de usuarios cadastrados
- Edicao de perfil
- Exclusao de usuarios por administrador

## Como executar localmente

### Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

O frontend usa `REACT_APP_API_URL` quando definida. Sem essa variavel, ele usa `http://localhost:5000/api`.

## Link publico

Para abrir o projeto a partir do GitHub, use este link publico no README:

`https://sistema-login-register-web.onrender.com`

O projeto ja inclui `render.yaml`, entao o caminho mais simples para manter esse deploy e:

1. Subir este diretorio para um repositorio no GitHub.
2. Entrar em `https://render.com`.
3. Clicar em `New +` > `Blueprint`.
4. Conectar o repositorio do GitHub.
5. Confirmar a criacao dos 2 servicos:
   - `sistema-login-register-api`
   - `sistema-login-register-web`

Depois do deploy, o Render cria um link publico para o frontend e outro para a API.

## Endpoints da API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/usuarios`
- `GET /api/estatisticas`
- `PUT /api/usuarios/<id>`
- `DELETE /api/usuarios/<id>`
- `GET /api/health`
