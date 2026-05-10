import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatarMoeda } from "../data/cobrancasMock"; 
import styles from "../style/detalheInquilino.module.css";

export default function DetalheContrato() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // PREPARAÇÃO PARA O DB: Estados de dados e carregamento
  const [contrato, setContrato] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // SIMULAÇÃO DE CHAMADA API
    // Quando tiver o back-end, você substituirá isso por: api.get(`/contratos/${id}`)
    setTimeout(() => {
      const dadosMock = {
        id: id,
        inquilino: "João Silva",
        cpf: "123.456.789-00",
        imovel: "Apto 101",
        endereco: "Av. José Lopes de Oliveira, Jd. Roberto",
        valorAluguel: 1500,
        diaVencimento: "10",
        dataInicio: "10/05/2025",
        dataFim: "10/05/2026",
        status: "Vence em breve",
        diasRestantes: "12 dias",
        regras: {
          agua: "Incluso (Taxa fixa)",
          luz: "Individual (Leitura)",
          iptu: "Incluso no aluguel"
        },
        cobrancas: [
          { id: 1, referencia: "Abril/2026", total: 1550, status: "Pago" },
          { id: 2, referencia: "Maio/2026", total: 1550, status: "Pendente" },
        ]
      };
      
      setContrato(dadosMock);
      setCarregando(false);
    }, 800); // Simula atraso de rede
  }, [id]);

  if (carregando) {
    return <div className={styles.detalheInquilino}><h1>Carregando contrato...</h1></div>;
  }

  if (!contrato) {
    return (
      <div className={styles.detalheInquilino}>
        <h1>Contrato não encontrado</h1>
        <Link to="/contratos" className={styles.voltarLink}>Voltar para contratos</Link>
      </div>
    );
  }

  return (
    <div className={styles.detalheInquilino}>
      <div className={styles.headerDetalhe}>
        <div>
          <Link to="/contratos" className={styles.voltarLink}>
            ← Voltar para contratos
          </Link>
          <h1>Contrato #{contrato.id} - {contrato.inquilino}</h1>
          <p>Gestão de prazos, valores e regras contratuais.</p>
        </div>

        

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to={`/contratos/${id}/editar`} className={styles.editarButton} style={{ background: '#64748b'}}>
            ✎ Editar Contrato
          </Link>

          <Link to={`/contratos/${id}/renovar`} className={styles.editarButton} style={{ background: '#4f46e5' }}>
            ↻ Renovar Contrato
          </Link>
          <button className={styles.editarButton} style={{ background: '#950000' }}>
            Encerrar Contrato
          </button>
        </div>
      </div>

      <div className={styles.gridResumo}>
        <div className={styles.resumoCard}>
          <span>Status do Contrato</span>
          <h3>{contrato.status}</h3>
        </div>
        <div className={styles.resumoCard}>
          <span>Aluguel Atual</span>
          <h3>{formatarMoeda(contrato.valorAluguel)}</h3>
        </div>
        <div className={styles.resumoCard}>
          <span>Vencimento</span>
          <h3>Dia {contrato.diaVencimento}</h3>
        </div>
        <div className={styles.resumoCard}>
          <span>Tempo Restante</span>
          <h3>{contrato.diasRestantes}</h3>
        </div>
      </div>

      <div className={styles.conteudoGrid}>
        <section className={styles.cardInfo}>
          <h2>Partes do Contrato</h2>
          <div className={styles.infoLinha}>
            <span>Inquilino</span>
            <h3>{contrato.inquilino}</h3>
          </div>
          <div className={styles.infoLinha}>
            <span>CPF</span>
            <h3>{contrato.cpf}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Localização</h2>
          <div className={styles.infoLinha}>
            <span>Imóvel</span>
            <h3>{contrato.imovel}</h3>
          </div>
          <div className={styles.infoLinha}>
            <span>Endereço Completo</span>
            <h3>{contrato.endereco}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Vigência</h2>
          <div className={styles.infoLinha}>
            <span>Data de Início</span>
            <h3>{contrato.dataInicio}</h3>
          </div>
          <div className={styles.infoLinha}>
            <span>Data de Término</span>
            <h3>{contrato.dataFim}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Regras de Despesas</h2>
          <div className={styles.infoLinha}>
            <span>Água</span>
            <h3>{contrato.regras.agua}</h3>
          </div>
          <div className={styles.infoLinha}>
            <span>Energia Elétrica</span>
            <h3>{contrato.regras.luz}</h3>
          </div>
          <div className={styles.infoLinha}>
            <span>IPTU</span>
            <h3>{contrato.regras.iptu}</h3>
          </div>
        </section>
      </div>

      <section className={styles.cardInfo}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Histórico de Cobranças</h2>
            <p>Pagamentos vinculados estritamente a este período de contrato.</p>
          </div>
        </div>

        <div className={styles.cobrancasLista}>
          {contrato.cobrancas.map((cob: any) => (
            <div className={styles.cobrancaItem} key={cob.id}>
              <span>{cob.referencia}</span>
              <h3>{formatarMoeda(cob.total)}</h3>
              <p style={{ color: cob.status === 'Pago' ? '#16a34a' : '#c2410c' }}>
                {cob.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}