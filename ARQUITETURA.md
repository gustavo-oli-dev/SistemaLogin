# 🏗️ Arquitetura do Sistema

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR                               │
│                      (Localhost:3000)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    APLICAÇÃO REACT                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                            │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐ │  │
│  │  │   LOGIN     │  │  REGISTER    │  │   DASHBOARD      │ │  │
│  │  │             │  │              │  │                  │ │  │
│  │  │ • Email     │  │ • Nome       │  │ • Gráfico Linha  │ │  │
│  │  │ • Senha     │  │ • Email      │  │ • Gráfico Barras │ │  │
│  │  │             │  │ • Senha      │  │ • Tabela Usuários│ │  │
│  │  │ [Entrar]    │  │              │  │ • Edit Perfil    │ │  │
│  │  │             │  │ [Registrar]  │  │ • Delete Usuário │ │  │
│  │  └─────────────┘  └──────────────┘  │ • Logout         │ │  │
│  │                                      └──────────────────┘ │  │
│  │                                                            │  │
│  │           Axios (HTTP Requests)                           │  │
│  │           LocalStorage (Sessão)                           │  │
│  │           Chart.js (Gráficos)                             │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           │ HTTP/REST                           │
│                           ▼                                      │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
        
┌──────────────────────────────────────────────────────────┐
│                    SERVIDOR (Localhost:5000)             │
│                    Flask + Python                        │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │                CAMADA DE ROTAS                     │  │
│  ├────────────────────────────────────────────────────┤  │
│  │                                                    │  │
│  │  POST /auth/register    ─┐                        │  │
│  │  POST /auth/login       ─┤                        │  │
│  │  GET  /usuarios         ─┼─► PROCESSAMENTO        │  │
│  │  PUT  /usuarios/<id>    ─┤                        │  │
│  │  DELETE /usuarios/<id>  ─┤                        │  │
│  │  GET  /estatisticas    ─┘                        │  │
│  │  GET  /health                                     │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                           │                                │
│                           ▼                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │           BANCO DE DADOS (Memory)                 │  │
│  │  (Pronto para integrar SQL/NoSQL)                │  │
│  ├────────────────────────────────────────────────────┤  │
│  │                                                    │  │
│  │  users_db = [                                     │  │
│  │    {                                              │  │
│  │      id: 1,                                       │  │
│  │      nome: "João Silva",                          │  │
│  │      email: "joao@email.com",                     │  │
│  │      senha: "$2b$12$..." (encrypted),             │  │
│  │      data_criacao: "2026-03-18..."                │  │
│  │    },                                             │  │
│  │    ...                                            │  │
│  │  ]                                                │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  Funcionalidades:                                          │
│  • Hash de senhas com Werkzeug                            │
│  • Validação de entrada                                   │
│  • CORS habilitado                                        │
│  • Tratamento de erros                                    │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

## Fluxo de Dados - Login

```
┌─────────────────────────────────────────┐
│   Usuário preenche Login (email/senha)  │
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Clica em "Entrar" │
        └────────┬──────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Validação no Frontend │ (email não vazio, etc)
        └────────┬─────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ POST /api/auth/login                                │
│ {email: "joao@email.com", senha: "senha123"}       │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Backend - Procura usuário por email                 │
│ Compara hash de senha                               │
└────────────────┬────────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
        ✓ (correto)    ✗ (erro)
         │                │
         ▼                ▼
    ┌────────────┐   ┌──────────────┐
    │ Retorna    │   │ Retorna erro │
    │ (200 OK)   │   │ (401)        │
    └────┬──────┘   └──────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Frontend - Salva em localStorage:        │
│ {id: 1, nome: "João", email: "joao..."} │
└────────┬─────────────────────────────────┘
         │
         ▼
    ┌─────────────────┐
    │ Redireciona     │
    │ para Dashboard  │
    └─────────────────┘
```

## Fluxo de Dados - Editar Usuário

```
┌────────────────────────────────┐
│ Usuário no Dashboard            │
│ Clica "Editar Perfil"           │
└────────────┬────────────────────┘
             │
             ▼
   ┌──────────────────────┐
   │ Campo fica editável  │
   │ (nome pode mudar)    │
   └────────┬─────────────┘
            │
            ▼
┌──────────────────────────────────┐
│ Clica "Salvar"                   │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ PUT /api/usuarios/1                          │
│ {nome: "João Silva Novo"}                    │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Backend - Valida novo nome                   │
│ Backend - Verifica se nome já existe         │
│ Backend - Atualiza no banco                  │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Retorna (200 OK):                            │
│ {mensagem: "Atualizado com sucesso",         │
│  usuario: {id: 1, nome: "João Silva Novo"}} │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Frontend - Atualiza localStorage             │
│ Frontend - Renderiza novo nome na interface │
│ Mostra mensagem de sucesso                   │
└──────────────────────────────────────────────┘
```

