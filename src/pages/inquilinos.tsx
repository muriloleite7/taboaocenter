import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/cards";
import styles from "../style/inquilinos.module.css";
import { inquilinosMock } from "../data/inquilinosMock";
import { formatarMoeda } from "../data/cobrancasMock";
import { usuarioLogadoMock } from "../data/usuarioLogadoMock";
import { exportarParaCSV } from "../utils/exportarCSV";

const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";

export default function Inquilinos() {
  const navigate = useNavigate();

  const [listaInquilinos, setListaInquilinos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Todos");
  const [tipoImovelSelecionado, setTipoImovelSelecionado] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<string | null>(null);

  const isAdmin = usuarioLogadoMock.cargo === "admin";

  useEffect(() => {
    const salvos = localStorage.getItem(INQUILINOS_STORAGE_KEY);

    if (salvos) {
      setListaInquilinos(JSON.parse(salvos));
    } else {
      setListaInquilinos(inquilinosMock);
      localStorage.setItem(
        INQUILINOS_STORAGE_KEY,
        JSON.stringify(inquilinosMock)
      );
    }
  }, []);

  const salvarInquilinos = (novaLista: any[]) => {
    setListaInquilinos(novaLista);
    localStorage.setItem(INQUILINOS_STORAGE_KEY, JSON.stringify(novaLista));
  };

  const getTipoImovel = (imovel: string) => {
    const texto = imovel?.toLowerCase() || "";

    if (texto.includes("casa")) return "Casa";
    if (texto.includes("apto") || texto.includes("apartamento")) {
      return "Apartamento";
    }

    return "Comercial";
  };

  const getStatusTabela = (inquilino: any) => {
    if (inquilino.statusContrato === "Encerrado") return "Encerrado";

    if (inquilino.statusPagamento === "Adimplente") return "Adimplente";

    if (
      inquilino.statusPagamento === "Pendente" ||
      inquilino.statusPagamento === "Com pendência" ||
      inquilino.statusPagamento === "Despesas pendentes"
    ) {
      return "Com pendência";
    }

    return inquilino.statusPagamento || "Adimplente";
  };

  const formatarVencimentoInquilino = (inquilino: any) => {
    const diaVencimento = inquilino.diaVencimento || inquilino.vencimento;

    if (diaVencimento) {
      return `Dia ${diaVencimento}`;
    }

    if (!inquilino.vencimentoData) {
      return "—";
    }

    const data = new Date(inquilino.vencimentoData);

    if (Number.isNaN(data.getTime())) {
      return inquilino.vencimentoData;
    }

    return data.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  const inquilinosFiltrados = listaInquilinos.filter((inquilino) => {
    const statusTabela = getStatusTabela(inquilino);
    const tipoImovel = getTipoImovel(inquilino.imovel);

    const textoBusca = `
      ${inquilino.nome || ""}
      ${inquilino.email || ""}
      ${inquilino.cpf || ""}
      ${inquilino.telefone || ""}
      ${inquilino.imovel || ""}
      ${inquilino.endereco || ""}
      ${statusTabela}
    `.toLowerCase();

    const bateBusca = textoBusca.includes(busca.toLowerCase());

    const bateStatus =
      statusSelecionado === "Todos" || statusTabela === statusSelecionado;

    const bateTipo =
      tipoImovelSelecionado === "Todos" || tipoImovel === tipoImovelSelecionado;

    return bateBusca && bateStatus && bateTipo;
  });

  const handleExportar = () => {
    const dadosParaExportar = inquilinosFiltrados.map((inquilino) => ({
      nome: inquilino.nome || "",
      email: inquilino.email || "",
      cpf: inquilino.cpf || "",
      telefone: inquilino.telefone || "",
      imovel: inquilino.imovel || "",
      endereco: inquilino.endereco || "",
      aluguel: inquilino.aluguel || 0,
      vencimento: formatarVencimentoInquilino(inquilino),
      diaVencimento: inquilino.diaVencimento || inquilino.vencimento || "",
      statusPagamento: getStatusTabela(inquilino),
      statusContrato: inquilino.statusContrato || "Ativo",
    }));

    const colunas = [
      { chave: "nome", label: "Nome" },
      { chave: "email", label: "E-mail" },
      { chave: "cpf", label: "CPF" },
      { chave: "telefone", label: "Telefone" },
      { chave: "imovel", label: "Imóvel" },
      { chave: "endereco", label: "Endereço" },
      { chave: "aluguel", label: "Valor Aluguel" },
      { chave: "vencimento", label: "Vencimento" },
      { chave: "diaVencimento", label: "Dia Vencimento" },
      { chave: "statusPagamento", label: "Status Pagamento" },
      { chave: "statusContrato", label: "Status Contrato" },
    ];

    exportarParaCSV(dadosParaExportar, colunas, "relatorio_inquilinos");
  };

  const totalAtivos = listaInquilinos.filter(
    (inquilino) => inquilino.statusContrato !== "Encerrado"
  ).length;

  const totalAdimplentes = listaInquilinos.filter(
    (inquilino) => getStatusTabela(inquilino) === "Adimplente"
  ).length;

  const totalPendentes = listaInquilinos.filter(
    (inquilino) => getStatusTabela(inquilino) === "Com pendência"
  ).length;

  const totalEncerrados = listaInquilinos.filter(
    (inquilino) => inquilino.statusContrato === "Encerrado"
  ).length;

  const alternarMenu = (id: string) => {
    setMenuAberto((menuAtual) => (menuAtual === id ? null : id));
  };

  const handleVerCobrancas = (id: string) => {
    navigate("/cobrancas", {
      state: {
        inquilinoId: id,
      },
    });

    setMenuAberto(null);
  };

  const handleEncerrarContrato = (id: string, nome: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja encerrar o contrato de ${nome}?`
    );

    if (!confirmar) return;

    const novaLista = listaInquilinos.map((inquilino) => {
      if (String(inquilino.id) !== String(id)) {
        return inquilino;
      }

      return {
        ...inquilino,
        statusContrato: "Encerrado",
        statusPagamento: "Adimplente",
        dataEncerramento: new Date().toISOString(),
      };
    });

    salvarInquilinos(novaLista);
    setMenuAberto(null);

    alert(`Contrato de ${nome} encerrado com sucesso.`);
  };

  const handleArquivarInquilino = (id: string, nome: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja arquivar ${nome}? O histórico será mantido.`
    );

    if (!confirmar) return;

    const novaLista = listaInquilinos.map((inquilino) => {
      if (String(inquilino.id) !== String(id)) {
        return inquilino;
      }

      return {
        ...inquilino,
        arquivado: true,
        statusContrato: "Encerrado",
        statusPagamento: "Adimplente",
        dataArquivamento: new Date().toISOString(),
      };
    });

    salvarInquilinos(novaLista);
    setMenuAberto(null);

    alert(`${nome} foi arquivado com sucesso.`);
  };

  return (
    <div className={styles.inquilinos}>
      <div className={styles.headerInquilinos}>
        <div>
          <h1 className={styles.tituloInquilinos}>Inquilinos</h1>

          <p className={styles.subtituloInquilinos}>
            Gerencie os inquilinos da imobiliária.
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

      <div className={styles.cardsInquilinos}>
        <Card
          title="Inquilinos ativos"
          value={totalAtivos}
          description="Com contrato em andamento"
        />

        <Card
          title="Adimplentes"
          value={totalAdimplentes}
          description="Sem pendências"
        />

        <Card
          title="Com pendências"
          value={totalPendentes}
          description="Precisam de atenção"
        />

        <Card
          title="Encerrados"
          value={totalEncerrados}
          description="Contratos finalizados"
        />
      </div>

      <div className={styles.filtrosInquilinos}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Buscar por nome, CPF, telefone ou imóvel..."
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
            <option>Adimplente</option>
            <option>Com pendência</option>
            <option>Encerrado</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Tipo de imóvel</label>

          <select
            className={styles.selectFilter}
            value={tipoImovelSelecionado}
            onChange={(e) => setTipoImovelSelecionado(e.target.value)}
          >
            <option>Todos</option>
            <option>Casa</option>
            <option>Apartamento</option>
            <option>Comercial</option>
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
        <table className={styles.tabelaInquilinos}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Imóvel</th>
              <th>Aluguel</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {inquilinosFiltrados.map((inquilino) => {
              const statusTabela = getStatusTabela(inquilino);

              return (
                <tr key={inquilino.id}>
                  <td>
                    <div className={styles.infoInquilino}>
                      <div className={styles.avatarInquilino}>
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
                  <td>{inquilino.telefone}</td>

                  <td>
                    <div className={styles.infoImovel}>
                      <strong>{inquilino.imovel}</strong>
                      <span>{inquilino.endereco}</span>
                    </div>
                  </td>

                  <td>{formatarMoeda(Number(inquilino.aluguel || 0))}</td>
                  <td>{formatarVencimentoInquilino(inquilino)}</td>

                  <td>
                    <span
                      className={
                        statusTabela === "Adimplente"
                          ? styles.statusAdimplente
                          : styles.statusPendente
                      }
                    >
                      {statusTabela}
                    </span>
                  </td>

                  <td>
                    <div className={styles.acoesTabela}>
                      <Link
                        to={`/inquilinos/${inquilino.id}`}
                        state={{
                          voltarPara: "/inquilinos",
                          textoVoltar: "← Voltar para inquilinos",
                        }}
                        className={styles.botaoAcao}
                        title="Ver detalhes"
                      >
                        👁
                      </Link>

                      <Link
                        to={`/inquilinos/${inquilino.id}/editar`}
                        state={{
                          voltarPara: "/inquilinos",
                          textoVoltar: "← Voltar para inquilinos",
                        }}
                        className={styles.botaoAcao}
                        title="Editar"
                      >
                        ✎
                      </Link>

                      <div className={styles.menuWrapper}>
                        <button
                          type="button"
                          title="Mais opções"
                          onClick={() => alternarMenu(inquilino.id)}
                        >
                          ⋮
                        </button>

                        {menuAberto === inquilino.id && (
                          <div className={styles.menuAcoes}>
                            <button
                              type="button"
                              onClick={() => handleVerCobrancas(inquilino.id)}
                            >
                              Ver cobranças
                            </button>

                            {isAdmin && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEncerrarContrato(
                                      inquilino.id,
                                      inquilino.nome
                                    )
                                  }
                                >
                                  Encerrar contrato
                                </button>

                                <button
                                  type="button"
                                  className={styles.acaoPerigosa}
                                  onClick={() =>
                                    handleArquivarInquilino(
                                      inquilino.id,
                                      inquilino.nome
                                    )
                                  }
                                >
                                  Arquivar inquilino
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}

            {inquilinosFiltrados.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.semResultados}>
                  Nenhum inquilino encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.rodapeTabela}>
          <span>
            Mostrando {inquilinosFiltrados.length} de {listaInquilinos.length}{" "}
            inquilinos
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