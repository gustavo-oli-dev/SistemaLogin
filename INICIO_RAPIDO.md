# ⚡ Guia Rápido - Primeiros Passos

## 🎯 Objetivo
Sistema completo de login/registro com dashboard e gráficos.

## 📋 Pré-requisitos

- [ ] Python 3.8+ instalado ([download](https://www.python.org/))
- [ ] Node.js + npm instalado ([download](https://nodejs.org/))
- [ ] Git instalado (opcional, para commits) ([download](https://git-scm.com/))
- [ ] Editor de código (VS Code recomendado)

## 🚀 Execução Rápida

### Opção 1: Terminal Separados (Recomendado)

#### Terminal 1 - Backend
```bash
# Navegar para o backend
cd "c:\Users\gusta\OneDrive\Documents\Pórtifolio Projetos\sistema-login-register\backend"

# Criar ambiente virtual Python
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

Você verá:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

#### Terminal 2 - Frontend
```bash
# Navegar para o frontend
cd "c:\Users\gusta\OneDrive\Documents\Pórtifolio Projetos\sistema-login-register\frontend"

# Instalar dependências
npm install

# Executar aplicação
npm start
```

Você verá:
```
Compiled successfully!

You can now view sistema-login-register in the browser.
Local:            http://localhost:3000
```

## 🎨 Testando a Aplicação

### 1. Abre o navegador em `http://localhost:3000`

### 2. Primeiro acesso - Registrar
- Clique em **"Registre-se"**
- Preencha:
  - Nome: `João Silva`
  - Email: `joao@email.com`
  - Senha: `senha123`
- Clique em **"Registrar"**
- Você será redirecionado ao login

### 3. Fazer Login
- Email: `joao@email.com`
- Senha: `senha123`
- Clique em **"Entrar"**
- 🎉 Você está no Dashboard!

### 4. Explorar o Dashboard
- 👤 **Perfil**: Seu nome e email
- ✏️ **Editar Perfil**: Clique para mudar seu nome
- 📊 **Gráficos**: 
  - Gráfico de linha mostrando usuários por dia
  - Gráfico de barras com estatísticas
- 📋 **Tabela**: Lista de todos os usuários registrados
- 🗑️ **Deletar**: Remover usuários da tabela

## 🧪 Testando API Diretamente (Curl)

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Registrar Usuário
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"nome\":\"Maria\",\"email\":\"maria@email.com\",\"senha\":\"123456\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"maria@email.com\",\"senha\":\"123456\"}"
```

### Listar Usuários
```bash
curl http://localhost:5000/api/usuarios
```

### Obter Estatísticas
```bash
curl http://localhost:5000/api/estatisticas
```

## ❌ Problemas Comuns

### "ModuleNotFoundError: No module named 'flask'"
```bash
# Certifique-se que está no diretório backend e o venv está ativado
pip install -r requirements.txt
```

### "npm: the term 'npm' is not recognized"
- Node.js não está instalado
- [Baixe e instale](https://nodejs.org/)

### Porta 3000 ou 5000 já em uso
```bash
# Backend (mudar porta em app.py última linha: app.run(port=5001))
# Frontend (mudar porta: PORT=3001 npm start)
```

### CORS Error
- Certifique-se que ambos (backend e frontend) estão rodando
- Backend em http://localhost:5000
- Frontend em http://localhost:3000

### Dados desaparecem após refresh
- É normal! Dados estão em memória (backend)
- Para persistir, use banco de dados (ver RESUMO_PROJETO.md)

## 📚 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `COMMITS_SEMANTICOS.md` | Como fazer commits com padrão semântico |
| `RESUMO_PROJETO.md` | Overview completo do projeto |
| `GUIA.md` | Detalhes técnicos |
| `README.md` | Documentação geral |

## 🔗 Links Úteis

- [React Docs](https://react.dev/learn)
- [Flask Docs](https://flask.palletsprojects.com/)
- [Chart.js Docs](https://www.chartjs.org/docs/latest/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Docs](https://git-scm.com/doc)

## ✅ Checklist

- [ ] Python 3.8+, Node.js e npm instalados
- [ ] Backend rodando em http://localhost:5000
- [ ] Frontend rodando em http://localhost:3000
- [ ] Consegui registrar um novo usuário
- [ ] Consegui fazer login
- [ ] Visualizei os gráficos
- [ ] Consegui editar perfil
- [ ] Consegui deletar usuário
- [ ] Explorei a API com curl

## 🎓 Próximo: Commits Semânticos

Quando estiver pronto para versionamento:
1. Instale Git
2. Abra `COMMITS_SEMANTICOS.md`
3. Siga os comandos

---

**Status**: ✅ Pronto para começar!

Dúvidas? Verifique os arquivos de documentação! 📚
