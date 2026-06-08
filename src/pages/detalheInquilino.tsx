import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { inquilinosMock, formatarTipoDespesa } from "../data/inquilinosMock";
import {
  calcularMultaAutomatica,
  calcularSubtotal,
  cobrancasMock,
  formatarMoeda,
} from "../data/cobrancasMock";
import styles from "../style/detalheInquilino.module.css";

const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";
const COBRANCAS_STORAGE_KEY = "@TaboaoCenter:cobrancas";
const CONTRATOS_STORAGE_KEY = "@TaboaoCenter:contratos";

type LocationState = {
  voltarPara?: string;
  textoVoltar?: string;
};

function carregarInquilinos() {
  const inquilinosSalvos = localStorage.getItem(INQUILINOS_STORAGE_KEY);

  if (inquilinosSalvos) {
    return JSON.parse(inquilinosSalvos);
  }

  localStorage.setItem(INQUILINOS_STORAGE_KEY, JSON.stringify(inquilinosMock));
  return inquilinosMock;
}

function carregarCobrancas() {
  const cobrancasSalvas = localStorage.getItem(COBRANCAS_STORAGE_KEY);

  if (cobrancasSalvas) {
    return JSON.parse(cobrancasSalvas);
  }

  localStorage.setItem(COBRANCAS_STORAGE_KEY, JSON.stringify(cobrancasMock));
  return cobrancasMock;
}

function carregarContratos() {
  const contratosSalvos = localStorage.getItem(CONTRATOS_STORAGE_KEY);

  if (contratosSalvos) {
    return JSON.parse(contratosSalvos);
  }

  return [];
}

function formatarDataSimples(data: string) {
  if (!data) return "—";

  const dataObj = new Date(data);

  if (Number.isNaN(dataObj.getTime())) {
    return data;
  }

  return dataObj.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

export default function DetalheInquilino() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const rotaVoltar = state?.voltarPara || "/inquilinos";
  const textoVoltar = state?.textoVoltar || "← Voltar para inquilinos";

  const listaInquilinos = carregarInquilinos();
  const listaCobrancas = carregarCobrancas();
  const listaContratos = carregarContratos();

  const inquilino = listaInquilinos.find(
    (item: any) => String(item.id) === String(id)
  );

  const cobrancasDoInquilino = listaCobrancas.filter(
    (cobranca: any) => String(cobranca.inquilinoId) === String(id)
  );

  const contratosDoInquilino = listaContratos.filter(
    (contrato: any) => String(contrato.inquilinoId) === String(id)
  );

  const contratoAtivo =
    contratosDoInquilino.find((contrato: any) => contrato.status !== "Encerrado") ||
    contratosDoInquilino[0];

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

  const aluguel =
    Number(contratoAtivo?.valorAluguel || contratoAtivo?.aluguel || inquilino.aluguel || 0);

  const diaVencimento =
    contratoAtivo?.diaVencimento ||
    contratoAtivo?.vencimento ||
    inquilino.diaVencimento ||
    inquilino.vencimento ||
    "—";

  const dataInicio =
    contratoAtivo?.dataInicio || contratoAtivo?.inicio || inquilino.dataInicio || "";

  const dataFim =
    contratoAtivo?.dataFim || contratoAtivo?.fim || inquilino.dataFim || "";

  const statusContrato =
    contratoAtivo?.status || inquilino.statusContrato || "Ativo";

  return (
    <div className={styles.detalheInquilino}>
      <div className={styles.headerDetalhe}>
        <div>
          <button
            type="button"
            className={styles.voltarButton}
            onClick={() => navigate(rotaVoltar)}
          >
            {textoVoltar}
          </button>

          <h1>{inquilino.nome}</h1>

          <p>Detalhes completos do inquilino, contrato e cobranças.</p>
        </div>

        <Link
          to={`/inquilinos/${id}/editar`}
          state={{
            voltarPara: rotaVoltar,
            textoVoltar,
          }}
          className={styles.editarButton}
        >
          Editar inquilino
        </Link>
      </div>

      <div className={styles.gridResumo}>
        <div className={styles.resumoCard}>
          <span>Status do pagamento</span>
          <h3>{inquilino.statusPagamento || "Adimplente"}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Aluguel</span>
          <h3>{formatarMoeda(aluguel)}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Vencimento</span>
          <h3>Dia {diaVencimento}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Contrato</span>
          <h3>{statusContrato}</h3>
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
            <h3>{inquilino.cpf || "—"}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>WhatsApp</span>
            <h3>{inquilino.telefone || "—"}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>E-mail</span>
            <h3>{inquilino.email || "—"}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Contato de emergência</span>
            <h3>
              {inquilino.emergenciaNome
                ? `${inquilino.emergenciaNome} - ${inquilino.emergenciaTel || ""}`
                : "—"}
            </h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Imóvel vinculado</h2>

          <div className={styles.infoLinha}>
            <span>Imóvel</span>
            <h3>{contratoAtivo?.imovel || inquilino.imovel || "—"}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Endereço/Bairro</span>
            <h3>{inquilino.endereco || "—"}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Contrato</h2>

          <div className={styles.infoLinha}>
            <span>Início</span>
            <h3>{formatarDataSimples(dataInicio)}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Fim</span>
            <h3>{formatarDataSimples(dataFim)}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Status</span>
            <h3>{statusContrato}</h3>
          </div>

          {contratoAtivo && (
            <div className={styles.infoLinha}>
              <span>Contrato vinculado</span>

              <h3>
                <Link to={`/contratos/${contratoAtivo.id}`}>
                  Ver contrato #{contratoAtivo.id}
                </Link>
              </h3>
            </div>
          )}
        </section>

        <section className={styles.cardInfo}>
          <h2>Despesas do contrato</h2>

          <div className={styles.infoLinha}>
            <span>Água</span>
            <h3>
              {formatarTipoDespesa(inquilino.aguaTipo, inquilino.aguaValor)}
            </h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Luz</span>
            <h3>
              {formatarTipoDespesa(inquilino.luzTipo, inquilino.luzValor)}
            </h3>
          </div>

          <div className={styles.infoLinha}>
            <span>IPTU</span>
            <h3>
              {formatarTipoDespesa(inquilino.iptuTipo, inquilino.iptuValor)}
            </h3>
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
          {cobrancasDoInquilino.length > 0 ? (
            cobrancasDoInquilino.map((cobranca: any) => {
              const subtotal = calcularSubtotal(cobranca);
              const multa = calcularMultaAutomatica(cobranca.status, subtotal);
              const total = Number(cobranca.total) || subtotal + multa;

              return (
                <div className={styles.cobrancaItem} key={cobranca.id}>
                  <span>{cobranca.referencia}</span>

                  <h3>{formatarMoeda(total)}</h3>

                  <p>{cobranca.status}</p>
                </div>
              );
            })
          ) : (
            <p style={{ color: "#64748b" }}>
              Nenhuma cobrança encontrada para este inquilino.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}