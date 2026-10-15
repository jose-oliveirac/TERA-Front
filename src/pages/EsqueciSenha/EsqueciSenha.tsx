import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EsqueciSenha.css';

export const EsqueciSenha = () => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem('');

    try {
const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const dados = await resposta.json();
      setMensagem(dados.message);
    } catch {
      setMensagem('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>TERA</h1>
          <p>Recuperar senha</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mensagem && (
            <p style={{ color: '#0f172a', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 500 }}>
              {mensagem}
            </p>
          )}

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

          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        <p className="auth-hint">
          Lembrou a senha? <Link to="/auth">Voltar para o login</Link>
        </p>
      </div>
    </div>
  );
};
