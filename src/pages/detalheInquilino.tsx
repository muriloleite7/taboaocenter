import { useParams, Link } from "react-router-dom";
import styles from "../style/detalheInquilino.module.css";

export default function DetalheInquilino() {
  const { id } = useParams();

  const inquilinos = [
    {
      id: "1",
      nome: "João Silva",
      email: "joao.silva@email.com",
      cpf: "123.456.789-00",
      telefone: "(11) 98765-4321",
      imovel: "Apto 101",
      endereco: "Av. José Lopes de Oliveira",
      aluguel: "R$ 1.500,00",
      vencimento: "Todo dia 10",
      inicioContrato: "10/05/2025",
      fimContrato: "10/05/2026",
      statusContrato: "Ativo",
      agua: "Variável mensal",
      luz: "Variável mensal",
      iptu: "Valor fixo",
      statusPagamento: "Pendente",
    },
    {
      id: "2",
      nome: "Maria Clara",
      email: "maria.clara@email.com",
      cpf: "987.654.321-00",
      telefone: "(11) 97654-3210",
      imovel: "Casa 02",
      endereco: "Parque Assunção",
      aluguel: "R$ 1.800,00",
      vencimento: "Todo dia 15",
      inicioContrato: "15/05/2025",
      fimContrato: "15/05/2026",
      statusContrato: "Ativo",
      agua: "Valor fixo",
      luz: "Variável mensal",
      iptu: "Valor fixo",
      statusPagamento: "Com pendência",
    },
  ];

  const inquilino = inquilinos.find((item) => item.id === id);

  if (!inquilino) {
    return (
      <div className={styles.detalheInquilino}>
        <h1>Inquilino não encontrado</h1>
        <Link to="/inquilinos" className={styles.voltarLink}>
          Voltar para inquilinos
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detalheInquilino}>
      <div className={styles.headerDetalhe}>
        <div>
          <Link to="/inquilinos" className={styles.voltarLink}>
            ← Voltar para inquilinos
          </Link>

          <h1>{inquilino.nome}</h1>
          <p>Detalhes completos do inquilino, contrato e cobranças.</p>
        </div>

        <Link to={`/inquilinos/${id}/editar`} className={styles.editarButton}>
          Editar inquilino
        </Link>
      </div>

      <div className={styles.gridResumo}>
        <div className={styles.resumoCard}>
          <span>Status do pagamento</span>
          <h3>{inquilino.statusPagamento}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Aluguel</span>
          <h3>{inquilino.aluguel}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Vencimento</span>
          <h3>{inquilino.vencimento}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Contrato</span>
          <h3>{inquilino.statusContrato}</h3>
        </div>
      </div>

      <div className={styles.conteudoGrid}>
        <section className={styles.cardInfo}>
          <h2>Dados pessoais</h2>

          <div className={styles.infoLinha}>
            <span>Nome</span>
            <h3>{inquilino.nome}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>CPF</span>
            <h3>{inquilino.cpf}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>WhatsApp</span>
            <h3>{inquilino.telefone}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>E-mail</span>
            <h3>{inquilino.email}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Imóvel vinculado</h2>

          <div className={styles.infoLinha}>
            <span>Imóvel</span>
            <h3>{inquilino.imovel}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Endereço/Bairro</span>
            <h3>{inquilino.endereco}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Contrato</h2>

          <div className={styles.infoLinha}>
            <span>Início</span>
            <h3>{inquilino.inicioContrato}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Fim</span>
            <h3>{inquilino.fimContrato}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Status</span>
            <h3>{inquilino.statusContrato}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Despesas do contrato</h2>

          <div className={styles.infoLinha}>
            <span>Água</span>
            <h3>{inquilino.agua}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Luz</span>
            <h3>{inquilino.luz}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>IPTU</span>
            <h3>{inquilino.iptu}</h3>
          </div>
        </section>
      </div>

      <section className={styles.cardInfo}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Cobranças recentes</h2>
            <p>Últimas cobranças vinculadas a este inquilino.</p>
          </div>

          <Link to="/cobrancas" className={styles.verTodasLink}>
            Ver cobranças
          </Link>
        </div>

        <div className={styles.cobrancasLista}>
          <div className={styles.cobrancaItem}>
            <span>Maio/2026</span>
            <h3>R$ 1.810,00</h3>
            <p>Pendente</p>
          </div>

          <div className={styles.cobrancaItem}>
            <span>Abril/2026</span>
            <h3>R$ 1.760,00</h3>
            <p>Paga</p>
          </div>

          <div className={styles.cobrancaItem}>
            <span>Março/2026</span>
            <h3>R$ 1.740,00</h3>
            <p>Paga</p>
          </div>
        </div>
      </section>
    </div>
  );
}