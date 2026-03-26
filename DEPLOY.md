# 📤 Guia de Deploy no GitHub

## Passo 1: Adicionar o novo repositório (sem perder o atual)

```bash
# Navegar até o diretório do projeto
cd "c:\Users\gusta\OneDrive\Documents\Projeto sistema de login\sistema-login-register"

# Adicionar novo repositório remoto
git remote add origin-novo https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Ou se quiser substituir o atual:
git remote set-url origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

## Passo 2: Configurar credenciais do Git

### Opção A: Git Credential Manager (recomendado)
O Windows irá solicitar suas credenciais GitHub na primeira tentativa de push.

### Opção B: Token de acesso pessoal
```bash
# Usar token como senha (melhor para CI/CD)
# URL: https://github.com/settings/tokens
# Gerar um Fine-grained personal access token com permissões de repositório
```

### Opção C: SSH (mais seguro)
```bash
# Gerar chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "seu_email@example.com"

# Adicionar ao SSH agent
ssh-add ~/.ssh/id_ed25519

# Copiar conteúdo da chave pública para GitHub
# https://github.com/settings/keys
```

## Passo 3: Fazer Push do projeto

```bash
# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Sistema de Login e Registro completo"

# Enviar para o novo repositório (substitua origin-novo por origin se tiver substituído)
git push -u origin-novo main
# ou
git push -u origin main
```

## Passo 4: Iniciar o projeto localmente

### Opção A: Usar o script de inicialização
Clique 2x no arquivo `start.bat` (Windows) ou execute:
```bash
./start.bat
```

### Opção B: Iniciar manualmente
```bash
# Terminal 1 (Backend)
cd backend
python app.py

# Terminal 2 (Frontend)
cd frontend
npm start
```

A aplicação será aberta em: **http://localhost:3000**

---

## Credenciais para usar no Git

Quando o Windows solicitar credentials:
- **Username**: Seu usuário do GitHub
- **Password**: Seu token pessoal OU sua senha do GitHub

## Verificar status do repositório

```bash
git remote -v
git log --oneline
```

## Estrutura do projeto

```
sistema-login-register/
├── backend/          # API Flask (porta 5000)
├── frontend/         # React (porta 3000)
├── docs/             # Documentação
├── .gitignore        # Arquivos a ignorar no Git
├── README.md         # Informações do projeto
├── start.bat         # Script para iniciar tudo
└── DEPLOY.md         # Este arquivo
```

---

**Pronto!** Seu projeto está configurado para fazer push em qualquer repositório GitHub.
