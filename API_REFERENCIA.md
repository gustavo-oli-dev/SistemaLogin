# 🔌 Guia Completo da API

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1️⃣ Registrar Usuário
**Endpoint**: `POST /auth/register`

**Request**:
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Response (201)**:
```json
{
  "mensagem": "Usuário registrado com sucesso",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Erros**:
- `400`: Campo obrigatório faltando
- `409`: Email já cadastrado

**Exemplo com Axios (React)**:
```javascript
import axios from 'axios';

const registrar = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: 'senha123'
    });
    console.log('Registrado:', response.data);
  } catch (error) {
    console.error('Erro:', error.response.data.erro);
  }
};
```

---

### 2️⃣ Fazer Login
**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Response (200)**:
```json
{
  "mensagem": "Login realizado com sucesso",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Erros**:
- `400`: Email ou senha não fornecidos
- `401`: Email ou senha inválidos

**Exemplo com Axios**:
```javascript
const login = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'joao@email.com',
      senha: 'senha123'
    });
    
    // Salvar dados do usuário
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    console.log('Logado como:', response.data.usuario.nome);
  } catch (error) {
    console.error('Erro de login:', error.response.data.erro);
  }
};
```

---

### 3️⃣ Listar Todos os Usuários
**Endpoint**: `GET /usuarios`

**Response (200)**:
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "data_criacao": "2026-03-18T10:30:45.123456"
  },
  {
    "id": 2,
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "data_criacao": "2026-03-18T11:15:20.654321"
  }
]
```

**Exemplo com Axios**:
```javascript
const carregarUsuarios = async () => {
  const response = await axios.get('http://localhost:5000/api/usuarios');
  setUsuarios(response.data);
};
```

---

### 4️⃣ Obter Estatísticas
**Endpoint**: `GET /estatisticas`

**Response (200)**:
```json
{
  "usuarios_por_dia": [
    {"dia": "Segunda", "quantidade": 5},
    {"dia": "Terça", "quantidade": 8},
    {"dia": "Quarta", "quantidade": 12},
    {"dia": "Quinta", "quantidade": 7},
    {"dia": "Sexta", "quantidade": 15},
    {"dia": "Sábado", "quantidade": 10},
    {"dia": "Domingo", "quantidade": 9}
  ],
  "total_usuarios": 66,
  "novos_usuarios_semana": 66
}
```

**Exemplo com Axios**:
```javascript
const carregarEstatisticas = async () => {
  const response = await axios.get('http://localhost:5000/api/estatisticas');
  
  // Usar para Chart.js
  const labels = response.data.usuarios_por_dia.map(d => d.dia);
  const data = response.data.usuarios_por_dia.map(d => d.quantidade);
  
  atualizarGrafico(labels, data);
};
```

---

### 5️⃣ Atualizar Usuário
**Endpoint**: `PUT /usuarios/{id}`

**Request**:
```json
{
  "nome": "João Silva Atualizado",
  "email": "joao.novo@email.com"
}
```

**Response (200)**:
```json
{
  "mensagem": "Usuário atualizado com sucesso",
  "usuario": {
    "id": 1,
    "nome": "João Silva Atualizado",
    "email": "joao.novo@email.com"
  }
}
```

**Erros**:
- `404`: Usuário não encontrado
- `409`: Email já está em uso

**Exemplo com Axios**:
```javascript
const atualizarUsuario = async (userId, novosDados) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/usuarios/${userId}`,
      novosDados
    );
    console.log('Atualizado:', response.data.usuario);
  } catch (error) {
    console.error('Erro:', error.response.data.erro);
  }
};
```

---

### 6️⃣ Deletar Usuário
**Endpoint**: `DELETE /usuarios/{id}`

**Response (200)**:
```json
{
  "mensagem": "Usuário deletado com sucesso"
}
```

**Erros**:
- `404`: Usuário não encontrado

**Exemplo com Axios**:
```javascript
const deletarUsuario = async (userId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/usuarios/${userId}`
    );
    console.log('Deleted:', response.data.mensagem);
    // Recarregar lista
    carregarUsuarios();
  } catch (error) {
    console.error('Erro:', error.response.data.erro);
  }
};
```

---

### 7️⃣ Health Check
**Endpoint**: `GET /health`

**Response (200)**:
```json
{
  "status": "ok"
}
```

---

## 📊 Fluxo Típico de Uso

```
1. Usuário acessa aplicação (frontend)
   ↓
2. Frontend busca dados de /health (verificação)
   ↓
3. Usuário preenche login
   ↓
4. Frontend POST para /auth/login
   ↓
5. Backend retorna dados do usuário
   ↓
6. Frontend salva em localStorage
   ↓
7. Frontend faz GET para /usuarios
   ↓
8. Frontend faz GET para /estatisticas
   ↓
9. Frontend renderiza Dashboard com dados
   ↓
10. Usuário interage (editar, deletar)
    └→ Frontend faz PUT/DELETE para /usuarios/{id}
```

## 🧪 Testando com cURL (Windows PowerShell)

### Registrar
```powershell
$body = @{
    nome = "João Silva"
    email = "joao@email.com"
    senha = "senha123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Login
```powershell
$body = @{
    email = "joao@email.com"
    senha = "senha123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Listar Usuários
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/usuarios"
```

### Obter Estatísticas
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/estatisticas"
```

### Atualizar Usuário
```powershell
$body = @{
    nome = "Nome Novo"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/usuarios/1" `
  -Method PUT `
  -Body $body `
  -ContentType "application/json"
```

### Deletar Usuário
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/usuarios/1" `
  -Method DELETE
```

## 🔐 Segurança

- Senhas são criptografadas e nunca retornadas pela API
- IDs são retornados para identificação
- Validação de email antes do processamento
- CORS habilitado apenas para localhost

## 📈 Dados de Exemplo

### Resposta completa de Login
```json
{
  "mensagem": "Login realizado com sucesso",
  "usuario": {
    "id": 123,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

### Estrutura de Usuário no Backend
```javascript
{
  "id": 1,                                    // Auto-incrementado
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "$2b$12$...",                     // Hash bcrypt
  "data_criacao": "2026-03-18T10:30:45.123"  // ISO format
}
```

---

**Pronto para usar! 🚀**

Agora você tem uma API completa e documentada para seu aplicativo React!
