import { useState, useEffect } from "react";
import Card from "../components/cards";
import styles from "../style/cobrancas.module.css";
import { Link } from "react-router-dom";

// Mantendo os utilitários de formatação de string se existirem locais, ou usando nativos
const formatarMoeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatarData = (dataString: string) => {
  if (!dataString) return "—";
  return new Date(dataString).toLocaleDateString("pt-BR");
};

export default function Cobrancas() {
  const [listaCobrancas, setListaCobrancas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Todos");
  const [referenciaSelecionada, setReferenciaSelecionada] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<number | null>(null);

  // Idealmente, busque estes dados do seu contexto de autenticação global (AuthContext)
  const isAdmin = true;

  // 🔄 1. Buscar cobranças direto da API Real
  const buscarCobrancasApi = async () => {
    try {
      setCarregando(true);
      const resposta = await fetch("http://localhost:8081/cobrancas");
      const dados = await resposta.json(); // ✅ Corrigido para 'resposta'
      setListaCobrancas(dados);
    } catch (error) {
      console.error("Erro ao buscar cobranças da API:", error);
      alert("Não foi possível carregar as cobranças do servidor.");
    } finally {
      setCarregando(false);
    }
  };
  useEffect(() => {
    buscarCobrancasApi();
  }, []);

  // 🧮 2. Lógicas de Cálculo baseadas no Schema Real
  const obterStatusTexto = (cobranca: any) => {
    if (cobranca.paga) return "Paga";

    const hoje = new Date();
    const dataVencimento = new Date(cobranca.data);

    if (dataVencimento < hoje) return "Atrasada";
    return "Pendente";
  };

  const calcularSubtotalReal = (cobranca: any) => {
    return (
      Number(cobranca.valor_aluguel || 0) +
      Number(cobranca.valor_iptu || 0) +
      Number(cobranca.valor_luz || 0) +
      Number(cobranca.valor_agua || 0)
    );
  };

  const calcularMultaReal = (cobranca: any) => {
    // Se a cobrança está atrasada, calcula multa se o seu negócio exigir (ex: 10%)
    if (obterStatusTexto(cobranca) === "Atrasada") {
      return Number(cobranca.valor_multa || 0) || calcularSubtotalReal(cobranca) * 0.1;
    }
    return Number(cobranca.valor_multa || 0);
  };

  const extrairMesAnoReferencia = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString("pt-BR", { month: "long", year: "numeric" });
  };

  // 🔍 3. Sistema de Filtros Adaptado
  const cobrancasFiltradas = listaCobrancas.filter((cobranca: any) => {
    const contrato = cobranca.contrato;
    const inquilino = contrato?.inquilino;
    const statusText = obterStatusTexto(cobranca);
    const referenciaText = extrairMesAnoReferencia(cobranca.data);

    // Se a cobrança for avulsa (sem contrato), protege o código de quebrar
    const nomeInquilino = inquilino?.nome || "Cobrança Avulsa";
    const cpfInquilino = inquilino?.cpf || "";
    const emailInquilino = inquilino?.email || "";

    const textoBusca = `
      ${nomeInquilino}
      ${emailInquilino}
      ${cpfInquilino}
      ${referenciaText}
      ${statusText}
    `.toLowerCase();

    const bateBusca = textoBusca.includes(busca.toLowerCase());
    const bateStatus = statusSelecionado === "Todos" || statusText === statusSelecionado;
    const bateReferencia = referenciaSelecionada === "Todos" || referenciaText.toLowerCase() === referenciaSelecionada.toLowerCase();

    return bateBusca && bateStatus && bateReferencia;
  });

  // 📊 4. Contadores dos Cards Superiores
  const totalPendentes = listaCobrancas.filter((c) => obterStatusTexto(c) === "Pendente").length;
  const totalAtrasadas = listaCobrancas.filter((c) => obterStatusTexto(c) === "Atrasada").length;

  const alternarMenu = (id: number) => {
    setMenuAberto((menuAtual) => (menuAtual === id ? null : id));
  };

  const handleReenviarCobranca = (nome: string) => {
    alert(`Redirecionando para envio de cobrança para ${nome} no WhatsApp.`);
    setMenuAberto(null);
  };

  // 🗑️ 5. Deletar cobrança via API
  const handleCancelarCobranca = async (id: number) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja deletar permanentemente a cobrança ID ${id}?`
    );

    if (!confirmar) return;

    try {
      const resposta = await fetch(`http://localhost:3000/cobrancas/${id}`, {
        method: "DELETE",
      });

      if (resposta.ok) {
        alert("Cobrança excluída com sucesso.");
        buscarCobrancasApi(); // Recarrega a lista atualizada do servidor
      } else {
        alert("Erro ao excluir cobrança.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro na conexão ao tentar excluir.");
    } finally {
      setMenuAberto(null);
    }
  };

  if (carregando) {
    return <div className={styles.cobrancas}><h3>Carregando cobranças do sistema...</h3></div>;
  }

  return (
    <div className={styles.cobrancas}>
      <div className={styles.headerCobrancas}>
        <div>
          <h1 className={styles.tituloCobrancas}>Cobranças</h1>
          <p className={styles.subtituloCobrancas}>
            Controle os aluguéis, vencimentos e despesas direto do banco de dados.
          </p>
        </div>

        <Link to="/lancar-despesas" className={styles.lancarDespesa}>
          + Lançar despesas
        </Link>
      </div>

      <div className={styles.cardsCobrancas}>
        <Card title="Cobranças pendentes" value={totalPendentes} description="Aguardando pagamento" />
        <Card title="Vencem em breve" value={listaCobrancas.filter(c => !c.paga).length} description="Contas em aberto" />
        <Card title="Atrasadas" value={totalAtrasadas} description="Com juros/multa ativos" />
        <Card title="Total Registrado" value={listaCobrancas.length} description="Histórico de faturamento" />
      </div>

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
            <option>Maio de 2026</option>
            <option>Abril de 2026</option>
            <option>Março de 2026</option>
          </select>
        </div>

        <button className={styles.exportButton}>⇩ Exportar</button>
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
              const contrato = cobranca.contrato;
              const inquilino = contrato?.inquilino;

              const subtotal = calcularSubtotalReal(cobranca);
              const multa = calcularMultaReal(cobranca);
              const total = subtotal + multa;
              const statusText = obterStatusTexto(cobranca);

              const nomeInquilino = inquilino?.nome || "Cobrança Avulsa";
              const emailInquilino = inquilino?.email || "sem-email@taboaocenter.com";

              return (
                <tr key={cobranca.id}>
                  <td>
                    <div className={styles.infoCobranca}>
                      <div className={styles.avatarCobranca}>
                        {nomeInquilino.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <strong>{nomeInquilino}</strong>
                        <span>{emailInquilino}</span>
                      </div>
                    </div>
                  </td>

                  <td>{inquilino?.cpf || "—"}</td>
                  <td>{extrairMesAnoReferencia(cobranca.data)}</td>
                  <td>{formatarMoeda(Number(cobranca.valor_aluguel || 0))}</td>
                  <td>{cobranca.valor_agua ? formatarMoeda(Number(cobranca.valor_agua)) : "—"}</td>
                  <td>{cobranca.valor_luz ? formatarMoeda(Number(cobranca.valor_luz)) : "—"}</td>
                  <td>{cobranca.valor_iptu ? formatarMoeda(Number(cobranca.valor_iptu)) : "—"}</td>
                  <td>{multa ? formatarMoeda(multa) : "—"}</td>
                  <td><span className={styles.valorTotal}>{formatarMoeda(total)}</span></td>
                  <td>{formatarData(cobranca.data)}</td>

                  <td>
                    <span className={
                      statusText === "Paga" ? styles.statusPago :
                        statusText === "Atrasada" ? styles.statusAtrasado : styles.statusPendente
                    }>
                      <span className={styles.statusText}>{statusText}</span>
                    </span>
                  </td>

                  <td>
                    <div className={styles.acoesTabela}>
                      {inquilino && (
                        <Link to={`/inquilinos/${inquilino.id}`} className={styles.botaoAcao} title="Ver detalhes">
                          👁
                        </Link>
                      )}

                      <Link to={`/cobrancas/${cobranca.id}/editar`} className={styles.botaoAcao} title="Editar">
                        ✎
                      </Link>

                      <div className={styles.menuWrapper}>
                        <button type="button" title="Mais opções" onClick={() => alternarMenu(cobranca.id)}>
                          ⋮
                        </button>

                        {menuAberto === cobranca.id && (
                          <div className={styles.menuAcoes}>
                            <button type="button" onClick={() => handleReenviarCobranca(nomeInquilino)}>
                              Reenviar WhatsApp
                            </button>

                            <Link to={`/cobrancas/${cobranca.id}/editar`} onClick={() => setMenuAberto(null)}>
                              Registrar pagamento manual
                            </Link>

                            {isAdmin && (
                              <button
                                type="button"
                                className={styles.acaoPerigosa}
                                onClick={() => handleCancelarCobranca(cobranca.id)}
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
                  Nenhuma cobrança encontrada para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}