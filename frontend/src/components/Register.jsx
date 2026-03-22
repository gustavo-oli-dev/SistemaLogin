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
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      setFormData({ nome: '', email: '', senha: '' });
      onSuccess(response.data.mensagem || 'Usuario registrado com sucesso');
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
          <label>Nome de usuário:</label>
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
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
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
