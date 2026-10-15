import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; 

export const Login = () => {
  const navigate = useNavigate();
  
  // Estados para controlar os inputs e possíveis erros do backend
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(''); 

    try {
      // POST para a rota de login do backend
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem('tera_token', dados.token);
        navigate('/dashboard');
      } else {
        setErro(dados.mensagem || 'E-mail ou senha incorretos.');
      }
    } catch {
      setErro('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>TERA</h1>
          <p>Acesse a Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {/* Mostra a mensagem de erro logo acima dos inputs se houver */}
          {erro && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem', fontWeight: '500' }}>{erro}</p>}

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

          <p className="auth-hint">
          <Link to="/forgot-password">Esqueci minha senha</Link>
        </p>

      </div>
    </div>
  );
};