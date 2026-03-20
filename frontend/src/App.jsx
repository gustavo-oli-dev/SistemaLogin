import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [modo, setModo] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
      setModo('dashboard');
    }
  }, []);

  const handleLoginSucesso = (usuarioData) => {
    setUsuario(usuarioData);
    setModo('dashboard');
    setMensagem('');
  };

  const handleRegistroSucesso = (msg) => {
    setMensagem(msg);
    setModo('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
    setModo('login');
    setMensagem('');
  };

  function renderConteudo() {
    if (modo === 'dashboard' && usuario) {
      return <Dashboard usuario={usuario} onLogout={handleLogout} />;
    }

    if (modo === 'register') {
      return (
        <>
          {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}
          <Register onSuccess={handleRegistroSucesso} onSwitchMode={() => { setModo('login'); setMensagem(''); }} />
        </>
      );
    }

    return (
      <>
        {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}
        <Login
          onSuccess={handleLoginSucesso}
          onSwitchMode={() => setModo('register')}
        />
      </>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sistema de Registro & Login 🔐</h1>
      </header>
      <main className="app-main">
        {renderConteudo()}
      </main>
    </div>
  );
}

export default App;
