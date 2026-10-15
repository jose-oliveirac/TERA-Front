import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './RedefinirSenha.css';

export const RedefinirSenha = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);

  useEffect (() => {
    const validarToken = async () => {
      try {
        const resposta = await fetch (`${import.meta.env.VITE_API_URL}/api/auth/validate-token/${token}`);
        setTokenValido(resposta.ok);
      }  catch {
          setTokenValido(false);
      }
    };

    validarToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensagem('');

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    setCarregando(true);

    try {
 const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: senha }),
      });

      const dados = await resposta.json();
      setMensagem(dados.message);
    } catch {
      setMensagem('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

   if (tokenValido === null) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Verificando link...</p>
        </div>
      </div>
    );
  }

  if (tokenValido === false) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>TERA</h1>
            <p>Link inválido ou expirado</p>
          </div>
          <p className="auth-hint">
            <Link to="/forgot-password">Pedir um novo link</Link>
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>TERA</h1>
          <p>Redefinir senha</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mensagem && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 500 }}>
              {mensagem}
            </p>
          )}

          <div className="input-group">
            <label>Nova senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirmar nova senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>

        <p className="auth-hint">
          <Link to="/auth">Voltar para o login</Link>
        </p>
      </div>
    </div>
  );
};
