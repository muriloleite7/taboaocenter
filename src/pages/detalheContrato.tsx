import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatarMoeda } from "../data/cobrancasMock";
import { contratosMock } from "../data/contratosMock";
import { inquilinosMock } from "../data/inquilinosMock";
import { cobrancasMock } from "../data/cobrancasMock";
import styles from "../style/detalheInquilino.module.css";
import ModalConfirmacao from "../components/modal";

const CONTRATOS_STORAGE_KEY = "@TaboaoCenter:contratos";
const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";
const COBRANCAS_STORAGE_KEY = "@TaboaoCenter:cobrancas";

function carregarContratos() {
  const contratosSalvos = localStorage.getItem(CONTRATOS_STORAGE_KEY);

  if (contratosSalvos) {
    return JSON.parse(contratosSalvos);
  }

  localStorage.setItem(CONTRATOS_STORAGE_KEY, JSON.stringify(contratosMock));
  return contratosMock;
}

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

function formatarData(data: string) {
  if (!data) return "—";

  const dataObj = new Date(data);

  if (Number.isNaN(dataObj.getTime())) {
    return data;
  }

  return dataObj.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

function calcularDiasRestantes(dataFim: string) {
  if (!dataFim) return 0;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const fim = new Date(dataFim);
  fim.setHours(0, 0, 0, 0);

  if (Number.isNaN(fim.getTime())) return 0;

  const diferencaMs = fim.getTime() - hoje.getTime();
  return Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));
}

function obterInicioContrato(contrato: any) {
  return contrato.inicio || contrato.dataInicio || "";
}

function obterFimContrato(contrato: any) {
  return contrato.fim || contrato.dataFim || "";
}

function obterAluguelContrato(contrato: any) {
  return Number(contrato.valorAluguel || contrato.aluguel || 0);
}

function obterDiaVencimento(contrato: any) {
  return contrato.diaVencimento || contrato.vencimento || "—";
}

function obterStatusContrato(contrato: any) {
  if (contrato.status === "Encerrado") return "Encerrado";

  const fim = obterFimContrato(contrato);
  const diasRestantes = calcularDiasRestantes(fim);

  if (diasRestantes < 0) return "Renovação pendente";
  if (diasRestantes <= 30) return "Vence em breve";

  return contrato.status || "Ativo";
}

