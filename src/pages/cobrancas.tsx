import { useState } from "react";
import Card from "../components/cards";
import styles from "../style/cobrancas.module.css";
import { Link, useLocation } from "react-router-dom";
import { inquilinosMock } from "../data/inquilinosMock";
import {
  calcularMultaAutomatica,
  calcularSubtotal,
  cobrancasMock,
  formatarData,
  formatarMoeda,
} from "../data/cobrancasMock";
import { usuarioLogadoMock } from "../data/usuarioLogadoMock";
import { exportarParaCSV } from "../utils/exportarCSV";

const COBRANCAS_STORAGE_KEY = "@TaboaoCenter:cobrancas";
const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";

type LocationState = {
  inquilinoId?: string;
};

function calcularDiasRestantes(dataVencimento: string) {
  if (!dataVencimento) return 0;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const vencimento = new Date(dataVencimento);
  vencimento.setHours(0, 0, 0, 0);

  if (Number.isNaN(vencimento.getTime())) {
    return 0;
  }

  const diferencaMs = vencimento.getTime() - hoje.getTime();

  return Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));
}

function cobrancaEstaPaga(status: string) {
  return status === "Paga" || status === "Pago";
}

function obterStatusVisual(status: string) {
  if (status === "Pago") return "Paga";
  return status;
}

