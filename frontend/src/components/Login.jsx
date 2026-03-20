import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
const API_URL = 'http://localhost:5000/api';
function Login({ onSuccess, onSwitchMode }) {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      const usuarioComSenha = { ...response.data.usuario, senha: formData.senha };
      localStorage.setItem('usuario', JSON.stringify(usuarioComSenha));
      localStorage.setItem('token', 'logged-in');
      onSuccess(usuarioComSenha);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <div className="password-input-wrapper">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className={`password-toggle-btn ${!mostrarSenha ? 'oculta' : ''}`}
              onClick={() => setMostrarSenha(!mostrarSenha)}
              title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              👁️‍🗨️
            </button>
          </div>
        </div>
        {erro && <div className="erro">{erro}</div>}
        <button type="submit" className="login-submit-btn" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p>
        Não tem conta? <button type="button" onClick={onSwitchMode} className="link-btn">
          Registre-se
        </button>
      </p>
    </div>
  );
}
export default Login;
