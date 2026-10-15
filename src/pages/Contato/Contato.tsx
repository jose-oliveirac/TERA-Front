import { useState } from 'react';
import { Phone, Mail, User, FileText } from 'lucide-react';
import { Footer } from '../../components/Footer/Footer';
import './Contato.css';

export const Contato = () => {
  // 1. ESTADO PARA GUARDAR OS DADOS DO FORMULÁRIO
  const [formData, setFormData] = useState({
    name: '',
    doc: '',
    phone: '',
    email: '',
  });

  // 2. ESTADO PARA CONTROLAR O POP-UP (NOVO)
  const [popup, setPopup] = useState({ visivel: false, texto: '', tipo: '' });

  // 3. FUNÇÃO PARA DISPARAR O POP-UP NA TELA
  const mostrarPopup = (texto: string, tipo: string) => {
    setPopup({ visivel: true, texto, tipo });
    setTimeout(() => {
      setPopup({ visivel: false, texto: '', tipo: '' });
    }, 4000); // Some sozinho após 4 segundos
  };

  // 4. FUNÇÃO PARA ATUALIZAR OS DADOS ENQUANTO O USUÁRIO DIGITA
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    // Trava de segurança para o CPF/CNPJ: aceita APENAS números
    if (name === 'doc') {
      value = value.replace(/\D/g, ''); //  /\D/g remove tudo que não for dígito (0-9)
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

 // 5. FUNÇÃO PARA O ENVIO PARA O BACK-END
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer`, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      // LÊ O CONTEÚDO DA RESPOSTA (MESMO SE FOR ERRO)
      const data = await response.json();

      if (response.ok) {
        mostrarPopup('Mensagem enviada com sucesso! Nossa equipe entrará em contato.', 'sucesso');
        setFormData({ name: '', doc: '', phone: '', email: '' });
      } else {
        if (data.error && data.error.length > 0) {
          mostrarPopup(`Erro: ${data.error[0].message}`, 'erro');
        } else {
          mostrarPopup(data.message || 'Ocorreu um erro ao enviar. Tente novamente.', 'erro');
        }
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      mostrarPopup('Erro ao conectar com o servidor.', 'erro');
    }
  };

  return (
    <div className="page-container">
      
      {/* RENDERIZAÇÃO DO POP-UP DE ERRO OU SUCESSO */}
      {popup.visivel && (
        <div className={`popup-mensagem ${popup.tipo}`}>
          <span>{popup.tipo === 'erro' ? '⚠️' : '✅'} {popup.texto}</span>
          <button onClick={() => setPopup({ visivel: false, texto: '', tipo: '' })}>X</button>
        </div>
      )}

      <section className="contact-page-wrapper">
        <div className="contact-card">
          
          {/* LADO ESQUERDO - INFO EM AZUL ESCURO */}
          <div className="contact-info-panel">
            <h2>Fale com a TERA</h2>
            <p className="info-subtitle">
              Estamos prontos para atender sua empresa com a excelência que ela merece.
            </p>

            <div className="contact-details">
              <div className="detail-item">
                <div className="detail-icon-wrapper">
                  <Phone size={22} className="detail-icon" />
                </div>
                <div className="detail-text">
                  <span className="detail-label">Telefone</span>
                  <span className="detail-value">+55 (11) 3000-0000</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon-wrapper">
                  <Mail size={22} className="detail-icon" />
                </div>
                <div className="detail-text">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">contato@teragestao.com.br</span>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DIREITO - FORMULÁRIO */}
          <div className="contact-form-panel">
            
            <h2 className="form-panel-title">Fale Conosco</h2>
            
            <p className="form-subtitle">
              Preencha os dados abaixo para entrar em contato com nossa equipe de especialistas.
            </p>

            <form className="tera-contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>NOME COMPLETO</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Seu nome" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>CPF / CNPJ</label>
                <div className="input-with-icon">
                  <FileText size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="doc"
                    placeholder="CPF/CNPJ" 
                    value={formData.doc}
                    onChange={handleChange}
                    maxLength={14}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>TELEFONE</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="phone"
                    placeholder="(00) 00000-0000" 
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>EMAIL</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="nome@exemplo.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-enviar">
                ENVIAR
              </button>
            </form>
          </div>
          
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
