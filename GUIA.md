# Projeto Sistema de Login & Registro

## 📋 Estrutura do Projeto

```
sistema-login-register/
├── backend/
│   ├── app.py              # Aplicação Flask principal
│   ├── requirements.txt    # Dependências Python
│   └── .env               # Variáveis de ambiente
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── App.jsx        # Componente raiz
│   │   └── index.jsx      # Entrada da aplicação
│   ├── package.json       # Dependências npm
│   └── public/            # Arquivos estáticos
└── README.md
```

## 🚀 Como Iniciar

### 1. Backend (Python + Flask)
```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar (Windows)
venv\Scripts\activate

# Ativar (Mac/Linux)
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Executar servidor
python app.py
```

O backend estará em: **http://localhost:5000**

### 2. Frontend (React)
```bash
cd frontend

# Instalar dependências
npm install

# Executar desenvolvimento
npm start
```

O frontend estará em: **http://localhost:3000**

## 📊 Funcionalidades

- ✅ **Registro de Usuários**: Validação e criptografia de senhas
- ✅ **Login**: Autenticação com armazenamento local
- ✅ **Dashboard**: Visualização de perfil e estatísticas
- ✅ **Gráficos**: Dashboard com Chart.js (linha e barras)
- ✅ **Gerenciamento**: CRUD completo de usuários
- ✅ **API RESTful**: Endpoints bem estruturados

## 🔑 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/usuarios` | Listar usuários |
| GET | `/api/estatisticas` | Dados para gráficos |
| PUT | `/api/usuarios/<id>` | Atualizar usuário |
| DELETE | `/api/usuarios/<id>` | Deletar usuário |

## 🎨 Interface

- **Login**: Email e senha
- **Registro**: Nome, email e senha
- **Dashboard**: Perfil, gráficos e tabela de usuários

## 📝 Commits Semânticos

O projeto segue o padrão de [Conventional Commits](https://www.conventionalcommits.org/).

### Formato:
```
<tipo>(<escopo>): <assunto>

<corpo>

<rodapé>
```

### Tipos disponíveis:
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação de código
- **refactor**: Refatoração de código
- **test**: Testes
- **chore**: Tarefas (dependências, build, etc.)

### Exemplos:
- `feat(auth): adicionar sistema de registro`
- `fix(login): corrigir validação de email`
- `docs: adicionar instruções de instalação`
- `chore(deps): atualizar dependências`
