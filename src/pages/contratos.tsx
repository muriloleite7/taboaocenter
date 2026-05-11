import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/cards";
import styles from "../style/contratos.module.css";
import { contratosMock } from "../data/contratosMock";
import { getInquilinoById } from "../data/inquilinosMock";

export default function Contratos() {
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Todos");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<string | null>(null);

  const contratosFiltrados = contratosMock.filter((contrato) => {
    const inquilino = getInquilinoById(contrato.inquilinoId);

    if (!inquilino) return false;

    const textoBusca = `
      ${inquilino.nome}
      ${inquilino.email}
      ${inquilino.cpf}
      ${inquilino.imovel}
      ${inquilino.endereco}
      ${contrato.status}
      ${contrato.inicio}
      ${contrato.fim}
    `.toLowerCase();

    const bateBusca = textoBusca.includes(busca.toLowerCase());

    const bateStatus =
      statusSelecionado === "Todos" || contrato.status === statusSelecionado;

    const batePeriodo =
      periodoSelecionado === "Todos" ||
      (periodoSelecionado === "Próximos 30 dias" &&
        contrato.status === "Vence em breve") ||
      (periodoSelecionado === "Próximos 60 dias" &&
        contrato.status !== "Encerrado") ||
      (periodoSelecionado === "Este mês" &&
        contrato.status !== "Encerrado");

    return bateBusca && bateStatus && batePeriodo;
  });

  const totalAtivos = contratosMock.filter(
    (contrato) => contrato.status === "Ativo" || contrato.status === "Vence em breve"
  ).length;

  const totalVencemBreve = contratosMock.filter(
    (contrato) => contrato.status === "Vence em breve"
  ).length;

  const totalRenovacao = contratosMock.filter(
    (contrato) => contrato.status === "Renovação pendente"
  ).length;

  const totalEncerrados = contratosMock.filter(
    (contrato) => contrato.status === "Encerrado"
  ).length;

  const alternarMenu = (id: string) => {
    setMenuAberto((menuAtual) => (menuAtual === id ? null : id));
  };

  const handleEnviarAviso = (id: string) => {
    alert(`Aqui futuramente será enviado um aviso sobre o contrato ${id}.`);
    setMenuAberto(null);
  };

  const handleEncerrarContrato = (id: string) => {
    alert(`Aqui futuramente será possível encerrar o contrato ${id}.`);
    setMenuAberto(null);
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

        <button className={styles.novoContrato}>+ Novo contrato</button>
      </div>

      <div className={styles.cardsContratos}>
        <Card
          title="Contratos ativos"
          value={totalAtivos}
          description="Em andamento"
        />

        <Card
          title="Vencem em 30 dias"
          value={totalVencemBreve}
          description="Precisam de atenção"
        />

        <Card
          title="Renovação pendente"
          value={totalRenovacao}
          description="Aguardando retorno"
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

        <button className={styles.exportButton}>⇩ Exportar</button>
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
            {contratosFiltrados.map((contrato) => {
              const inquilino = getInquilinoById(contrato.inquilinoId);

              if (!inquilino) return null;

              return (
                <tr key={contrato.id}>
                  <td>
                    <div className={styles.infoContrato}>
                      <div className={styles.avatarContrato}>
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

                            {contrato.status !== "Encerrado" && (
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
                <td colSpan={8} className={styles.semResultados}>
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.rodapeTabela}>
          <span>
            Mostrando {contratosFiltrados.length} de {contratosMock.length}{" "}
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
    </div>
  );
}