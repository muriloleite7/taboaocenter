import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/cards";
import styles from "../style/inquilinos.module.css";
import { inquilinosMock } from "../data/inquilinosMock";
import { formatarMoeda, formatarData } from "../data/cobrancasMock";
import { usuarioLogadoMock } from "../data/usuarioLogadoMock";

export default function Inquilinos() {
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Todos");
  const [tipoImovelSelecionado, setTipoImovelSelecionado] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<string | null>(null);

  const isAdmin = usuarioLogadoMock.cargo === "admin";

  const getTipoImovel = (imovel: string) => {
    if (imovel.toLowerCase().includes("casa")) return "Casa";
    if (imovel.toLowerCase().includes("apto")) return "Apartamento";
    return "Comercial";
  };

  const getStatusTabela = (statusPagamento: string) => {
    if (statusPagamento === "Adimplente") return "Adimplente";
    if (statusPagamento === "Pendente") return "Com pendência";
    if (statusPagamento === "Com pendência") return "Com pendência";
    if (statusPagamento === "Despesas pendentes") return "Com pendência";

    return statusPagamento;
  };

  const inquilinosFiltrados = inquilinosMock.filter((inquilino) => {
    const statusTabela = getStatusTabela(inquilino.statusPagamento);
    const tipoImovel = getTipoImovel(inquilino.imovel);

    const textoBusca = `
      ${inquilino.nome}
      ${inquilino.email}
      ${inquilino.cpf}
      ${inquilino.telefone}
      ${inquilino.imovel}
      ${inquilino.endereco}
      ${statusTabela}
    `.toLowerCase();

    const bateBusca = textoBusca.includes(busca.toLowerCase());

    const bateStatus =
      statusSelecionado === "Todos" || statusTabela === statusSelecionado;

    const bateTipo =
      tipoImovelSelecionado === "Todos" || tipoImovel === tipoImovelSelecionado;

    return bateBusca && bateStatus && bateTipo;
  });

  const totalAtivos = inquilinosMock.length;

  const totalAdimplentes = inquilinosMock.filter(
    (inquilino) => getStatusTabela(inquilino.statusPagamento) === "Adimplente"
  ).length;

  const totalPendentes = inquilinosMock.filter(
    (inquilino) => getStatusTabela(inquilino.statusPagamento) === "Com pendência"
  ).length;

  const totalEncerrados = inquilinosMock.filter(
    (inquilino) => inquilino.statusContrato === "Encerrado"
  ).length;

  const alternarMenu = (id: string) => {
    setMenuAberto((menuAtual) => (menuAtual === id ? null : id));
  };

  const handleVerCobrancas = (nome: string) => {
    alert(`Aqui futuramente abrirá as cobranças de ${nome}.`);
    setMenuAberto(null);
  };

  const handleEncerrarContrato = (nome: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja encerrar o contrato de ${nome}? Essa ação deve ser feita apenas por um administrador.`
    );

    if (!confirmar) return;

    alert(`Contrato de ${nome} encerrado com sucesso.`);
    setMenuAberto(null);
  };

  const handleArquivarInquilino = (nome: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja arquivar ${nome}? O histórico será mantido, mas o inquilino ficará inativo.`
    );

    if (!confirmar) return;

    alert(`${nome} foi arquivado com sucesso.`);
    setMenuAberto(null);
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
          description="Cadastrados no sistema"
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

        <button className={styles.exportButton}>⇩ Exportar</button>
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
              const statusTabela = getStatusTabela(inquilino.statusPagamento);

              return (
                <tr key={inquilino.id}>
                  <td>
                    <div className={styles.infoInquilino}>
                      <div className={styles.avatarInquilino}>
                        {inquilino.nome
                          .split(" ")
                          .map((parteNome) => parteNome[0])
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

                  <td>{formatarMoeda(Number(inquilino.aluguel))}</td>
                  <td>{formatarData(inquilino.vencimentoData)}</td>

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
                        className={styles.botaoAcao}
                        title="Ver detalhes"
                      >
                        👁
                      </Link>

                      <Link
                        to={`/inquilinos/${inquilino.id}/editar`}
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
                              onClick={() => handleVerCobrancas(inquilino.nome)}
                            >
                              Ver cobranças
                            </button>

                            {isAdmin && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEncerrarContrato(inquilino.nome)
                                  }
                                >
                                  Encerrar contrato
                                </button>

                                <button
                                  type="button"
                                  className={styles.acaoPerigosa}
                                  onClick={() =>
                                    handleArquivarInquilino(inquilino.nome)
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
            Mostrando {inquilinosFiltrados.length} de {inquilinosMock.length}{" "}
            inquilinos
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
    </div>
  );
}