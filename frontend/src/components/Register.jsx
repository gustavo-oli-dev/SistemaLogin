import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { API_URL } from '../config/api';

function Register({ onSuccess, onSwitchMode }) {
  const [formData, setFormData] = useState({
    nome: '',
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

    if (formData.senha.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres');
      return;
    }

    setCarregando(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      const usuarioComSenha = {
        ...response.data.usuario,
        senha: formData.senha,
        is_admin: response.data.usuario?.is_admin || false
      };
      localStorage.setItem('usuario', JSON.stringify(usuarioComSenha));
      localStorage.setItem('token', 'logged-in');
      setFormData({ nome: '', email: '', senha: '' });
      onSuccess(usuarioComSenha);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Registrar-se</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome de usuario:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
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
              minLength={4}
              title="A senha deve ter pelo menos 4 caracteres"
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
        <button type="submit" disabled={carregando}>
          {carregando ? 'Registrando...' : 'Registrar'}
        </button>
        <button type="button" onClick={onSwitchMode} className="switch-btn">
          Voltar
        </button>
      </form>
    </div>
  );
}

export default Register;
