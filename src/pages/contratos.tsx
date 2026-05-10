import { Link } from "react-router-dom";
import Card from "../components/cards";
import styles from "../style/contratos.module.css";

export default function Contratos() {
  const contratos = [
    {
      nome: "João Silva",
      email: "joao.silva@email.com",
      cpf: "123.456.789-00",
      imovel: "Apto 101",
      endereco: "Av. José Lopes de Oliveira",
      inicio: "10/05/2025",
      fim: "10/05/2026",
      diasRestantes: "12 dias",
      status: "Vence em breve",
    },
    {
      nome: "Maria Clara",
      email: "maria.clara@email.com",
      cpf: "987.654.321-00",
      imovel: "Casa 02",
      endereco: "Jd. São Paulo",
      inicio: "15/05/2025",
      fim: "15/05/2026",
      diasRestantes: "17 dias",
      status: "Ativo",
    },
    {
      nome: "Rafael Pereira",
      email: "rafael.pereira@email.com",
      cpf: "456.789.123-00",
      imovel: "Apto 203",
      endereco: "Rua das Flores",
      inicio: "01/04/2025",
      fim: "01/05/2026",
      diasRestantes: "Renovação",
      status: "Renovação pendente",
    },
    {
      nome: "Ana Souza",
      email: "ana.souza@email.com",
      cpf: "321.654.987-00",
      imovel: "Casa 05",
      endereco: "Jd. Roberto",
      inicio: "08/05/2024",
      fim: "08/05/2025",
      diasRestantes: "Encerrado",
      status: "Encerrado",
    },
  ];

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
        <Card title="Contratos ativos" value={468} description="Em andamento" />

        <Card
          title="Vencem em 30 dias"
          value={18}
          description="Precisam de atenção"
        />

        <Card
          title="Renovação pendente"
          value={7}
          description="Aguardando retorno"
        />

        <Card
          title="Encerrados"
          value={32}
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
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Status</label>

          <select className={styles.selectFilter}>
            <option>Todos</option>
            <option>Ativo</option>
            <option>Vence em breve</option>
            <option>Renovação pendente</option>
            <option>Encerrado</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Período</label>

          <select className={styles.selectFilter}>
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
            {contratos.map((contrato, index) => (
              <tr key={index}>
                <td>
                  <div className={styles.infoContrato}>
                    <div className={styles.avatarContrato}>
                      {contrato.nome
                        .split(" ")
                        .map((parteNome) => parteNome[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>
                      <strong>{contrato.nome}</strong>
                      <span>{contrato.email}</span>
                    </div>
                  </div>
                </td>

                <td>{contrato.cpf}</td>

                <td>
                  <div className={styles.infoImovel}>
                    <strong>{contrato.imovel}</strong>
                    <span>{contrato.endereco}</span>
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
                      to={`/contratos/${index + 1}`}
                      className={styles.botaoAcao}
                      title="Ver detalhes"
                    >
                      👁
                    </Link>
                    <Link to={`/contratos/${index + 1}/editar`} className={styles.botaoAcao} title="Editar contrato">
                      ✎
                    </Link>
                    {contrato.status !== "Encerrado" && (
                      <Link
                        to={`/contratos/${index + 1}/renovar`}
                        className={styles.botaoAcao}
                        title="Renovar contrato"
                      >
                        ↻
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.rodapeTabela}>
          <span>Mostrando 1 a 4 de 500 contratos</span>

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
