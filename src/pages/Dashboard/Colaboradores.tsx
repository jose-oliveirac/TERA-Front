import React, { useState, useEffect } from 'react';
import './clientes.css';
import { Toast } from '../../components/Toast/Toast';
import { Pencil, Trash2 } from 'lucide-react';

interface Colaborador {
  id: number;
  name: string;
  email: string;
}

export const Colaboradores = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [mensagemToast, setMensagemToast] = useState({ texto: '', tipo: '' as 'sucesso' | 'erro' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const mostrarAviso = (texto: string, tipo: 'sucesso' | 'erro') => {
    setMensagemToast({ texto, tipo });
    setTimeout(() => setMensagemToast({ texto: '', tipo: 'erro' }), 4000);
  };

  const buscarColaboradores = async () => {
    try {
      const token = localStorage.getItem('tera_token');
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dados = await resposta.json();
      if (resposta.ok) setColaboradores(dados.data?.data || []);
    } catch (error) {
      console.error('Erro ao buscar lista', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial da lista ao montar a tela
    buscarColaboradores();
  }, []);
  
const abrirNovo = () => {
  setEditandoId(null);
  setFormData({ name: '', email: '', password: '' });
  setIsModalOpen(true);
};

const abrirEdicao = (c: Colaborador) => {
  setEditandoId(c.id);
  setFormData({ name: c.name, email: c.email, password: '' });
  setIsModalOpen(true);
};

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('tera_token');
      const url = editandoId
        ? `${import.meta.env.VITE_API_URL}/api/auth/user/${editandoId}`
        : `${import.meta.env.VITE_API_URL}/api/auth/user`;
      const method = editandoId ? 'PUT' : 'POST';

      const body: Record<string, string> = { name: formData.name, email: formData.email };
      if (formData.password) body.password = formData.password;

      const resposta = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        mostrarAviso(editandoId ? "Colaborador atualizado!" : "Colaborador registrado!", "sucesso");
        setIsModalOpen(false);
        setEditandoId(null);
        setFormData({ name: '', email: '', password: '' });
        buscarColaboradores();
      } else {
        mostrarAviso(dados.error?.[0]?.message || dados.message || "Erro ao salvar", "erro");
      }
    } catch {
      mostrarAviso("Erro de conexão", "erro");
    }
  };

const handleDelete = async (id: number) => {
  try {
    const token = localStorage.getItem('tera_token');
    const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const dados = await resposta.json();

    if (resposta.ok) {
      mostrarAviso("Colaborador removido!", "sucesso");
      buscarColaboradores();
    } else {
      mostrarAviso(dados.message || "Erro ao excluir", "erro");
    }
  } catch {
    mostrarAviso("Erro de conexão", "erro");
  }
};


  return (
    <div className="clientes-wrapper">
      <Toast 
        mensagem={mensagemToast.texto} 
        tipo={mensagemToast.tipo as 'sucesso' | 'erro'} 
        onClose={() => setMensagemToast({ texto: '', tipo: 'erro' })} 
      />

      <div className="clientes-toolbar">
        <button className="btn-new" onClick={abrirNovo}>+ Novo Colaborador</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editandoId ? "Editar Colaborador" : "Novo Colaborador"}</h2>
            <form onSubmit={handleSave} className="modal-form">
              <input type="text" placeholder="Nome" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="password" placeholder={editandoId ? "Nova senha (opcional)" : "Senha"} required={!editandoId}
               value={formData.password} 
               onChange={e => setFormData({...formData, password: e.target.value})} />

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="clientes-table">
          <thead><tr><th>NOME</th><th>EMAIL</th><th>AÇÕES</th></tr></thead>
          <tbody>
            {Array.isArray(colaboradores) && colaboradores.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="btn-icon btn-edit"
                      onClick={() => abrirEdicao(c)}
                      aria-label="Editar colaborador"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(c.id)}
                      aria-label="Excluir colaborador"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};