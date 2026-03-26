# Sistema de Login & Registro

Aplicacao full stack com autenticacao, painel administrativo e CRUD de usuarios.

## Acessar projeto

[Abrir aplicacao](https://sistema-login-register-web.onrender.com)

## Estrutura

- `backend`: API Flask na porta `5000`
- `frontend`: interface React na porta `3000`
- `docs`: documentacao do projeto
- `scripts/verification`: automacoes e verificacoes

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

### ⚡ Opção Rápida (Recomendado)
Clique 2x no arquivo `start.bat` (Windows) para iniciar frontend e backend automaticamente!

Ou execute no terminal:
```bash
./start.bat
```

A aplicação abrirá automaticamente em `http://localhost:3000`

---

### Manual - Backend
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

### Manual - Frontend
```bash
cd frontend
npm install
npm start
```

O frontend usa `REACT_APP_API_URL` quando definida. Sem essa variavel, ele usa `http://localhost:5000/api`.

## Documentacao

- `docs/INICIO_RAPIDO.md`: primeiros passos
- `docs/GUIA.md`: guia tecnico
- `docs/API_REFERENCIA.md`: referencia da API
- `docs/COMMITS_SEMANTICOS.md`: commits semanticos
- `docs/RESUMO_PROJETO.md`: resumo do projeto
- `docs/ENTREGA_COMPLETA.md`: checklist da entrega

## Scripts de verificacao

- `scripts/verification/verificar-erros.bat`
- `scripts/verification/verificar-geral.bat`
- `scripts/verification/verificar-permissoes-admin.bat`
- `scripts/verification/verificar-publico.bat`

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
