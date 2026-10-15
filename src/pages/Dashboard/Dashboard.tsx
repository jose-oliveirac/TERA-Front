import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { Clientes } from './Clientes'; 
import { Colaboradores } from './Colaboradores'; 

export const Dashboard = () => {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('visao-geral');
  const [role] = useState<string | null>(() => {
    const token = localStorage.getItem('tera_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role ?? null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('tera_token');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('tera_token');
    navigate('/auth');
  };

  const getTitulo = () => {
    if (abaAtiva === 'visao-geral') return 'Visão Geral';
    if (abaAtiva === 'clientes') return 'Tabela de Clientes';
    return 'Gestão de Colaboradores';
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo"><h2>TERA</h2></div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${abaAtiva === 'visao-geral' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('visao-geral')}
          >
            Visão Geral
          </button>
          
          <button 
            className={`nav-item ${abaAtiva === 'clientes' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('clientes')}
          >
            Clientes
          </button>

          {/* SÓ PARA ADMIN */}
          {role === 'ADMIN' && (
          <button 
            className={`nav-item ${abaAtiva === 'colaboradores' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('colaboradores')}
          >
            Colaboradores
          </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Sair</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <h1>{getTitulo()}</h1>
          <div className="user-avatar"><span>U</span></div>
        </header>

        <section className="content-area">
          {/* LÓGICA DE ABAS */}
          {abaAtiva === 'visao-geral' && (
            <div className="construction-notice">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="construction-icon">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <h2>Visão Geral em Desenvolvimento</h2>
              <p>Os gráficos e métricas financeiras estarão disponíveis nas próximas atualizações.</p>
            </div>
          )}
          
          {abaAtiva === 'clientes' && <Clientes />}
          
          {abaAtiva === 'colaboradores' && role === 'ADMIN' && <Colaboradores />}
        </section>
      </main>
    </div>
  );
};