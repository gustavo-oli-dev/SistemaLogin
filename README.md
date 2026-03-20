# Sistema de Login & Registro

Um projeto completo com CRUD básico de login/registro de usuários.

## Estrutura

- **Backend**: Python + Flask (porta 5000)
- **Frontend**: React (porta 3000)

## Funcionalidades

### Backend
- ✅ Registro de novos usuários
- ✅ Login com validação
- ✅ CRUD completo de usuários (Create, Read, Update, Delete)
- ✅ API RESTful
- ✅ Criptografia de senhas

### Frontend
- ✅ Interface de Login
- ✅ Interface de Registro
- ✅ Dashboard com dados do usuário
- ✅ Gráficos de estatísticas (Chart.js)
- ✅ Tabela de usuários cadastrados
- ✅ Editar perfil
- ✅ Deletar usuários

## Como executar

### Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
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

Acesse `http://localhost:3000` no navegador.

## Endpoints da API

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/usuarios` - Listar todos os usuários
- `GET /api/estatisticas` - Obter dados para gráficos
- `PUT /api/usuarios/<id>` - Atualizar usuário
- `DELETE /api/usuarios/<id>` - Deletar usuário
- `GET /api/health` - Health check
