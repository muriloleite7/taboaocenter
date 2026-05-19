import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/cards";
import styles from "../style/inquilinos.module.css";
import api from "../services/api"; 
import { formatarMoeda, formatarData } from "../data/cobrancasMock";
import { usuarioLogadoMock } from "../data/usuarioLogadoMock";

interface Inquilino {
  id: number;
  nome: string;
  email?: string;
  cpf: string;
  telefone: string;
  contratos: {
    id: number;
    atraso: boolean;
    statusContrato?: string;
    // O contrato agora deve trazer os dados do imóvel vinculado
    imovel?: {
      titulo: string;
    };
    endereco: {
      rua: string;
      numero: string;
      cidade: string;
    };
    cobrancas: {
      valor_aluguel: number;
      data: string;
    }[];
  }[];
}

export default function Inquilinos() {
  const navigate = useNavigate();

  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<number | null>(null);

  const isAdmin = usuarioLogadoMock.cargo === "admin";

  useEffect(() => {
    fetchInquilinos();
  }, []);

  const fetchInquilinos = async () => {
    try {
      setLoading(true);
      // Lembre-se de ajustar o Controller para incluir o imovel: { select: { titulo: true } }
      const response = await api.get("/inquilinos/with-contratos"); 
      setInquilinos(response.data);
    } catch (error) {
      console.error("Erro ao buscar inquilinos:", error);
      alert("Erro ao carregar lista de inquilinos.");
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Filtros
  const inquilinosFiltrados = inquilinos.filter((inquilino) => {
    const contrato = inquilino.contratos?.[0];
    const statusTabela = contrato?.atraso ? "Pendência" : "Adimplente";

    const textoBusca = `
      ${inquilino.nome}
      ${inquilino.cpf}
      ${inquilino.telefone}
      ${contrato?.imovel?.titulo || ""}
      ${contrato?.endereco?.rua || ""}
    `.toLowerCase();

    const bateBusca = textoBusca.includes(busca.toLowerCase());
    const bateStatus = statusSelecionado === "Todos" || statusTabela === statusSelecionado;

    return bateBusca && bateStatus;
  });

  // Cálculos dos Cards
  const totalAtivos = inquilinos.length;
  const totalAdimplentes = inquilinos.filter(i => !i.contratos?.[0]?.atraso).length;
  const totalPendentes = inquilinos.filter(i => i.contratos?.[0]?.atraso).length;
  const totalEncerrados = inquilinos.filter(i => i.contratos?.[0]?.statusContrato === "Encerrado").length;

  const alternarMenu = (id: number) => {
    setMenuAberto((menuAtual) => (menuAtual === id ? null : id));
  };

  const handleArquivarInquilino = async (id: number, nome: string) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir ${nome}?`);
    if (!confirmar) return;

    try {
      await api.delete(`/inquilinos/delete/${id}`);
      alert("Inquilino removido!");
      fetchInquilinos();
    } catch (error) {
      alert("Erro ao excluir.");
    }
    setMenuAberto(null);
  };

  if (loading) return <div className={styles.inquilinos}>Carregando dados do CRM...</div>;

  return (
    <div className={styles.inquilinos}>
      <div className={styles.headerInquilinos}>
        <div>
          <h1 className={styles.tituloInquilinos}>Inquilinos</h1>
          <p className={styles.subtituloInquilinos}>Gestão de locatários e contratos ativos.</p>
        </div>
        <button onClick={() => navigate("/novo-inquilino")} className={styles.novoInquilino}>
          + Novo inquilino
        </button>
      </div>

      <div className={styles.cardsInquilinos}>
        <Card title="Inquilinos" value={totalAtivos} description="Total cadastrado" />
        <Card title="Adimplentes" value={totalAdimplentes} description="Pagamentos em dia" />
        <Card title="Pendências" value={totalPendentes} description="Atrasos detectados" />
        <Card title="Encerrados" value={totalEncerrados} description="Histórico" />
      </div>

      <div className={styles.filtrosInquilinos}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Buscar por nome, CPF, título ou rua..."
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
            <option>Pendência</option>
          </select>
        </div>
        <button className={styles.exportButton}>⇩ Exportar Lista</button>
      </div>

      <div className={styles.tabelaContainer}>
        <table className={styles.tabelaInquilinos}>
          <thead>
            <tr>
              <th>Nome / E-mail</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Imóvel / Endereço</th>
              <th>Valor Aluguel</th>
              <th>Próx. Vencimento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {inquilinosFiltrados.map((inquilino) => {
              const contrato = inquilino.contratos?.[0];
              const cobranca = contrato?.cobrancas?.[0];
              const statusTabela = contrato?.atraso ? "Pendência" : "Adimplente";

              return (
                <tr key={inquilino.id}>
                  <td>
                    <div className={styles.infoInquilino}>
                      <div className={styles.avatarInquilino}>
                        {inquilino.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong>{inquilino.nome}</strong>
                        <span>{inquilino.email || "---"}</span>
                      </div>
                    </div>
                  </td>
                  <td>{inquilino.cpf}</td>
                  <td>{inquilino.telefone}</td>
                  <td>
                    <div className={styles.infoImovel}>
                      {/* Exibindo o Título do Imóvel em vez do Tipo fixo */}
                      <strong>{contrato?.imovel?.titulo || "Sem contrato"}</strong>
                      <span>{contrato ? `${contrato.endereco.rua}, ${contrato.endereco.numero}` : "---"}</span>
                    </div>
                  </td>
                  <td>{formatarMoeda(Number(cobranca?.valor_aluguel || 0))}</td>
                  <td>{cobranca?.data ? formatarData(cobranca.data) : "---"}</td>
                  <td>
                    <span className={statusTabela === "Adimplente" ? styles.statusAdimplente : styles.statusPendente}>
                      {statusTabela}
                    </span>
                  </td>
                  <td>
                    <div className={styles.acoesTabela}>
                      <Link to={`/inquilinos/${inquilino.id}`} className={styles.botaoAcao}>👁</Link>
                      <Link to={`/inquilinos/${inquilino.id}/editar`} className={styles.botaoAcao}>✎</Link>
                      <div className={styles.menuWrapper}>
                        <button type="button" onClick={() => alternarMenu(inquilino.id)}>⋮</button>
                        {menuAberto === inquilino.id && (
                          <div className={styles.menuAcoes}>
                            <button type="button" onClick={() => navigate(`/financeiro/${inquilino.id}`)}>Ver extrato</button>
                            {isAdmin && (
                              <button 
                                type="button" 
                                className={styles.acaoPerigosa} 
                                onClick={() => handleArquivarInquilino(inquilino.id, inquilino.nome)}
                              >
                                Excluir Registro
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