export default function DetalheContrato() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contrato, setContrato] = useState<any>(null);
  const [inquilino, setInquilino] = useState<any>(null);
  const [cobrancasContrato, setCobrancasContrato] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const listaContratos = carregarContratos();
    const listaInquilinos = carregarInquilinos();
    const listaCobrancas = carregarCobrancas();

    const contratoEncontrado = listaContratos.find(
      (contratoItem: any) => String(contratoItem.id) === String(id)
    );

    if (!contratoEncontrado) {
      setContrato(null);
      setCarregando(false);
      return;
    }

    const inquilinoEncontrado = listaInquilinos.find(
      (inquilinoItem: any) =>
        String(inquilinoItem.id) === String(contratoEncontrado.inquilinoId)
    );

    const cobrancasDoInquilino = listaCobrancas.filter(
      (cobranca: any) =>
        String(cobranca.inquilinoId) === String(contratoEncontrado.inquilinoId)
    );

    setContrato(contratoEncontrado);
    setInquilino(inquilinoEncontrado || null);
    setCobrancasContrato(cobrancasDoInquilino);
    setCarregando(false);
  }, [id]);

  const handleConfirmarEncerramento = () => {
    const listaContratos = carregarContratos();

    const contratosAtualizados = listaContratos.map((contratoItem: any) => {
      if (String(contratoItem.id) !== String(id)) {
        return contratoItem;
      }

      return {
        ...contratoItem,
        status: "Encerrado",
        cobrancaAutomatica: false,
        dataEncerramento: new Date().toISOString(),
      };
    });

    localStorage.setItem(
      CONTRATOS_STORAGE_KEY,
      JSON.stringify(contratosAtualizados)
    );

    setContrato((contratoAtual: any) => ({
      ...contratoAtual,
      status: "Encerrado",
      cobrancaAutomatica: false,
      dataEncerramento: new Date().toISOString(),
    }));

    setIsModalOpen(false);
    alert("Contrato encerrado com sucesso!");
  };

  if (carregando) {
    return (
      <div className={styles.detalheInquilino}>
        <h1>Carregando contrato...</h1>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className={styles.detalheInquilino}>
        <h1>Contrato não encontrado</h1>

        <Link to="/contratos" className={styles.voltarLink}>
          Voltar para contratos
        </Link>
      </div>
    );
  }

  const nomeInquilino =
    inquilino?.nome || contrato.inquilinoNome || "Inquilino não encontrado";

  const cpfInquilino = inquilino?.cpf || "—";
  const emailInquilino = inquilino?.email || "—";
  const telefoneInquilino = inquilino?.telefone || "—";

  const imovelContrato = contrato.imovel || inquilino?.imovel || "—";
  const enderecoContrato = contrato.endereco || inquilino?.endereco || "—";

  const aluguelContrato = obterAluguelContrato(contrato);
  const diaVencimento = obterDiaVencimento(contrato);
  const inicioContrato = obterInicioContrato(contrato);
  const fimContrato = obterFimContrato(contrato);
  const diasRestantes = calcularDiasRestantes(fimContrato);
  const statusContrato = obterStatusContrato(contrato);

  const contratoEncerrado = statusContrato === "Encerrado";

  return (
    <div className={styles.detalheInquilino}>
      <div className={styles.headerDetalhe}>
        <div>
          <Link to="/contratos" className={styles.voltarLink}>
            ← Voltar para contratos
          </Link>

          <h1>
            Contrato #{contrato.id} - {nomeInquilino}
          </h1>

          <p>Gestão de prazos, valores, cobrança automática e regras contratuais.</p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link
            to={`/contratos/${id}/editar`}
            className={styles.editarButton}
            style={{ background: "#64748b" }}
          >
            ✎ Editar Contrato
          </Link>

          <Link
            to={`/contratos/${id}/renovar`}
            className={styles.editarButton}
            style={{ background: "#4f46e5" }}
          >
            ↻ Renovar Contrato
          </Link>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={styles.editarButton}
            style={{ background: contratoEncerrado ? "#94a3b8" : "#950000" }}
            disabled={contratoEncerrado}
          >
            {contratoEncerrado ? "Contrato Encerrado" : "Encerrar Contrato"}
          </button>
        </div>
      </div>

      <div className={styles.gridResumo}>
        <div className={styles.resumoCard}>
          <span>Status do Contrato</span>
          <h3>{statusContrato}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Aluguel Atual</span>
          <h3>{formatarMoeda(aluguelContrato)}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Vencimento</span>
          <h3>Dia {diaVencimento}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Tempo Restante</span>
          <h3>{diasRestantes < 0 ? "Vencido" : `${diasRestantes} dias`}</h3>
        </div>
      </div>

      <div className={styles.conteudoGrid}>
        <section className={styles.cardInfo}>
          <h2>Partes do Contrato</h2>

          <div className={styles.infoLinha}>
            <span>Inquilino</span>
            <h3>{nomeInquilino}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>CPF</span>
            <h3>{cpfInquilino}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>E-mail</span>
            <h3>{emailInquilino}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Telefone</span>
            <h3>{telefoneInquilino}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Localização</h2>

          <div className={styles.infoLinha}>
            <span>Imóvel</span>
            <h3>{imovelContrato}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Endereço completo</span>
            <h3>{enderecoContrato}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Tipo de contrato</span>
            <h3>{contrato.tipoContrato || "Não informado"}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Vigência</h2>

          <div className={styles.infoLinha}>
            <span>Data de início</span>
            <h3>{formatarData(inicioContrato)}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Data de término</span>
            <h3>{formatarData(fimContrato)}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Reajuste</span>
            <h3>{contrato.reajuste || "Anual"}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Cobrança e garantia</h2>

          <div className={styles.infoLinha}>
            <span>Cobrança automática</span>
            <h3>{contrato.cobrancaAutomatica === false ? "Não" : "Sim"}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Garantia</span>
            <h3>{contrato.tipoGarantia || "Não informado"}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Valor da garantia</span>
            <h3>{formatarMoeda(Number(contrato.valorGarantia || 0))}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Condomínio / Taxas</span>
            <h3>{formatarMoeda(Number(contrato.valorCondominio || 0))}</h3>
          </div>
        </section>
      </div>

      <section className={styles.cardInfo}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Histórico de Cobranças</h2>
            <p>Cobranças vinculadas ao inquilino deste contrato.</p>
          </div>
        </div>

        <div className={styles.cobrancasLista}>
          {cobrancasContrato.length > 0 ? (
            cobrancasContrato.map((cobranca: any) => {
              const total =
                Number(cobranca.total) ||
                Number(cobranca.aluguel || 0) +
                  Number(cobranca.agua || 0) +
                  Number(cobranca.luz || 0) +
                  Number(cobranca.iptu || 0);

              return (
                <div className={styles.cobrancaItem} key={cobranca.id}>
                  <span>{cobranca.referencia}</span>

                  <h3>{formatarMoeda(total)}</h3>

                  <p
                    style={{
                      color:
                        cobranca.status === "Paga" ? "#16a34a" : "#c2410c",
                    }}
                  >
                    {cobranca.status}
                  </p>
                </div>
              );
            })
          ) : (
            <p style={{ color: "#64748b" }}>
              Nenhuma cobrança encontrada para este contrato.
            </p>
          )}
        </div>
      </section>

      <ModalConfirmacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmarEncerramento}
        titulo="Confirmar Encerramento?"
        mensagem={`Tem certeza que deseja encerrar o contrato #${id}? Esta ação interromperá as cobranças futuras.`}
        textoConfirmar="Sim, encerrar contrato"
      />
    </div>
  );
}