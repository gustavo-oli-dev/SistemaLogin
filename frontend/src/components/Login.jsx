import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { API_URL } from '../config/api';

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
    const sanitizedValue = name === 'senha' ? value.replace(/\s/g, '') : value;
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (/\s/.test(formData.senha)) {
      setErro('A senha nao pode conter espacos em branco');
      return;
    }

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
              <span className="eye-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
        {erro && <div className="erro">{erro}</div>}
        <button type="submit" className="login-submit-btn" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p>
        Nao tem conta? <button type="button" onClick={onSwitchMode} className="link-btn">
          Registre-se
        </button>
      </p>
    </div>
  );
}

export default Login;
