import { Target, Award, Scale, Lightbulb, TrendingUp, Users, Compass, Wallet, LineChart, Megaphone } from 'lucide-react';
import { Footer } from '../../components/Footer/Footer';
import './Sobre.css';

const solucoes = [
  {
    icon: TrendingUp,
    titulo: 'Gestão Comercial',
    tagline: 'Vendas com previsibilidade.',
    itens: [
      'Estruturação de funil comercial',
      'Capacitação do time de vendas',
      'Processos de prospecção ao fechamento',
    ],
  },
  {
    icon: Users,
    titulo: 'Liderança',
    tagline: 'Líderes preparados para os desafios do dia a dia.',
    itens: [
      'Desenvolvimento de lideranças',
      'Inteligência emocional',
      'Gestão de pessoas e comunicação',
    ],
  },
  {
    icon: Compass,
    titulo: 'Planejamento Estratégico',
    tagline: 'Direção clara para o crescimento.',
    itens: [
      'Treinamento',
      'Análise SWOT e planejamento',
      'Plano de ação',
    ],
  },
  {
    icon: Wallet,
    titulo: 'BPO Financeiro',
    tagline: 'Gestão financeira organizada, sem dor de cabeça.',
    itens: [
      'Controle e transparência financeira',
      'Relatórios e informação para decisão',
      'Estrutura sem custo de equipe interna',
    ],
  },
  {
    icon: LineChart,
    titulo: 'Investimentos e Crédito',
    tagline: 'Planejamento financeiro com visão de longo prazo.',
    itens: [
      'Orientação sobre investimentos',
      'Acesso e estratégia de crédito',
      'Planejamento financeiro personalizado',
    ],
  },
  {
    icon: Megaphone,
    titulo: 'Marketing',
    tagline: 'Posicionamento com foco em resultado.',
    itens: [
      'Estratégia de marca',
      'Conexão com o cliente certo',
      'Ações orientadas a resultado',
    ],
  },
];

export const Sobre = () => {
  return (
    <div className="page-container">
      {/* 1. HEADER DA PÁGINA */}
      <section className="sobre-header">
        <div className="label-group justify-center">
          <span className="label-line white-line"></span>
          <span className="section-label-white">NOSSA IDENTIDADE</span>
        </div>
        <h1 className="sobre-title">Sobre Nós</h1>
        <p className="sobre-subtitle">
          Unimos estratégia, finanças e liderança em um só lugar, para que você não precise recorrer a soluções fragmentadas para resolver problemas que estão conectados.
        </p>
      </section>

      {/* 2. SOBRE NÓS */}
      <section className="sobre-trajetoria">
        <div className="trajetoria-image">
          <img src="/assets/images/reuniao_tera.jpeg" alt="Equipe TERA Gestão" />
        </div>
        <div className="trajetoria-content">
          <div className="label-group">
            <span className="label-line"></span>
            <span className="section-label">QUEM SOMOS</span>
          </div>
          <h2 className="trajetoria-title">Consultoria que entrega resultado, não só relatório.</h2>
          <p className="trajetoria-text">
            A TERA nasceu para simplificar a gestão de empresas que querem crescer com estrutura. Unimos estratégia, finanças e liderança em um só lugar, para que você não precise recorrer a soluções fragmentadas para resolver problemas que estão conectados.
          </p>
          <p className="trajetoria-text">
            Trabalhamos lado a lado com nossos clientes — do diagnóstico à execução — porque acreditamos que consultoria de verdade não entrega só um relatório, entrega resultado.
          </p>
          <p className="trajetoria-text">
            Nosso compromisso é traduzir teoria em prática: planos claros, ações concretas e acompanhamento de perto.
          </p>
        </div>
      </section>

      {/* 3. NOSSAS SOLUÇÕES */}
      <section className="solucoes-section">
        <div className="pillars-header">
          <span className="pillars-label">O QUE FAZEMOS</span>
          <h2 className="pillars-title">Nossas Soluções</h2>
        </div>

        <div className="solucoes-grid">
          {solucoes.map(({ icon: Icon, titulo, tagline, itens }) => (
            <div className="solucao-card" key={titulo}>
              <div className="pillar-icon-box"><Icon size={28} strokeWidth={1.5} /></div>
              <h4>{titulo}</h4>
              <p className="solucao-tagline">{tagline}</p>
              <ul className="solucao-lista">
                {itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SEÇÃO DE VALORES / PILARES */}
      <section className="pillars-section-sobre">
        <div className="pillars-header">
          <span className="pillars-label">PILARES FUNDAMENTAIS</span>
          <h2 className="pillars-title">Valores que Guiam Nossas Decisões</h2>
        </div>

        <div className="pillars-grid">
          <div className="pillar-item">
            <div className="pillar-icon-box"><Target size={32} strokeWidth={1.5} /></div>
            <h4>Resultado</h4>
            <p>Foco obsessivo em métricas e entregas concretas.</p>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon-box"><Award size={32} strokeWidth={1.5} /></div>
            <h4>Excelência</h4>
            <p>Compromisso com a qualidade superior em cada detalhe.</p>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon-box"><Scale size={32} strokeWidth={1.5} /></div>
            <h4>Ética</h4>
            <p>Transparência e integridade em todas as relações.</p>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon-box"><Lightbulb size={32} strokeWidth={1.5} /></div>
            <h4>Inovação</h4>
            <p>Busca constante por novas tecnologias e soluções.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
