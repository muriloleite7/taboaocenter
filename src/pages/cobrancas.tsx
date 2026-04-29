import Card from '../components/cards';
import styles from '../cobrancas.module.css';

export default function Cobrancas() {
  const cobrancas = [
    {
      nome: "João Silva",
      email: "joao.silva@email.com",
      cpf: "123.456.789-00",
      referencia: "Maio/2026",
      aluguel: "R$ 1.500,00",
      agua: "R$ 85,00",
      luz: "R$ 130,00",
      multa: "R$ 0,00",
      total: "R$ 1.715,00",
      vencimento: "10/05/2026",
      status: "Pendente",
    },
    {
      nome: "Maria Clara",
      email: "maria.clara@email.com",
      cpf: "987.654.321-00",
      referencia: "Maio/2026",
      aluguel: "R$ 1.800,00",
      agua: "R$ 92,00",
      luz: "R$ 145,00",
      multa: "R$ 36,00",
      total: "R$ 2.073,00",
      vencimento: "08/05/2026",
      status: "Atrasada",
    },
    {
      nome: "Rafael Pereira",
      email: "rafael.pereira@email.com",
      cpf: "456.789.123-00",
      referencia: "Maio/2026",
      aluguel: "R$ 1.600,00",
      agua: "R$ 78,00",
      luz: "R$ 118,00",
      multa: "R$ 0,00",
      total: "R$ 1.796,00",
      vencimento: "12/05/2026",
      status: "Paga",
    },
    {
      nome: "Ana Souza",
      email: "ana.souza@email.com",
      cpf: "321.654.987-00",
      referencia: "Maio/2026",
      aluguel: "R$ 1.700,00",
      agua: "R$ 89,00",
      luz: "R$ 121,00",
      multa: "R$ 0,00",
      total: "R$ 1.910,00",
      vencimento: "15/05/2026",
      status: "Pendente",
    },
  ];

  return (
    <div className={styles.cobrancas}>
      <div className={styles.headerCobrancas}>
        <div>
          <h1 className={styles.tituloCobrancas}>Cobranças</h1>
          <p className={styles.subtituloCobrancas}>
            Controle os aluguéis, vencimentos e despesas dos inquilinos.
          </p>
        </div>

        <button className={styles.lancarDespesa}>+ Lançar despesas</button>
      </div>

      <div className={styles.cardsCobrancas}>
        <Card
          title="Cobranças pendentes"
          value={88}
          description="Aguardando pagamento"
        />

        <Card
          title="Vencem em 5 dias"
          value={42}
          description="Lembretes programados"
        />

        <Card
          title="Atrasadas"
          value={26}
          description="Com multa aplicada"
        />

        <Card
          title="Despesas a lançar"
          value={15}
          description="Água e luz pendentes"
        />
      </div>

      <div className={styles.filtrosCobrancas}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Buscar por inquilino, CPF ou referência..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Status</label>

          <select className={styles.selectFilter}>
            <option>Todos</option>
            <option>Pendente</option>
            <option>Paga</option>
            <option>Atrasada</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Referência</label>

          <select className={styles.selectFilter}>
            <option>Maio/2026</option>
            <option>Abril/2026</option>
            <option>Março/2026</option>
          </select>
        </div>

        <button className={styles.exportButton}>
          ⇩ Exportar
        </button>
      </div>

      <div className={styles.tabelaContainer}>
        <table className={styles.tabelaCobrancas}>
          <thead>
            <tr>
              <th>Inquilino</th>
              <th>CPF</th>
              <th>Referência</th>
              <th>Aluguel</th>
              <th>Água</th>
              <th>Luz</th>
              <th>Multa</th>
              <th>Total</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {cobrancas.map((cobranca, index) => (
              <tr key={index}>
                <td>
                  <div className={styles.infoCobranca}>
                    <div className={styles.avatarCobranca}>
                      {cobranca.nome
                        .split(" ")
                        .map((parteNome) => parteNome[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>
                      <strong>{cobranca.nome}</strong>
                      <span>{cobranca.email}</span>
                    </div>
                  </div>
                </td>

                <td>{cobranca.cpf}</td>
                <td>{cobranca.referencia}</td>
                <td>{cobranca.aluguel}</td>
                <td>{cobranca.agua}</td>
                <td>{cobranca.luz}</td>
                <td>{cobranca.multa}</td>
                <td>{cobranca.total}</td>
                <td>{cobranca.vencimento}</td>

                <td>
                  <span
                    className={
                      cobranca.status === "Paga"
                        ? styles.statusPago
                        : cobranca.status === "Atrasada"
                        ? styles.statusAtrasado
                        : styles.statusPendente
                    }
                  >
                    {cobranca.status}
                  </span>
                </td>

                <td>
                  <div className={styles.acoesTabela}>
                    <button title="Ver detalhes">👁</button>
                    <button title="Editar">✎</button>
                    <button title="Mais opções">⋮</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.rodapeTabela}>
          <span>Mostrando 1 a 4 de 88 cobranças</span>

          <div className={styles.paginacao}>
            <button>{"<"}</button>
            <button className={styles.paginaAtiva}>1</button>
            <button>2</button>
            <button>3</button>
            <button>{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}