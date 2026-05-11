import { useState } from "react";
import Card from "../components/cards";
import styles from "../style/cobrancas.module.css";
import { Link } from "react-router-dom";
import { getInquilinoById } from "../data/inquilinosMock";
import {
  calcularMultaAutomatica,
  calcularSubtotal,
  cobrancasMock,
  formatarData,
  formatarMoeda,
} from "../data/cobrancasMock";

export default function Cobrancas() {
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Todos");
  const [referenciaSelecionada, setReferenciaSelecionada] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<string | null>(null);

  const cobrancasFiltradas = cobrancasMock.filter((cobranca) => {
    const inquilino = getInquilinoById(cobranca.inquilinoId);

    if (!inquilino) return false;

    const textoBusca = `
      ${inquilino.nome}
      ${inquilino.email}
      ${inquilino.cpf}
      ${inquilino.imovel}
      ${cobranca.referencia}
      ${cobranca.status}
    `.toLowerCase();

    const bateBusca = textoBusca.includes(busca.toLowerCase());

    const bateStatus =
      statusSelecionado === "Todos" || cobranca.status === statusSelecionado;

    const bateReferencia =
      referenciaSelecionada === "Todos" ||
      cobranca.referencia === referenciaSelecionada;

    return bateBusca && bateStatus && bateReferencia;
  });

  const totalPendentes = cobrancasMock.filter(
    (cobranca) => cobranca.status === "Pendente"
  ).length;

  const totalAtrasadas = cobrancasMock.filter(
    (cobranca) => cobranca.status === "Atrasada"
  ).length;

  const totalDespesasPendentes = cobrancasMock.filter(
    (cobranca) => cobranca.status === "Despesas pendentes"
  ).length;

  const alternarMenu = (id: string) => {
    setMenuAberto((menuAtual) => (menuAtual === id ? null : id));
  };

  const handleReenviarCobranca = (nome: string) => {
    alert(`Aqui futuramente será reenviada a cobrança para ${nome} no WhatsApp.`);
    setMenuAberto(null);
  };

  const handleRegistrarManual = (id: string) => {
    alert(
      `Aqui futuramente abrirá o registro de pagamento manual da cobrança ${id}.`
    );
    setMenuAberto(null);
  };

  const handleCancelarCobranca = (id: string) => {
    alert(`Aqui futuramente será possível cancelar a cobrança ${id}.`);
    setMenuAberto(null);
  };

  return (
    <div className={styles.cobrancas}>
      <div className={styles.headerCobrancas}>
        <div>
          <h1 className={styles.tituloCobrancas}>Cobranças</h1>
          <p className={styles.subtituloCobrancas}>
            Controle os aluguéis, vencimentos e despesas dos inquilinos.
          </p>
        </div>

        <Link to="/lancar-despesas" className={styles.lancarDespesa}>
          + Lançar despesas
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
          value={42}
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
            <option>Maio/2026</option>
            <option>Abril/2026</option>
            <option>Março/2026</option>
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
            {cobrancasFiltradas.map((cobranca) => {
              const inquilino = getInquilinoById(cobranca.inquilinoId);
              const subtotal = calcularSubtotal(cobranca);
              const multa = calcularMultaAutomatica(cobranca.status, subtotal);
              const total = subtotal + multa;

              if (!inquilino) return null;

              return (
                <tr key={cobranca.id}>
                  <td>
                    <div className={styles.infoCobranca}>
                      <div className={styles.avatarCobranca}>
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
                  <td>{cobranca.referencia}</td>
                  <td>{formatarMoeda(Number(cobranca.aluguel))}</td>

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
                      {cobranca.status === "Despesas pendentes"
                        ? "Aguardando despesas"
                        : formatarMoeda(total)}
                    </span>
                  </td>

                  <td>{formatarData(cobranca.vencimento)}</td>

                  <td>
                    <span
                      className={
                        cobranca.status === "Paga"
                          ? styles.statusPago
                          : cobranca.status === "Atrasada"
                          ? styles.statusAtrasado
                          : cobranca.status === "Despesas pendentes"
                          ? styles.statusDespesas
                          : styles.statusPendente
                      }
                    >
                      <span className={styles.statusText}>
                        {cobranca.status}
                      </span>
                    </span>
                  </td>

                  <td>
                    <div className={styles.acoesTabela}>
                      <Link
                        to={`/inquilinos/${inquilino.id}`}
                        className={styles.botaoAcao}
                        title="Ver detalhes do inquilino"
                      >
                        👁
                      </Link>

                      <Link
                        to={`/cobrancas/${cobranca.id}/editar`}
                        className={styles.botaoAcao}
                        title="Editar valores"
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
                                handleReenviarCobranca(inquilino.nome)
                              }
                            >
                              Reenviar WhatsApp
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleRegistrarManual(cobranca.id)
                              }
                            >
                              Registrar pagamento manual
                            </button>

                            <button
                              type="button"
                              className={styles.acaoPerigosa}
                              onClick={() => handleCancelarCobranca(cobranca.id)}
                            >
                              Cancelar cobrança
                            </button>
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
            Mostrando {cobrancasFiltradas.length} de {cobrancasMock.length}{" "}
            cobranças
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