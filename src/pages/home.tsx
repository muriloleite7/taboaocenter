import { Link, useNavigate } from "react-router-dom";
import Card from "../components/cards";
import styles from "../style/home.module.css";

const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";
const CONTRATOS_STORAGE_KEY = "@TaboaoCenter:contratos";
const COBRANCAS_STORAGE_KEY = "@TaboaoCenter:cobrancas";

function carregarLista(chave: string) {
  const dados = localStorage.getItem(chave);

  if (!dados) {
    return [];
  }

  try {
    return JSON.parse(dados);
  } catch {
    return [];
  }
}

function calcularDiasRestantes(data: string) {
  if (!data) return 0;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataFinal = new Date(data);
  dataFinal.setHours(0, 0, 0, 0);

  if (Number.isNaN(dataFinal.getTime())) return 0;

  const diferencaMs = dataFinal.getTime() - hoje.getTime();

  return Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));
}

function cobrancaEstaPaga(status: string) {
  return status === "Paga" || status === "Pago";
}

export default function Home() {
  const navigate = useNavigate();

  const inquilinos = carregarLista(INQUILINOS_STORAGE_KEY);
  const contratos = carregarLista(CONTRATOS_STORAGE_KEY);
  const cobrancas = carregarLista(COBRANCAS_STORAGE_KEY);

  const inquilinosAtivos = inquilinos.filter(
    (inquilino: any) => inquilino.statusContrato !== "Encerrado"
  );

  const alugueisAtrasados = cobrancas.filter((cobranca: any) => {
    if (cobrancaEstaPaga(cobranca.status)) return false;
    if (!cobranca.vencimento) return false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencimento = new Date(cobranca.vencimento);
    vencimento.setHours(0, 0, 0, 0);

    if (Number.isNaN(vencimento.getTime())) return false;

    return vencimento < hoje;
  });

  const vencemEm5Dias = cobrancas.filter((cobranca: any) => {
    if (cobrancaEstaPaga(cobranca.status)) return false;
    if (!cobranca.vencimento) return false;

    const dias = calcularDiasRestantes(cobranca.vencimento);

    return dias >= 0 && dias <= 5;
  });

  const contratosParaRenovar = contratos.filter((contrato: any) => {
    if (contrato.status === "Encerrado") return false;

    const fimContrato = contrato.dataFim || contrato.fim;

    if (!fimContrato) return false;

    const dias = calcularDiasRestantes(fimContrato);

    return dias >= 0 && dias <= 30;
  });

  return (
    <div className={styles.home}>
      <div className={styles.headerHome}>
        <div>
          <h1 className={styles.tituloHome}>Olá, Murilo!</h1>

          <p className={styles.subtituloHome}>
            Veja o que precisa de atenção hoje na imobiliária.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/novo-inquilino")}
          className={styles.novoInquilino}
        >
          + Novo inquilino
        </button>
      </div>

      <section className={styles.sectionHome}>
        <h2 className={styles.tituloCards}>Resumo geral</h2>

        <div className={styles.cardsHome}>
          <Link to="/cobrancas" className={styles.cardLink}>
            <Card
              title="Aluguéis atrasados"
              value={alugueisAtrasados.length}
              description="Precisam de cobrança"
            />
          </Link>

          <Link to="/cobrancas" className={styles.cardLink}>
            <Card
              title="Vencem em 5 dias"
              value={vencemEm5Dias.length}
              description="Próximos vencimentos"
            />
          </Link>

          <Link to="/contratos" className={styles.cardLink}>
            <Card
              title="Contratos para renovar"
              value={contratosParaRenovar.length}
              description="Vencem em até 30 dias"
            />
          </Link>

          <Link to="/inquilinos" className={styles.cardLink}>
            <Card
              title="Inquilinos ativos"
              value={inquilinosAtivos.length}
              description="Com contrato em andamento"
            />
          </Link>
        </div>
      </section>

      <section className={styles.sectionHome}>
        <h2 className={styles.tituloCards}>Ações rápidas</h2>

        <div className={styles.cardsHome}>
          <Link to="/lancar-despesas" className={styles.cardLink}>
            <Card
              title="Nova cobrança"
              value=""
              description="Lançar aluguel, água, luz ou IPTU"
            />
          </Link>

          <Link to="/inquilinos" className={styles.cardLink}>
            <Card
              title="Buscar inquilino"
              value=""
              description="Consultar por nome ou CPF"
            />
          </Link>

          <Link to="/contratos" className={styles.cardLink}>
            <Card
              title="Contratos"
              value=""
              description="Ver contratos próximos do vencimento"
            />
          </Link>

          <Link to="/configuracoes" className={styles.cardLink}>
            <Card
              title="Configurações"
              value=""
              description="Multa, juros e automações"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}