export default function Cobrancas() {
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [listaCobrancas, setListaCobrancas] = useState<any[]>(() => {
    const salvas = localStorage.getItem(COBRANCAS_STORAGE_KEY);

    if (salvas) {
      return JSON.parse(salvas);
    }

    localStorage.setItem(COBRANCAS_STORAGE_KEY, JSON.stringify(cobrancasMock));

    return cobrancasMock;
  });

  const [listaInquilinos] = useState<any[]>(() => {
    const salvos = localStorage.getItem(INQUILINOS_STORAGE_KEY);

    if (salvos) {
      return JSON.parse(salvos);
    }

    localStorage.setItem(INQUILINOS_STORAGE_KEY, JSON.stringify(inquilinosMock));

    return inquilinosMock;
  });

  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Todos");
  const [referenciaSelecionada, setReferenciaSelecionada] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  const [inquilinoFiltradoId, setInquilinoFiltradoId] = useState<string | null>(
    state?.inquilinoId ? String(state.inquilinoId) : null
  );

  const isAdmin = usuarioLogadoMock.cargo === "admin";

  const inquilinoFiltrado = inquilinoFiltradoId
    ? listaInquilinos.find(
        (inquilino: any) => String(inquilino.id) === String(inquilinoFiltradoId)
      )
    : null;

  const referenciasDisponiveis = Array.from(
    new Set(listaCobrancas.map((cobranca: any) => cobranca.referencia))
  ).filter(Boolean);

  const cobrancasFiltradas = listaCobrancas.filter((cobranca: any) => {
    const inquilino = listaInquilinos.find(
      (i: any) => String(i.id) === String(cobranca.inquilinoId)
    );

    if (!inquilino) return false;

    const bateInquilinoFiltrado =
      !inquilinoFiltradoId ||
      String(cobranca.inquilinoId) === String(inquilinoFiltradoId);

    const textoBusca = `
      ${inquilino.nome || ""}
      ${inquilino.email || ""}
      ${inquilino.cpf || ""}
      ${inquilino.imovel || ""}
      ${cobranca.referencia || ""}
      ${cobranca.status || ""}
    `.toLowerCase();

    const bateBusca = textoBusca.includes(busca.toLowerCase());

    const bateStatus =
      statusSelecionado === "Todos" ||
      obterStatusVisual(cobranca.status) === statusSelecionado;

    const bateReferencia =
      referenciaSelecionada === "Todos" ||
      cobranca.referencia === referenciaSelecionada;

    return bateInquilinoFiltrado && bateBusca && bateStatus && bateReferencia;
  });

  const totalPendentes = listaCobrancas.filter(
    (cobranca: any) => obterStatusVisual(cobranca.status) === "Pendente"
  ).length;

  const totalAtrasadas = listaCobrancas.filter(
    (cobranca: any) => obterStatusVisual(cobranca.status) === "Atrasada"
  ).length;

  const totalDespesasPendentes = listaCobrancas.filter(
    (cobranca: any) =>
      obterStatusVisual(cobranca.status) === "Despesas pendentes"
  ).length;

  const totalVencemEm5Dias = listaCobrancas.filter((cobranca: any) => {
    if (cobrancaEstaPaga(cobranca.status)) return false;
    if (!cobranca.vencimento) return false;

    const dias = calcularDiasRestantes(cobranca.vencimento);

    return dias >= 0 && dias <= 5;
  }).length;

  const alternarMenu = (id: string) => {
    setMenuAberto((menuAtual) => (menuAtual === id ? null : id));
  };

  const limparFiltroInquilino = () => {
    setInquilinoFiltradoId(null);
  };

  const handleExportar = () => {
    const dadosParaExportar = cobrancasFiltradas.map((cobranca: any) => {
      const inquilino = listaInquilinos.find(
        (i: any) => String(i.id) === String(cobranca.inquilinoId)
      );

      const subtotal = calcularSubtotal(cobranca);
      const multa = calcularMultaAutomatica(cobranca.status, subtotal);
      const totalCalculado = subtotal + multa;

      return {
        inquilinoNome: inquilino ? inquilino.nome : "Desconhecido",
        inquilinoCpf: inquilino ? inquilino.cpf : "",
        imovel: inquilino ? inquilino.imovel : "",
        referencia: cobranca.referencia,
        aluguel: Number(cobranca.aluguel || 0),
        agua: cobranca.agua ? Number(cobranca.agua) : 0,
        luz: cobranca.luz ? Number(cobranca.luz) : 0,
        iptu: cobranca.iptu ? Number(cobranca.iptu) : 0,
        multa,
        total:
          cobranca.status === "Despesas pendentes"
            ? "Aguardando despesas"
            : totalCalculado,
        vencimento: formatarData(cobranca.vencimento),
        status: obterStatusVisual(cobranca.status),
      };
    });

    const colunas = [
      { chave: "inquilinoNome", label: "Inquilino" },
      { chave: "inquilinoCpf", label: "CPF" },
      { chave: "imovel", label: "Imóvel" },
      { chave: "referencia", label: "Referência" },
      { chave: "aluguel", label: "Aluguel" },
      { chave: "agua", label: "Água" },
      { chave: "luz", label: "Luz" },
      { chave: "iptu", label: "IPTU" },
      { chave: "multa", label: "Multa" },
      { chave: "total", label: "Total" },
      { chave: "vencimento", label: "Vencimento" },
      { chave: "status", label: "Status" },
    ];

    exportarParaCSV(dadosParaExportar, colunas, "relatorio_cobrancas");
  };

  const handlePrepararWhatsApp = (nome: string, cobranca: any) => {
    const subtotal = calcularSubtotal(cobranca);
    const multa = calcularMultaAutomatica(cobranca.status, subtotal);
    const total = subtotal + multa;

    const mensagem = `Olá, ${nome}. Sua cobrança de ${
      cobranca.referencia
    } está disponível.

Valor: ${
      cobranca.status === "Despesas pendentes"
        ? "Aguardando fechamento das despesas"
        : formatarMoeda(total)
    }
Vencimento: ${formatarData(cobranca.vencimento)}

Assim que o pagamento for confirmado, o sistema será atualizado.`;

    navigator.clipboard
      .writeText(mensagem)
      .then(() => {
        alert("Mensagem de WhatsApp copiada para a área de transferência.");
      })
      .catch(() => {
        alert(mensagem);
      });

    setMenuAberto(null);
  };

  const handleCancelarCobranca = (id: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja cancelar a cobrança ${id}? Essa ação deve ser feita apenas por um administrador.`
    );

    if (!confirmar) return;

    const atualizadas = listaCobrancas.filter(
      (cobranca: any) => String(cobranca.id) !== String(id)
    );

    setListaCobrancas(atualizadas);
    localStorage.setItem(COBRANCAS_STORAGE_KEY, JSON.stringify(atualizadas));

    alert(`Cobrança ${id} cancelada com sucesso.`);
    setMenuAberto(null);
  };

  return (
    <div className={styles.cobrancas}>
      <div className={styles.headerCobrancas}>
        <div>
          <h1 className={styles.tituloCobrancas}>Cobranças</h1>

          <p className={styles.subtituloCobrancas}>
            Acompanhe cobranças automáticas, pagamentos, vencimentos e despesas
            variáveis dos contratos.
          </p>
        </div>

        <Link to="/lancar-despesas" className={styles.lancarDespesa}>
          + Lançar despesas variáveis
        </Link>
      </div>

      <div className={styles.cardsCobrancas}>
        <Card
          title="Cobranças pendentes"
          value={totalPendentes}
          description="Aguardando pagamento"
        />

        <Card
          title="Vencem em 5 dias"
          value={totalVencemEm5Dias}
          description="Lembretes programados"
        />

        <Card
          title="Atrasadas"
          value={totalAtrasadas}
          description="Com multa aplicada"
        />

        <Card
          title="Despesas a lançar"
          value={totalDespesasPendentes}
          description="Água, luz e IPTU pendentes"
        />
      </div>

      {inquilinoFiltrado && (
        <div
          className={styles.filtrosCobrancas}
          style={{ alignItems: "center" }}
        >
          <div>
            <strong style={{ color: "#0f172a" }}>
              Mostrando cobranças de: {inquilinoFiltrado.nome}
            </strong>

            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
              CPF: {inquilinoFiltrado.cpf || "Não informado"} • Imóvel:{" "}
              {inquilinoFiltrado.imovel || "Não informado"}
            </p>
          </div>

          <button
            type="button"
            className={styles.exportButton}
            onClick={limparFiltroInquilino}
          >
            Ver todas as cobranças
          </button>
        </div>
      )}

      <div className={styles.filtrosCobrancas}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Buscar por inquilino, CPF ou referência..."
            className={styles.searchInput}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Status</label>

          <select
            className={styles.selectFilter}
            value={statusSelecionado}
            onChange={(e) => setStatusSelecionado(e.target.value)}
          >
            <option>Todos</option>
            <option>Pendente</option>
            <option>Paga</option>
            <option>Atrasada</option>
            <option>Despesas pendentes</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Referência</label>

          <select
            className={styles.selectFilter}
            value={referenciaSelecionada}
            onChange={(e) => setReferenciaSelecionada(e.target.value)}
          >
            <option>Todos</option>

            {referenciasDisponiveis.map((referencia: string) => (
              <option key={referencia}>{referencia}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleExportar}
          className={styles.exportButton}
        >
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
              <th>IPTU</th>
              <th>Multa</th>
              <th>Total</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {cobrancasFiltradas.map((cobranca: any) => {
              const inquilino = listaInquilinos.find(
                (i: any) => String(i.id) === String(cobranca.inquilinoId)
              );

              if (!inquilino) return null;

              const subtotal = calcularSubtotal(cobranca);
              const multa = calcularMultaAutomatica(cobranca.status, subtotal);
              const total = subtotal + multa;

              const statusVisual = obterStatusVisual(cobranca.status);

              return (
                <tr key={cobranca.id}>
                  <td>
                    <div className={styles.infoCobranca}>
                      <div className={styles.avatarCobranca}>
                        {(inquilino.nome || "?")
                          .split(" ")
                          .map((parteNome: string) => parteNome[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <strong>{inquilino.nome}</strong>
                        <span>{inquilino.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>{inquilino.cpf}</td>
                  <td>{cobranca.referencia}</td>
                  <td>{formatarMoeda(Number(cobranca.aluguel || 0))}</td>

                  <td>
                    {cobranca.agua ? formatarMoeda(Number(cobranca.agua)) : "—"}
                  </td>

                  <td>
                    {cobranca.luz ? formatarMoeda(Number(cobranca.luz)) : "—"}
                  </td>

                  <td>
                    {cobranca.iptu ? formatarMoeda(Number(cobranca.iptu)) : "—"}
                  </td>

                  <td>{multa ? formatarMoeda(multa) : "—"}</td>

                  <td>
                    <span className={styles.valorTotal}>
                      {statusVisual === "Despesas pendentes"
                        ? "Aguardando despesas"
                        : formatarMoeda(total)}
                    </span>
                  </td>

                  <td>{formatarData(cobranca.vencimento)}</td>

                  <td>
                    <span
                      className={
                        statusVisual === "Paga"
                          ? styles.statusPago
                          : statusVisual === "Atrasada"
                            ? styles.statusAtrasado
                            : statusVisual === "Despesas pendentes"
                              ? styles.statusDespesas
                              : styles.statusPendente
                      }
                    >
                      <span className={styles.statusText}>{statusVisual}</span>
                    </span>
                  </td>

                  <td>
                    <div className={styles.acoesTabela}>
                      <Link
                        to={`/inquilinos/${inquilino.id}`}
                        state={{
                          voltarPara: "/cobrancas",
                          textoVoltar: "← Voltar para cobranças",
                        }}
                        className={styles.botaoAcao}
                        title="Ver detalhes do inquilino"
                      >
                        👁
                      </Link>

                      <Link
                        to={`/cobrancas/${cobranca.id}/editar`}
                        className={styles.botaoAcao}
                        title="Ver ou editar cobrança"
                      >
                        ✎
                      </Link>

                      <div className={styles.menuWrapper}>
                        <button
                          type="button"
                          title="Mais opções"
                          onClick={() => alternarMenu(cobranca.id)}
                        >
                          ⋮
                        </button>

                        {menuAberto === cobranca.id && (
                          <div className={styles.menuAcoes}>
                            <button
                              type="button"
                              onClick={() =>
                                handlePrepararWhatsApp(inquilino.nome, cobranca)
                              }
                            >
                              Preparar WhatsApp
                            </button>

                            <Link
                              to={`/cobrancas/${cobranca.id}/editar`}
                              onClick={() => setMenuAberto(null)}
                            >
                              Registrar pagamento manual
                            </Link>

                            {isAdmin && (
                              <button
                                type="button"
                                className={styles.acaoPerigosa}
                                onClick={() =>
                                  handleCancelarCobranca(cobranca.id)
                                }
                              >
                                Cancelar cobrança
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}

            {cobrancasFiltradas.length === 0 && (
              <tr>
                <td colSpan={12} className={styles.semResultados}>
                  Nenhuma cobrança encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.rodapeTabela}>
          <span>
            Mostrando {cobrancasFiltradas.length} de {listaCobrancas.length}{" "}
            cobranças
          </span>

          <div className={styles.paginacao}>
            <button type="button">{"<"}</button>

            <button type="button" className={styles.paginaAtiva}>
              1
            </button>

            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}