## Estrutura de Pastas Específica

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx          (90 linhas)
│   │   │   └─ Formulário de login
│   │   │   └─ Validação
│   │   │   └─ Chamada para /auth/login
│   │   │
│   │   ├── Register.jsx       (80 linhas)
│   │   │   └─ Formulário de registro
│   │   │   └─ Validação
│   │   │   └─ Chamada para /auth/register
│   │   │
│   │   ├── Dashboard.jsx      (150 linhas)
│   │   │   └─ Exibe perfil do usuário
│   │   │   └─ Renderiza gráficos
│   │   │   └─ Lista usuários
│   │   │   └─ Permite editar/deletar
│   │   │
│   │   ├── Auth.css           (70 linhas)
│   │   │   └─ Estilos de login/register
│   │   │
│   │   └─ Dashboard.css       (150 linhas)
│   │       └─ Estilos do dashboard
│   │       └─ Grid responsivo
│   │       └─ Tabela de usuários
│   │
│   ├── App.jsx               (60 linhas)
│   │   └─ Componente raiz
│   │   └─ Gerencia estado de autenticação
│   │   └─ Roteamento entre telas
│   │
│   ├── index.jsx             (10 linhas)
│   │   └─ Entrada da aplicação
│   │
│   └─ index.css              (30 linhas)
│       └─ Estilos globais

backend/
├── app.py                    (200 linhas)
│   ├─ Flask app
│   ├─ CORS config
│   ├─ Database em memória
│   ├─ Rotas de autenticação
│   ├─ CRUD de usuários
│   └─ Endpoints de dados
│
├── requirements.txt
│   ├─ Flask==2.3.3
│   ├─ Flask-CORS==4.0.0
│   └─ Werkzeug==2.3.7
│
├── .env
│   └─ FLASK_DEBUG=True
│
└─ .gitignore
    └─ __pycache__, venv, etc
```

## Bibliotecas de Terceiros

```
Frontend:
┌─────────────────────────────────────┐
│ React 18.2.0                        │
│ └─ Componentes e JSX                │
│                                     │
│ Axios 1.4.0                         │
│ └─ HTTP requests (GET, POST, etc)   │
│                                     │
│ React Router 6.14.0                 │
│ └─ Navegação entre páginas           │
│                                     │
│ Chart.js 4.3.0                      │
│ └─ Gráficos (Linha, Barras)         │
│                                     │
│ React ChartJS 5.2.0                 │
│ └─ Integração Chart.js com React    │
└─────────────────────────────────────┘

Backend:
┌─────────────────────────────────────┐
│ Flask 2.3.3                         │
│ └─ Framework web                     │
│                                     │
│ Flask-CORS 4.0.0                    │
│ └─ Habilitamultiple "Entrar"        │
│   requisições de diferentes        │
│   domínios                          │
│                                     │
│ Flask-SQLAlchemy 3.0.5              │
│ └─ ORM para banco de dados          │
│   (sem suporte no código inicial)   │
│                                     │
│ Werkzeug 2.3.7                      │
│ └─ Hash de senhas (bcrypt)          │
│ └─ Utilitários web                  │
│                                     │
│ Python-dotenv 1.0.0                 │
│ └─ Variáveis de ambiente (.env)     │
└─────────────────────────────────────┘
```

## Fluxo de Autenticação

```
1. REGISTRO
   ├─ Usuário submete (nome, email, senha)
   ├─ Validação no frontend
   ├─ POST para /auth/register
   ├─ Backend valida dados
   ├─ Backend criptografa senha
   ├─ Backend salva em banco
   └─ Usuário redireciona para login

2. LOGIN
   ├─ Usuário submete (email, senha)
   ├─ Validação no frontend
   ├─ POST para /auth/login
   ├─ Backend procura usuário
   ├─ Backend valida senha
   ├─ Frontend salva em localStorage
   └─ Usuário acessa Dashboard

3. DASHBOARD
   ├─ Carrega dados do usuário (localStorage)
   ├─ GET /usuarios (lista)
   ├─ GET /estatisticas (gráficos)
   ├─ Renderiza componentes
   ├─ Aguarda interações
   └─ CRUD de usuários

4. LOGOUT
   ├─ Usuário clica "Sair"
   ├─ Remove localStorage
   ├─ Redireciona para Login
   └─ Ciclo recomeça
```

---

**Esta é a arquitetura completa do seu sistema!** 🚀

Todos os componentes trabalham juntos para criar uma experiência suave de autenticação e gerenciamento de usuários.
