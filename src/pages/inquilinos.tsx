import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/cards";
import styles from "../style/inquilinos.module.css";
import api from "../services/api"; // Importe sua instância do axios
import { formatarMoeda, formatarData } from "../data/cobrancasMock";
import { usuarioLogadoMock } from "../data/usuarioLogadoMock";

// Definição da interface baseada no seu Prisma/Controller
interface Inquilino {
  id: number;
  nome: string;
  email?: string;
  cpf: string;
  telefone: string;
  imovel?: string;
  endereco?: string;
  aluguel?: number | string;
  vencimentoData?: string;
  statusPagamento?: string;
  statusContrato?: string;
}

export default function Inquilinos() {
  const navigate = useNavigate();

  // Estados para os dados da API
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros e UI
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Todos");
  const [tipoImovelSelecionado, setTipoImovelSelecionado] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<number | null>(null);

  const isAdmin = usuarioLogadoMock.cargo === "admin";

  // 1. Busca os dados do Backend ao carregar a página
  useEffect(() => {
    fetchInquilinos();
  }, []);

  const fetchInquilinos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/inquilinos/"); // Rota: inquilinoRoutes.get('/')
      setInquilinos(response.data);
    } catch (error) {
      console.error("Erro ao buscar inquilinos:", error);
      alert("Erro ao carregar lista de inquilinos.");
    } finally {
      setLoading(false);
    }
  };

  // Funções de tratamento de dados (mantidas do seu original)
  const getTipoImovel = (imovel: string = "") => {
    if (imovel.toLowerCase().includes("casa")) return "Casa";
    if (imovel.toLowerCase().includes("apto")) return "Apartamento";
    return "Comercial";
  };

  const getStatusTabela = (statusPagamento: string = "Adimplente") => {
    if (["Pendente", "Com pendência", "Despesas pendentes"].includes(statusPagamento)) {
      return "Com pendência";
    }
    return statusPagamento;
  };

  // 2. Lógica de Filtros aplicada sobre os dados da API
  const inquilinosFiltrados = inquilinos.filter((inquilino) => {
    const statusTabela = getStatusTabela(inquilino.statusPagamento);
    const tipoImovel = getTipoImovel(inquilino.imovel);

    const textoBusca = `
      ${inquilino.nome}
      ${inquilino.email || ""}
      ${inquilino.cpf}
      ${inquilino.telefone}
      ${inquilino.imovel || ""}
      ${statusTabela}
    `.toLowerCase();

    const bateBusca = textoBusca.includes(busca.toLowerCase());
    const bateStatus = statusSelecionado === "Todos" || statusTabela === statusSelecionado;
    const bateTipo = tipoImovelSelecionado === "Todos" || tipoImovel === tipoImovelSelecionado;

    return bateBusca && bateStatus && bateTipo;
  });

  // Cálculos dos Cards
  const totalAtivos = inquilinos.length;
  const totalAdimplentes = inquilinos.filter(i => getStatusTabela(i.statusPagamento) === "Adimplente").length;
  const totalPendentes = inquilinos.filter(i => getStatusTabela(i.statusPagamento) === "Com pendência").length;
  const totalEncerrados = inquilinos.filter(i => i.statusContrato === "Encerrado").length;

  const alternarMenu = (id: number) => {
    setMenuAberto((menuAtual) => (menuAtual === id ? null : id));
  };

  // 3. Integração com a função Delete do seu Controller
  const handleArquivarInquilino = async (id: number, nome: string) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir/arquivar ${nome}?`);
    if (!confirmar) return;

    try {
      await api.delete(`/inquilinos/delete/${id}`);
      alert("Inquilino removido com sucesso!");
      fetchInquilinos(); // Atualiza a lista
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir inquilino.");
    }
    setMenuAberto(null);
  };

  if (loading) return <div className={styles.inquilinos}>Carregando...</div>;

  return (
    <div className={styles.inquilinos}>
      <div className={styles.headerInquilinos}>
        <div>
          <h1 className={styles.tituloInquilinos}>Inquilinos</h1>
          <p className={styles.subtituloInquilinos}>Gerencie os inquilinos da imobiliária.</p>
        </div>
        <button onClick={() => navigate("/novo-inquilino")} className={styles.novoInquilino}>
          + Novo inquilino
        </button>
      </div>

      {/* Cards */}
      <div className={styles.cardsInquilinos}>
        <Card title="Inquilinos ativos" value={totalAtivos} description="No banco de dados" />
        <Card title="Adimplentes" value={totalAdimplentes} description="Sem pendências" />
        <Card title="Com pendências" value={totalPendentes} description="Precisam de atenção" />
        <Card title="Encerrados" value={totalEncerrados} description="Contratos finalizados" />
      </div>

      {/* Filtros */}
      <div className={styles.filtrosInquilinos}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Buscar por nome, CPF, telefone..."
            className={styles.searchInput}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Status</label>
          <select className={styles.selectFilter} value={statusSelecionado} onChange={(e) => setStatusSelecionado(e.target.value)}>
            <option>Todos</option>
            <option>Adimplente</option>
            <option>Com pendência</option>
            <option>Encerrado</option>
          </select>
        </div>
        <button className={styles.exportButton}>⇩ Exportar</button>
      </div>

      {/* Tabela */}
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
                        {inquilino.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong>{inquilino.nome}</strong>
                        <span>{inquilino.email || "Sem e-mail"}</span>
                      </div>
                    </div>
                  </td>
                  <td>{inquilino.cpf}</td>
                  <td>{inquilino.telefone}</td>
                  <td>
                    <div className={styles.infoImovel}>
                      <strong>{inquilino.imovel || "Não vinculado"}</strong>
                      <span>{inquilino.endereco || "---"}</span>
                    </div>
                  </td>
                  <td>{formatarMoeda(Number(inquilino.aluguel || 0))}</td>
                  <td>{inquilino.vencimentoData ? formatarData(inquilino.vencimentoData) : "---"}</td>
                  <td>
                    <span className={statusTabela === "Adimplente" ? styles.statusAdimplente : styles.statusPendente}>
                      {statusTabela}
                    </span>
                  </td>
                  <td>
                    <div className={styles.acoesTabela}>
                      <Link to={`/inquilinos/${inquilino.id}`} className={styles.botaoAcao} title="Ver detalhes">👁</Link>
                      <Link to={`/inquilinos/${inquilino.id}/editar`} className={styles.botaoAcao} title="Editar">✎</Link>
                      <div className={styles.menuWrapper}>
                        <button type="button" onClick={() => alternarMenu(inquilino.id)}>⋮</button>
                        {menuAberto === inquilino.id && (
                          <div className={styles.menuAcoes}>
                            <button type="button" onClick={() => alert("Cobrancas em breve")}>Ver cobranças</button>
                            {isAdmin && (
                              <button 
                                type="button" 
                                className={styles.acaoPerigosa} 
                                onClick={() => handleArquivarInquilino(inquilino.id, inquilino.nome)}
                              >
                                Excluir Inquilino
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
          </tbody>
        </table>
      </div>
    </div>
  );
}