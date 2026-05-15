import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  formatarTipoDespesa,
  getInquilinoById,
} from "../data/inquilinosMock";
import {
  calcularMultaAutomatica,
  calcularSubtotal,
  formatarMoeda,
  getCobrancasByInquilinoId,
} from "../data/cobrancasMock";
import styles from "../style/detalheInquilino.module.css";

type LocationState = {
  voltarPara?: string;
  textoVoltar?: string;
};

export default function DetalheInquilino() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const rotaVoltar = state?.voltarPara || "/inquilinos";
  const textoVoltar = state?.textoVoltar || "← Voltar para inquilinos";

  const inquilino = getInquilinoById(id);
  const cobrancasDoInquilino = getCobrancasByInquilinoId(id);

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
          <h3>{inquilino.statusPagamento}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Aluguel</span>
          <h3>{formatarMoeda(Number(inquilino.aluguel))}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Vencimento</span>
          <h3>{inquilino.vencimentoTexto}</h3>
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
            <h3>{inquilino.dataInicio}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Fim</span>
            <h3>{inquilino.dataFim}</h3>
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
          {cobrancasDoInquilino.map((cobranca) => {
            const subtotal = calcularSubtotal(cobranca);
            const multa = calcularMultaAutomatica(cobranca.status, subtotal);
            const total = subtotal + multa;

            return (
              <div className={styles.cobrancaItem} key={cobranca.id}>
                <span>{cobranca.referencia}</span>
                <h3>{formatarMoeda(total)}</h3>
                <p>{cobranca.status}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}