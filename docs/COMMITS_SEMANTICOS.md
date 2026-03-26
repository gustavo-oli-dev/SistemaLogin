# 📝 Sobre Commits Semânticos

## O que são Commits Semânticos?

Commits semânticos (também chamados de Conventional Commits) são uma convenção para escrever mensagens de commit de forma estruturada e padronizada. Isso facilita:

- 📖 **Legibilidade**: Entender rapidamente o que mudou
- 🤖 **Automação**: Ferramentas podem gerar changelogs automáticamente
- 📊 **Versionamento**: Facilita determinar versões (semver)
- 👥 **Colaboração**: Times trabalham com padrão consistente

## Formato Padrão

```
<tipo>(<escopo>): <assunto>

<corpo (opcional)>

<rodapé (opcional)>
```

### Exemplo Completo
```
feat(auth): adicionar sistema de autenticação com JWT

Implementa login e registro de usuários com criptografia
de senhas. Adiciona validação de email e senhas fortes.

Closes #123
```

## Tipos de Commits

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **feat** | Nova funcionalidade | `feat(login): adicionar autenticação` |
| **fix** | Correção de bug | `fix(dashboard): corrigir gráfico` |
| **docs** | Documentação | `docs: adicionar guia de instalação` |
| **style** | Formatação (sem lógica) | `style: ajustar espaçamento` |
| **refactor** | Refatoração sem mudança | `refactor(api): simplificar codigo` |
| **test** | Testes | `test(auth): adicionar testes de login` |
| **chore** | Tarefas (deps, build) | `chore: atualizar dependências` |
| **perf** | Otimização | `perf(api): melhorar performance` |
| **ci** | CI/CD | `ci: adicionar GitHub Actions` |

## Cada commit deste projeto

### 1. Estrutura inicial
```bash
git init
git config user.name "Seu Nome"
git config user.email "seu@email.com"
git add .
git commit -m "chore: estrutura inicial do projeto"
```

### 2. Backend - API com autenticação
```bash
git add backend/
git commit -m "feat(backend): implementar API Flask com autenticação

- Criar rota de registro com criptografia de senha
- Criar rota de login com validação
- Implementar CRUD de usuários
- Adicionar endpoints de estatísticas
- Usar werkzeug para segurança"
```

### 3. Frontend - Componentes React
```bash
git add frontend/src/components/
git add frontend/src/App.jsx
git add frontend/package.json
git commit -m "feat(frontend): implementar interface React com autenticação

- Criar componente de Login com validação
- Criar componente de Registro
- Criar componente de Dashboard
- Adicionar estilos CSS responsivos
- Integrar com API backend"
```

### 4. Dashboard - Gráficos
```bash
git add frontend/src/components/Dashboard.jsx
git add frontend/src/components/Dashboard.css
git commit -m "feat(dashboard): adicionar gráficos com Chart.js

- Gráfico de linha: usuários por dia
- Gráfico de barras: estatísticas gerais
- Tabela de usuários cadastrados
- Funcionalidade de editar e deletar usuários"
```

### 5. Documentação
```bash
git add docs/GUIA.md
git add README.md
git commit -m "docs: adicionar guia completo do projeto

- Instruções de instalação
- Estrutura de pastas
- Endpoints da API
- Padrão de commits semânticos"
```

## Como fazer commits semânticos

### Passo a passo:

1. **Faça suas mudanças** no código

2. **Prepare para commit** (staging)
   ```bash
   git add .
   ```

3. **Crie o commit** com mensagem semântica
   ```bash
   git commit -m "tipo(escopo): descrição"
   ```

4. **Envie para repositório remoto** (opcional)
   ```bash
   git push origin main
   ```

## ✨ Melhores Práticas

1. **Uma funcionalidade por commit**
   ```bash
   # ✅ Bom
   git commit -m "feat(auth): adicionar validação de email"
   git commit -m "feat(auth): adicionar criptografia de senha"
   
   # ❌ Ruim
   git commit -m "adicionar autenticação e dashboard"
   ```

2. **Use imperativo na descrição**
   ```bash
   # ✅ Bom
   git commit -m "feat(api): adicionar endpoint de usuários"
   
   # ❌ Ruim
   git commit -m "feat(api): adicionado endpoint de usuários"
   ```

3. **Seja descritivo no corpo**
   ```bash
   git commit -m "fix(login): corrigir validação de senha
   
   - A validação aceitava senhas com menos de 8 caracteres
   - Agora valida comprimento minimo
   - Testes adicionados"
   ```

## 🔧 Instalando Git

### Windows
- Baixe em: https://git-scm.com/download/win
- Execute o instalador
- Use as configurações padrão

### Mac
```bash
brew install git
```

### Linux
```bash
sudo apt-get install git
```

## 📋 Script Pronto para Copiar-Colar

Depois de instalar Git, execute em ordem:

```bash
cd "c:\Users\gusta\OneDrive\Documents\Pórtifolio Projetos\sistema-login-register"

# Configurar Git (primeira vez)
git config user.name "Seu Nome Aqui"
git config user.email "seu@email.com"

# Inicializar repositório
git init

# Commit 1: Estrutura
git add .
git commit -m "chore: estrutura inicial do projeto"

# Commit 2: Backend
git add backend/
git commit -m "feat(backend): implementar API Flask com autenticação

- Rota de registro com criptografia de senha
- Rota de login com validação
- CRUD completo de usuários
- Endpoints para estatísticas
- Health check da API"

# Commit 3: Frontend
git add frontend/src/
git commit -m "feat(frontend): implementar interface React

- Componente de Login
- Componente de Registro
- Sistema de autenticação com localStorage
- Estilos responsivos
- Integração com API backend"

# Commit 4: Dashboard
git add frontend/src/components/Dashboard.jsx
git commit -m "feat(dashboard): adicionar gráficos e gerenciamento

- Gráfico de linha com Chart.js
- Gráfico de barras com estatísticas
- Tabela de usuários
- Funcionalidade de editar e deletar"

# Commit 5: Documentação
git add docs/GUIA.md README.md
git commit -m "docs: adicionar documentação completa

- Guia de commits semânticos
- README com instruções
- Estrutura do projeto
- Endpoints da API"

# Ver histórico de commits
git log --oneline
```

## 📊 Resultado esperado

Após os commits, você terá:
```
* d1f2e3c docs: adicionar documentação completa
* c3b2a1e feat(dashboard): adicionar gráficos e gerenciamento
* b2a1c3f feat(frontend): implementar interface React
* a1f2b3c feat(backend): implementar API Flask com autenticação
* 1a2b3c4 chore: estrutura inicial do projeto
```

## 🌐 Conectar a GitHub (opcional)

1. Crie um repositório em GitHub
2. Execute:
```bash
git remote add origin https://github.com/seu-usuario/seu-repo.git
git branch -M main
git push -u origin main
```

## Dúvidas?

Consulte:
- https://www.conventionalcommits.org/ - Especificação oficial
- https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines - Guia do Angular
