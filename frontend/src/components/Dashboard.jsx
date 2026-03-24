import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import './Dashboard.css';
import { API_URL } from '../config/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function Dashboard({ usuario, onLogout }) {
  const [usuarios, setUsuarios] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [novoNome, setNovoNome] = useState(usuario.nome);
  const [editando, setEditando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [gerindoCargos, setGerindoCargos] = useState(false);
  const [cargoSelecionado, setCargoSelecionado] = useState('usuario');
  const [salvandoCargo, setSalvandoCargo] = useState(false);

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

  const handleAtualizarPerfil = async () => {
    try {
      await axios.put(`${API_URL}/usuarios/${usuario.id}`, {
        nome: novoNome      }, {
        headers: { 'X-User-Email': usuario.email }      });
      const usuarioAtualizado = { ...usuario, nome: novoNome };
      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
      setEditando(false);
      alert('Perfil atualizado com sucesso!');
      carregarDados();
    } catch (err) {
      alert('Erro ao atualizar perfil');
    }
  };

  const handleDeletarUsuario = async (userId) => {
    if (!usuario.is_admin) {
      alert('Apenas administradores podem deletar usuários');
      return;
    }
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await axios.delete(`${API_URL}/usuarios/${userId}`, {
          headers: { 'X-User-Email': usuario.email }
        });
        setUsuarios(usuarios.filter(u => u.id !== userId));
        setUsuarioEmEdicao(null);
        alert('Usuário deletado com sucesso!');
      } catch (err) {
        alert('Erro ao deletar usuário');
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
    labels: estatisticas.usuarios_por_dia.map(d => d.dia),
    datasets: [{
      label: 'Usuários por Dia',
      data: estatisticas.usuarios_por_dia.map(d => d.quantidade),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }]
  } : null;

  const barChartData = estatisticas ? {
    labels: ['Total de Usuários', 'Novos (Semana)'],
    datasets: [{
      label: 'Estatísticas',
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
        <section className="perfil-section">
          <h2>Meu Perfil</h2>
          <div className="perfil-info">
            <p><strong>Nome:</strong> {usuario.nome}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p className="senha-container">
              <strong>Senha:</strong>
              <span className="senha-display">
                {mostrarSenha ? usuario.senha : '•'.repeat(usuario.senha ? usuario.senha.length : 0)}
                <button
                  type="button"
                  className={`toggle-senha-btn ${!mostrarSenha ? 'oculta' : ''}`}
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  👁️‍🗨️
                </button>
              </span>
            </p>
          </div>
          {editando ? (
            <div className="edit-form">
              <input
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
              />
              <button onClick={handleAtualizarPerfil}>Salvar</button>
              <button onClick={() => setEditando(false)}>Cancelar</button>
            </div>
          ) : (
            <button onClick={() => setEditando(true)} className="edit-btn">Editar Perfil</button>
          )}
        </section>

        <section className="graficos-section">
          <h2>Estatísticas</h2>
          <div className="graficos">
            {chartData && (
              <div className="grafico">
                <h3>Usuários por Dia</h3>
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
          <h2>Usuários Cadastrados ({usuarios.length})</h2>
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Data de Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(user => (
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
      </div>
    </div>
  );
}

export default Dashboard;
