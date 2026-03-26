import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import './Dashboard.css';
import { API_URL } from '../config/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function Dashboard({ usuario, onLogout, onUsuarioAtualizado }) {
  const [usuarios, setUsuarios] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [gerindoCargos, setGerindoCargos] = useState(false);
  const [cargoSelecionado, setCargoSelecionado] = useState('usuario');
  const [salvandoCargo, setSalvandoCargo] = useState(false);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [erroPerfil, setErroPerfil] = useState('');
  const [perfilForm, setPerfilForm] = useState({
    nome: usuario.nome,
    email: usuario.email,
    senha: usuario.senha || ''
  });

  useEffect(() => {
    setPerfilForm({
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha || ''
    });
  }, [usuario]);

  const carregarDados = useCallback(async () => {
    try {
      const headers = { 'X-User-Email': usuario.email };
      const [usuariosRes, estRes] = await Promise.all([
        axios.get(`${API_URL}/usuarios`, { headers }),
        axios.get(`${API_URL}/estatisticas`)
      ]);
      setUsuarios(usuariosRes.data);
      setEstatisticas(estRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setCarregando(false);
    }
  }, [usuario.email]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const resetarFormularioPerfil = useCallback(() => {
    setErroPerfil('');
    setPerfilForm({
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha || ''
    });
  }, [usuario]);

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'senha' ? value.replace(/\s/g, '') : value;
    setPerfilForm((prevForm) => ({
      ...prevForm,
      [name]: sanitizedValue
    }));
  };

  const handleAtualizarPerfil = async (e) => {
    e.preventDefault();
    setErroPerfil('');

    if (/\s/.test(perfilForm.senha)) {
      setErroPerfil('A senha nao pode conter espacos em branco');
      return;
    }

    if (perfilForm.senha.length < 4) {
      setErroPerfil('A senha deve ter pelo menos 4 caracteres');
      return;
    }

    setSalvandoPerfil(true);
    try {
      const response = await axios.put(`${API_URL}/usuarios/${usuario.id}`, {
        nome: perfilForm.nome,
        email: perfilForm.email,
        senha: perfilForm.senha
      }, {
        headers: { 'X-User-Email': usuario.email }
      });

      const usuarioAtualizado = {
        ...usuario,
        ...response.data.usuario,
        senha: perfilForm.senha
      };

      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
      onUsuarioAtualizado(usuarioAtualizado);
      setEditandoPerfil(false);
      alert('Perfil atualizado com sucesso!');
      carregarDados();
    } catch (err) {
      setErroPerfil(err.response?.data?.erro || 'Erro ao atualizar perfil');
    } finally {
      setSalvandoPerfil(false);
    }
  };

  const handleDeletarUsuario = async (userId) => {
    if (!usuario.is_admin) {
      alert('Apenas administradores podem deletar usuarios');
      return;
    }
    if (window.confirm('Tem certeza que deseja deletar este usuario?')) {
      try {
        await axios.delete(`${API_URL}/usuarios/${userId}`, {
          headers: { 'X-User-Email': usuario.email }
        });
        setUsuarios(usuarios.filter((user) => user.id !== userId));
        setUsuarioEmEdicao(null);
        alert('Usuario deletado com sucesso!');
      } catch (err) {
        alert('Erro ao deletar usuario');
      }
    }
  };

  const abrirEdicaoUsuario = (user) => {
    setUsuarioEmEdicao(user);
    setGerindoCargos(false);
    setCargoSelecionado(user.is_admin ? 'admin' : 'usuario');
  };

  const handleAtualizarCargo = async () => {
    if (!usuarioEmEdicao) {
      return;
    }

    setSalvandoCargo(true);
    try {
      const response = await axios.put(
        `${API_URL}/usuarios/${usuarioEmEdicao.id}`,
        { is_admin: cargoSelecionado === 'admin' },
        { headers: { 'X-User-Email': usuario.email } }
      );

      const usuarioAtualizado = response.data.usuario;
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((user) =>
          user.id === usuarioAtualizado.id ? { ...user, ...usuarioAtualizado } : user
        )
      );
      setUsuarioEmEdicao((prevUsuario) => prevUsuario ? { ...prevUsuario, ...usuarioAtualizado } : prevUsuario);
      setGerindoCargos(false);
      alert('Cargo atualizado com sucesso!');
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao atualizar cargo');
    } finally {
      setSalvandoCargo(false);
    }
  };

  if (carregando) {
    return <div className="dashboard-container"><p>Carregando...</p></div>;
  }

  const chartData = estatisticas ? {
    labels: estatisticas.usuarios_por_dia.map((dado) => dado.dia),
    datasets: [{
      label: 'Usuarios por Dia',
      data: estatisticas.usuarios_por_dia.map((dado) => dado.quantidade),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }]
  } : null;

  const barChartData = estatisticas ? {
    labels: ['Total de Usuarios', 'Novos (Semana)'],
    datasets: [{
      label: 'Estatisticas',
      data: [estatisticas.total_usuarios, estatisticas.novos_usuarios_semana],
      backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(75, 192, 192, 0.7)'],
      borderColor: ['rgb(54, 162, 235)', 'rgb(75, 192, 192)'],
      borderWidth: 1
    }]
  } : null;

  return (
    <div className="dashboard-container">
      {usuarioEmEdicao && (
        <div className="edit-modal-overlay" onClick={() => setUsuarioEmEdicao(null)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3>Editar Usuario</h3>
              <button
                type="button"
                className="edit-modal-close"
                onClick={() => setUsuarioEmEdicao(null)}
              >
                Fechar
              </button>
            </div>
            <div className="edit-modal-body">
              <p className="edit-modal-user">
                {usuarioEmEdicao.nome} ({usuarioEmEdicao.email})
              </p>
              <p className="edit-modal-role">
                Cargo atual: {usuarioEmEdicao.is_admin ? 'admin' : 'usuario'}
              </p>
              <div className="edit-modal-options">
                <button
                  type="button"
                  className="edit-option-card"
                  onClick={() => setGerindoCargos(!gerindoCargos)}
                >
                  Gerir cargos
                </button>
                {gerindoCargos && (
                  <div className="role-manager">
                    <button
                      type="button"
                      className={`role-option-btn ${cargoSelecionado === 'admin' ? 'ativo' : ''}`}
                      onClick={() => setCargoSelecionado('admin')}
                    >
                      admin
                    </button>
                    <button
                      type="button"
                      className={`role-option-btn ${cargoSelecionado === 'usuario' ? 'ativo' : ''}`}
                      onClick={() => setCargoSelecionado('usuario')}
                    >
                      usuario
                    </button>
                    <button
                      type="button"
                      className="save-role-btn"
                      onClick={handleAtualizarCargo}
                      disabled={salvandoCargo}
                    >
                      {salvandoCargo ? 'Salvando...' : 'Salvar cargo'}
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  className="delete-btn edit-option-delete"
                  onClick={() => handleDeletarUsuario(usuarioEmEdicao.id)}
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="dashboard-header">
        <h1>Bem-vindo, {usuario.nome}{usuario.is_admin ? ' (Administrador)' : ''}!</h1>
        <button onClick={onLogout} className="logout-btn">Sair</button>
      </header>

      <div className="dashboard-content">
        {editandoPerfil ? (
          <section className="perfil-edit-page">
            <div className="perfil-edit-header">
              <div>
                <h2>Editar Perfil</h2>
                <p>Atualize seu nome de usuario, email e senha em uma subpagina dedicada.</p>
              </div>
              <button
                type="button"
                className="perfil-back-btn"
                onClick={() => {
                  setEditandoPerfil(false);
                  resetarFormularioPerfil();
                }}
              >
                Voltar ao painel
              </button>
            </div>

            <form className="perfil-edit-form" onSubmit={handleAtualizarPerfil}>
              <label>
                Nome de usuario
                <input
                  type="text"
                  name="nome"
                  value={perfilForm.nome}
                  onChange={handlePerfilChange}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={perfilForm.email}
                  onChange={handlePerfilChange}
                  required
                />
              </label>

              <label>
                Senha
                <div className="password-input-wrapper-edit">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    name="senha"
                    value={perfilForm.senha}
                    onChange={handlePerfilChange}
                    minLength={4}
                    required
                  />
                  <button
                    type="button"
                    className={`password-toggle-btn-edit ${!mostrarSenha ? 'oculta' : ''}`}
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <span className="eye-icon-edit" aria-hidden="true" />
                  </button>
                </div>
              </label>

              <small className="perfil-edit-hint">
                A senha deve ter pelo menos 4 caracteres e nao pode conter espacos.
              </small>

              {erroPerfil && <div className="erro">{erroPerfil}</div>}

              <div className="perfil-edit-actions">
                <button type="submit" disabled={salvandoPerfil}>
                  {salvandoPerfil ? 'Salvando...' : 'Salvar alteracoes'}
                </button>
                <button
                  type="button"
                  className="perfil-cancel-btn"
                  onClick={() => {
                    setEditandoPerfil(false);
                    resetarFormularioPerfil();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        ) : (
          <>
            <section className="perfil-section">
              <h2>Meu Perfil</h2>
              <div className="perfil-info">
                <p><strong>Nome:</strong> {usuario.nome}</p>
              </div>
              <button onClick={() => setEditandoPerfil(true)} className="edit-btn">Editar Perfil</button>
            </section>

            <section className="graficos-section">
              <h2>Estatisticas</h2>
              <div className="graficos">
                {chartData && (
                  <div className="grafico">
                    <h3>Usuarios por Dia</h3>
                    <Line data={chartData} />
                  </div>
                )}
                {barChartData && (
                  <div className="grafico">
                    <h3>Resumo Geral</h3>
                    <Bar data={barChartData} />
                  </div>
                )}
              </div>
              <p className="dados-ficticios-label">Dados ficticios</p>
            </section>

            {usuario.is_admin && (
              <section className="usuarios-section">
                <h2>Usuarios Cadastrados ({usuarios.length})</h2>
                <table className="usuarios-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Data de Criacao</th>
                      <th>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nome}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.data_criacao).toLocaleDateString('pt-BR')}</td>
                        <td>
                          {user.id !== usuario.id && (
                            <div className="action-buttons">
                              <button
                                type="button"
                                className="edit-row-btn"
                                onClick={() => abrirEdicaoUsuario(user)}
                                disabled={user.id === 0 && usuario.id !== 0}
                              >
                                Editar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
