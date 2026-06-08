import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/cards";
import styles from "../style/contratos.module.css";
import ModalConfirmacao from "../components/modal";
import { usuarioLogadoMock } from "../data/usuarioLogadoMock";
import { contratosMock } from "../data/contratosMock";
import { inquilinosMock } from "../data/inquilinosMock";
import { exportarParaCSV } from "../utils/exportarCSV";

const CONTRATOS_STORAGE_KEY = "@TaboaoCenter:contratos";
const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";

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

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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

export default function Contratos() {
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Todos");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contratoParaEncerrar, setContratoParaEncerrar] = useState<string | null>(
    null
  );

  const isAdmin = usuarioLogadoMock.cargo === "admin";

  const [listaContratos, setListaContratos] = useState<any[]>(() => {
    const salvos = localStorage.getItem(CONTRATOS_STORAGE_KEY);

    if (salvos) {
      return JSON.parse(salvos);
    }

    localStorage.setItem(CONTRATOS_STORAGE_KEY, JSON.stringify(contratosMock));
    return contratosMock;
  });

  const [listaInquilinos] = useState<any[]>(() => {
    const salvos = localStorage.getItem(INQUILINOS_STORAGE_KEY);

    if (salvos) {
      return JSON.parse(salvos);
    }

    localStorage.setItem(INQUILINOS_STORAGE_KEY, JSON.stringify(inquilinosMock));
    return inquilinosMock;
  });

  const contratosComStatus = listaContratos.map((contrato) => ({
    ...contrato,
    statusCalculado: obterStatusContrato(contrato),
    diasRestantesCalculados: calcularDiasRestantes(obterFimContrato(contrato)),
  }));

  const totalAtivos = contratosComStatus.filter(
    (contrato) =>
      contrato.statusCalculado === "Ativo" ||
      contrato.statusCalculado === "Vence em breve"
  ).length;

  const totalVencemBreve = contratosComStatus.filter(
    (contrato) => contrato.statusCalculado === "Vence em breve"
  ).length;

  const totalRenovacao = contratosComStatus.filter(
    (contrato) => contrato.statusCalculado === "Renovação pendente"
  ).length;

  const totalEncerrados = contratosComStatus.filter(
    (contrato) => contrato.statusCalculado === "Encerrado"
  ).length;

  const contratosFiltrados = contratosComStatus.filter((contrato: any) => {
    const inquilino = listaInquilinos.find(
      (i: any) => String(i.id) === String(contrato.inquilinoId)
    );

    const nomeInquilino =
      inquilino?.nome || contrato.inquilinoNome || "Inquilino não encontrado";

    const cpfInquilino = inquilino?.cpf || "";
    const emailInquilino = inquilino?.email || "";
    const imovelContrato = contrato.imovel || inquilino?.imovel || "";
    const enderecoContrato = contrato.endereco || inquilino?.endereco || "";

    const textoBusca = `
      ${nomeInquilino}
      ${cpfInquilino}
      ${emailInquilino}
      ${imovelContrato}
      ${enderecoContrato}
      ${contrato.statusCalculado}
      ${obterInicioContrato(contrato)}
      ${obterFimContrato(contrato)}
      ${contrato.tipoContrato || ""}
      ${contrato.tipoGarantia || ""}
    `.toLowerCase();

    const bateBusca = textoBusca.includes(busca.toLowerCase());

    const bateStatus =
      statusSelecionado === "Todos" ||
      contrato.statusCalculado === statusSelecionado;

    const batePeriodo =
      periodoSelecionado === "Todos" ||
      (periodoSelecionado === "Próximos 30 dias" &&
        contrato.diasRestantesCalculados >= 0 &&
        contrato.diasRestantesCalculados <= 30) ||
      (periodoSelecionado === "Próximos 60 dias" &&
        contrato.diasRestantesCalculados >= 0 &&
        contrato.diasRestantesCalculados <= 60) ||
      (periodoSelecionado === "Este mês" &&
        contrato.diasRestantesCalculados >= 0 &&
        contrato.diasRestantesCalculados <= 31);

    return bateBusca && bateStatus && batePeriodo;
  });

  const handleExportar = () => {
    const dadosParaExportar = contratosFiltrados.map((contrato: any) => {
      const inquilino = listaInquilinos.find(
        (i: any) => String(i.id) === String(contrato.inquilinoId)
      );

      return {
        id: contrato.id,
        inquilinoNome:
          inquilino?.nome || contrato.inquilinoNome || "Desconhecido",
        inquilinoCpf: inquilino?.cpf || "",
        imovel: contrato.imovel || inquilino?.imovel || "",
        aluguel: obterAluguelContrato(contrato),
        diaVencimento: obterDiaVencimento(contrato),
        inicio: formatarData(obterInicioContrato(contrato)),
        fim: formatarData(obterFimContrato(contrato)),
        diasRestantes: contrato.diasRestantesCalculados,
        tipoContrato: contrato.tipoContrato || "Não informado",
        cobrancaAutomatica: contrato.cobrancaAutomatica ? "Sim" : "Não",
        reajuste: contrato.reajuste || "Anual",
        status: contrato.statusCalculado,
      };
    });

    const colunas = [
      { chave: "id", label: "ID Contrato" },
      { chave: "inquilinoNome", label: "Inquilino" },
      { chave: "inquilinoCpf", label: "CPF" },
      { chave: "imovel", label: "Imóvel" },
      { chave: "aluguel", label: "Aluguel" },
      { chave: "diaVencimento", label: "Dia Vencimento" },
      { chave: "inicio", label: "Data Início" },
      { chave: "fim", label: "Data Fim" },
      { chave: "diasRestantes", label: "Dias Restantes" },
      { chave: "tipoContrato", label: "Tipo" },
      { chave: "cobrancaAutomatica", label: "Cobrança Automática" },
      { chave: "reajuste", label: "Regra Reajuste" },
      { chave: "status", label: "Status" },
    ];

    exportarParaCSV(dadosParaExportar, colunas, "relatorio_contratos");
  };

  const alternarMenu = (id: string) => {
    setMenuAberto((menuAtual) => (menuAtual === id ? null : id));
  };

  const handleEnviarAviso = (id: string) => {
    alert(`Mensagem de aviso preparada para o contrato ${id}.`);
    setMenuAberto(null);
  };

  const handleEncerrarContrato = (id: string) => {
    setContratoParaEncerrar(id);
    setIsModalOpen(true);
    setMenuAberto(null);
  };

  const confirmarEncerramentoTabela = () => {
    if (!contratoParaEncerrar) return;

    const contratosAtualizados = listaContratos.map((contrato) => {
      if (String(contrato.id) !== String(contratoParaEncerrar)) {
        return contrato;
      }

      return {
        ...contrato,
        status: "Encerrado",
        cobrancaAutomatica: false,
        dataEncerramento: new Date().toISOString(),
      };
    });

    setListaContratos(contratosAtualizados);

    localStorage.setItem(
      CONTRATOS_STORAGE_KEY,
      JSON.stringify(contratosAtualizados)
    );

    alert(`Contrato ${contratoParaEncerrar} encerrado com sucesso.`);

    setIsModalOpen(false);
    setContratoParaEncerrar(null);
  };

  return (
    <div className={styles.contratos}>
      <div className={styles.headerContratos}>
        <div>
          <h1 className={styles.tituloContratos}>Contratos</h1>

          <p className={styles.subtituloContratos}>
            Controle contratos, vencimentos, renovações e cobrança automática.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/novo-contrato")}
          className={styles.novoContrato}
        >
          + Novo contrato
        </button>
      </div>

      <div className={styles.cardsContratos}>
        <Card
          title="Contratos ativos"
          value={totalAtivos}
          description="Gerando cobranças"
        />

        <Card
          title="Vencem em 30 dias"
          value={totalVencemBreve}
          description="Precisam de atenção"
        />

        <Card
          title="Renovação pendente"
          value={totalRenovacao}
          description="Contratos vencidos"
        />

        <Card
          title="Encerrados"
          value={totalEncerrados}
          description="Contratos finalizados"
        />
      </div>

      <div className={styles.filtrosContratos}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Buscar por inquilino, CPF, imóvel ou tipo..."
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
            <option>Ativo</option>
            <option>Vence em breve</option>
            <option>Renovação pendente</option>
            <option>Encerrado</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Período</label>

          <select
            className={styles.selectFilter}
            value={periodoSelecionado}
            onChange={(e) => setPeriodoSelecionado(e.target.value)}
          >
            <option>Todos</option>
            <option>Próximos 30 dias</option>
            <option>Próximos 60 dias</option>
            <option>Este mês</option>
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
        <table className={styles.tabelaContratos}>
          <thead>
            <tr>
              <th>Inquilino</th>
              <th>CPF</th>
              <th>Imóvel</th>
              <th>Aluguel</th>
              <th>Vencimento</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Dias restantes</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {contratosFiltrados.map((contrato: any) => {
              const inquilino = listaInquilinos.find(
                (i: any) => String(i.id) === String(contrato.inquilinoId)
              );

              const nomeInquilino =
                inquilino?.nome || contrato.inquilinoNome || "Desconhecido";

              const emailInquilino = inquilino?.email || "";
              const cpfInquilino = inquilino?.cpf || "—";
              const imovelContrato = contrato.imovel || inquilino?.imovel || "—";
              const enderecoContrato =
                contrato.endereco || inquilino?.endereco || "";
              const aluguelContrato = obterAluguelContrato(contrato);
              const diaVencimento = obterDiaVencimento(contrato);
              const inicio = obterInicioContrato(contrato);
              const fim = obterFimContrato(contrato);

              return (
                <tr key={contrato.id}>
                  <td>
                    <div className={styles.infoContrato}>
                      <div className={styles.avatarContrato}>
                        {nomeInquilino
                          .split(" ")
                          .map((parteNome: string) => parteNome[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <strong>{nomeInquilino}</strong>
                        <span>{emailInquilino}</span>
                      </div>
                    </div>
                  </td>

                  <td>{cpfInquilino}</td>

                  <td>
                    <div className={styles.infoImovel}>
                      <strong>{imovelContrato}</strong>
                      <span>{enderecoContrato}</span>
                    </div>
                  </td>

                  <td>{formatarMoeda(aluguelContrato)}</td>
                  <td>Dia {diaVencimento}</td>
                  <td>{formatarData(inicio)}</td>
                  <td>{formatarData(fim)}</td>

                  <td>
                    {contrato.diasRestantesCalculados < 0
                      ? "Vencido"
                      : contrato.diasRestantesCalculados}
                  </td>

                  <td>
                    <span
                      className={
                        contrato.statusCalculado === "Ativo"
                          ? styles.statusAtivo
                          : contrato.statusCalculado === "Vence em breve"
                            ? styles.statusVenceBreve
                            : contrato.statusCalculado === "Renovação pendente"
                              ? styles.statusRenovacao
                              : styles.statusEncerrado
                      }
                    >
                      {contrato.statusCalculado}
                    </span>
                  </td>

                  <td>
                    <div className={styles.acoesTabela}>
                      <Link
                        to={`/contratos/${contrato.id}`}
                        className={styles.botaoAcao}
                        title="Ver detalhes"
                      >
                        👁
                      </Link>

                      <Link
                        to={`/contratos/${contrato.id}/editar`}
                        className={styles.botaoAcao}
                        title="Editar contrato"
                      >
                        ✎
                      </Link>

                      <div className={styles.menuWrapper}>
                        <button
                          type="button"
                          title="Mais opções"
                          onClick={() => alternarMenu(contrato.id)}
                        >
                          ⋮
                        </button>

                        {menuAberto === contrato.id && (
                          <div className={styles.menuAcoes}>
                            <Link to={`/contratos/${contrato.id}/renovar`}>
                              Renovar contrato
                            </Link>

                            {inquilino && (
                              <Link
                                to={`/inquilinos/${inquilino.id}`}
                                state={{
                                  voltarPara: "/contratos",
                                  textoVoltar: "← Voltar para contratos",
                                }}
                              >
                                Ver inquilino
                              </Link>
                            )}

                            <button
                              type="button"
                              onClick={() => handleEnviarAviso(contrato.id)}
                            >
                              Preparar aviso
                            </button>

                            {isAdmin &&
                              contrato.statusCalculado !== "Encerrado" && (
                                <button
                                  type="button"
                                  className={styles.acaoPerigosa}
                                  onClick={() =>
                                    handleEncerrarContrato(contrato.id)
                                  }
                                >
                                  Encerrar contrato
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

            {contratosFiltrados.length === 0 && (
              <tr>
                <td colSpan={10} className={styles.semResultados}>
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.rodapeTabela}>
          <span>
            Mostrando {contratosFiltrados.length} de {listaContratos.length}{" "}
            contratos
          </span>

          <div className={styles.paginacao}>
            <button>{"<"}</button>
            <button className={styles.paginaAtiva}>1</button>
            <button>2</button>
            <button>3</button>
            <button>{">"}</button>
          </div>
        </div>
      </div>

      <ModalConfirmacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmarEncerramentoTabela}
        titulo="Confirmar Encerramento"
        mensagem={`Tem certeza que deseja encerrar o contrato #${contratoParaEncerrar}? Esta ação interromperá as cobranças automáticas e o status passará para Encerrado.`}
        textoConfirmar="Sim, encerrar"
      />
    </div>
  );
}