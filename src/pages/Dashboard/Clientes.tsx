import React, { useState, useEffect } from 'react'; 
import './clientes.css';
import { formatarDoc, formatarTelefone } from '../../utils/formatters';
import { Toast } from '../../components/Toast/Toast';

interface Cliente {
  id: number;
  name: string;
  email: string;
  doc: string;
  phone: string;
}

export const Clientes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TOAST 
  const [mensagemToast, setMensagemToast] = useState({ texto: '', tipo: '' as 'sucesso' | 'erro' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    doc: '',
    phone: ''
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const mostrarAviso = (texto: string, tipo: 'sucesso' | 'erro') => {
    setMensagemToast({ texto, tipo });
    setTimeout(() => setMensagemToast({ texto: '', tipo: 'erro' }), 4000);
  };

  const buscarClientes = async () => {
    try {
      const token = localStorage.getItem('tera_token'); 
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/customer/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      const dados = await resposta.json();
      
      if (resposta.ok) {
        setClientes(dados.customers || dados.data?.data || dados || []); 
      }
    } catch (error) {
      console.error('Erro de conexão.', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial da lista ao montar a tela
    buscarClientes();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/create/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        
        mostrarAviso("Cliente cadastrado com sucesso!", "sucesso");
        setIsModalOpen(false); 
        setFormData({ name: '', email: '', doc: '', phone: '' }); 
        
        buscarClientes(); 
      } else {
        
        const erroMsg = dados.error?.[0]?.message || dados.message || "Erro ao cadastrar cliente.";
        mostrarAviso(erroMsg, "erro");
      }
    } catch {
      // 5. ERRO DE CONEXÃO NO TOAST
      mostrarAviso('Erro de conexão com o servidor.', 'erro');
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
        <input 
          type="text" 
          placeholder="Buscar por nome, e-mail ou documento..." 
          className="search-input"
        />
        <div className="toolbar-actions">
          <button className="btn-new" onClick={() => setIsModalOpen(true)}>
            + Novo Cliente
          </button>
        </div>
      </div>

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cadastrar Cliente</h2>
            <form onSubmit={handleCreateCustomer} className="modal-form">
              
              <input type="text" placeholder="Nome Completo" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <input type="email" placeholder="E-mail" required
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              
              {/* TRAVA DE NÚMEROS E TAMANHO NO CPF/CNPJ */}
              <input type="text" placeholder="CPF ou CNPJ (apenas números)" required maxLength={14}
                value={formData.doc} onChange={e => setFormData({...formData, doc: e.target.value.replace(/\D/g, '')})} />
              
              {/* TRAVA DE NÚMEROS E TAMANHO NO TELEFONE */}
              <input type="text" placeholder="Telefone (apenas números)" required maxLength={11}
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} />

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABELA DE DADOS */}
      <div className="table-container">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>NOME</th>
              <th>EMAIL</th>
              <th>CPF / CNPJ</th>
              <th>TELEFONE</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(clientes) && clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="col-nome">
                  <div className="avatar-mini">{cliente.name ? cliente.name.charAt(0) : '-'}</div>
                  {cliente.name}
                </td>
                <td>{cliente.email}</td>
                <td>{formatarDoc(cliente.doc)}</td> 
                <td>{formatarTelefone(cliente.phone)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};