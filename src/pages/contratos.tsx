import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/cards";
import styles from "../style/contratos.module.css";
import ModalConfirmacao from "../components/modal";
import { usuarioLogadoMock } from "../data/usuarioLogadoMock";
import { contratosMock } from "../data/contratosMock";
import { inquilinosMock } from "../data/inquilinosMock";
import { exportarParaCSV } from "../utils/exportarCSV";

export default function Contratos() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Todos");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<string | null>(null);

  // ESTADOS DO MODAL E USUÁRIO
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contratoParaEncerrar, setContratoParaEncerrar] = useState<string | null>(null);
  const isAdmin = usuarioLogadoMock.cargo === "admin";

  // 1. CARREGANDO CONTRATOS DO LOCALSTORAGE
  const [listaContratos] = useState(() => {
    const salvos = localStorage.getItem("@TaboaoCenter:contratos");
    if (salvos) return JSON.parse(salvos);
    
    // Se não tiver nada salvo, inicia com o mock e já salva
    localStorage.setItem("@TaboaoCenter:contratos", JSON.stringify(contratosMock));
    return contratosMock;
  });

  // 2. CARREGANDO INQUILINOS DO LOCALSTORAGE (para cruzar os dados corretamente)
  const [listaInquilinos] = useState(() => {
    const salvos = localStorage.getItem("@TaboaoCenter:inquilinos");
    return salvos ? JSON.parse(salvos) : inquilinosMock;
  });

  // 3. ATUALIZANDO OS CONTADORES DOS CARDS PARA USAR A LISTA DINÂMICA
  const totalAtivos = listaContratos.filter(
    (c: any) => c.status === "Ativo" || c.status === "Vence em breve"
  ).length;
  const totalVencemBreve = listaContratos.filter((c: any) => c.status === "Vence em breve").length;
  const totalRenovacao = listaContratos.filter((c: any) => c.status === "Renovação pendente").length;
  const totalEncerrados = listaContratos.filter((c: any) => c.status === "Encerrado").length;

  // 4. ATUALIZANDO O FILTRO PARA USAR A LISTA DINÂMICA E BUSCAR O INQUILINO NO STATE
  const contratosFiltrados = listaContratos.filter((contrato: any) => {
    const inquilino = listaInquilinos.find((i: any) => i.id === contrato.inquilinoId);
    if (!inquilino) return false;

    const textoBusca = `${inquilino.nome} ${inquilino.email} ${inquilino.cpf} ${inquilino.imovel} ${inquilino.endereco} ${contrato.status} ${contrato.inicio} ${contrato.fim}`.toLowerCase();
    
    const bateBusca = textoBusca.includes(busca.toLowerCase());
    const bateStatus = statusSelecionado === "Todos" || contrato.status === statusSelecionado;
    const batePeriodo =
      periodoSelecionado === "Todos" ||
      (periodoSelecionado === "Próximos 30 dias" && contrato.status === "Vence em breve") ||
      (periodoSelecionado === "Próximos 60 dias" && contrato.status !== "Encerrado") ||
      (periodoSelecionado === "Este mês" && contrato.status !== "Encerrado");

    return bateBusca && bateStatus && batePeriodo;
  });

  const handleExportar = () => {
    const dadosParaExportar = contratosFiltrados.map((contrato: any) => {
      const inquilino = listaInquilinos.find((i: any) => i.id === contrato.inquilinoId);
      return {
        id: contrato.id,
        inquilinoNome: inquilino ? inquilino.nome : "Desconhecido",
        inquilinoCpf: inquilino ? inquilino.cpf : "",
        imovel: inquilino ? inquilino.imovel : "",
        inicio: contrato.inicio,
        fim: contrato.fim,
        reajuste: contrato.reajuste || "Anual",
        status: contrato.status,
      };
    });

  const colunas = [
      { chave: "id", label: "ID Contrato" },
      { chave: "inquilinoNome", label: "Inquilino" },
      { chave: "inquilinoCpf", label: "CPF" },
      { chave: "imovel", label: "Imóvel" },
      { chave: "inicio", label: "Data Início" },
      { chave: "fim", label: "Data Fim" },
      { chave: "reajuste", label: "Regra Reajuste" },
      { chave: "status", label: "Status" },
    ];

    exportarParaCSV(dadosParaExportar, colunas, "relatorio_contratos");
  };

  const alternarMenu = (id: string) => {
    setMenuAberto((menuAtual) => (menuAtual === id ? null : id));
  };

  const handleEnviarAviso = (id: string) => {
    alert(`Aqui futuramente será enviado um aviso sobre o contrato ${id}.`);
    setMenuAberto(null);
  };

  const handleEncerrarContrato = (id: string) => {
    setContratoParaEncerrar(id);
    setIsModalOpen(true);
    setMenuAberto(null);
  };

  const confirmarEncerramentoTabela = () => {
    alert(`O contrato ${contratoParaEncerrar} foi marcado como encerrado! (Futuro back-end)`);
    setIsModalOpen(false);
    setContratoParaEncerrar(null);
  };

  return (
    <div className={styles.contratos}>
      <div className={styles.headerContratos}>
        <div>
          <h1 className={styles.tituloContratos}>Contratos</h1>
          <p className={styles.subtituloContratos}>
            Controle os contratos, vencimentos e renovações da imobiliária.
          </p>
        </div>

        <button onClick={() => navigate("/novo-contrato")} className={styles.novoContrato}>
          + Novo contrato
        </button>
      </div>

      <div className={styles.cardsContratos}>
        <Card title="Contratos ativos" value={totalAtivos} description="Em andamento" />
        <Card title="Vencem em 30 dias" value={totalVencemBreve} description="Precisam de atenção" />
        <Card title="Renovação pendente" value={totalRenovacao} description="Aguardando retorno" />
        <Card title="Encerrados" value={totalEncerrados} description="Contratos finalizados" />
      </div>

      <div className={styles.filtrosContratos}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Buscar por inquilino, CPF ou imóvel..."
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
        <button onClick={handleExportar} className={styles.exportButton}>⇩ Exportar</button>
      </div>

      <div className={styles.tabelaContainer}>
        <table className={styles.tabelaContratos}>
          <thead>
            <tr>
              <th>Inquilino</th>
              <th>CPF</th>
              <th>Imóvel</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Dias restantes</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contratosFiltrados.map((contrato: any) => {
              const inquilino = listaInquilinos.find((i: any) => i.id === contrato.inquilinoId);
              if (!inquilino) return null;

              return (
                <tr key={contrato.id}>
                  <td>
                    <div className={styles.infoContrato}>
                      <div className={styles.avatarContrato}>
                        {inquilino.nome
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
                  <td>
                    <div className={styles.infoImovel}>
                      <strong>{inquilino.imovel}</strong>
                      <span>{inquilino.endereco}</span>
                    </div>
                  </td>
                  <td>{contrato.inicio}</td>
                  <td>{contrato.fim}</td>
                  <td>{contrato.diasRestantes}</td>
                  <td>
                    <span
                      className={
                        contrato.status === "Ativo"
                          ? styles.statusAtivo
                          : contrato.status === "Vence em breve"
                            ? styles.statusVenceBreve
                            : contrato.status === "Renovação pendente"
                              ? styles.statusRenovacao
                              : styles.statusEncerrado
                      }
                    >
                      {contrato.status}
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
                            <Link to={`/inquilinos/${inquilino.id}`}>
                              Ver inquilino
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleEnviarAviso(contrato.id)}
                            >
                              Enviar aviso
                            </button>

                            {isAdmin && contrato.status !== "Encerrado" && (
                              <button
                                type="button"
                                className={styles.acaoPerigosa}
                                onClick={() => handleEncerrarContrato(contrato.id)}
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
                <td colSpan={8} className={styles.semResultados}>
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.rodapeTabela}>
          <span>
            Mostrando {contratosFiltrados.length} de {listaContratos.length} contratos
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
        mensagem={`Tem certeza que deseja encerrar o contrato #${contratoParaEncerrar}? Esta ação interromperá as cobranças e o status passará para Encerrado.`}
        textoConfirmar="Sim, encerrar"
      />
    </div>
  );
}