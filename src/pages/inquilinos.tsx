import Card from '../components/cards';
import styles from '../inquilinos.module.css';

export default function Inquilinos() {
  const inquilinos = [
    {
      nome: "João Silva",
      email: "joao.silva@email.com",
      cpf: "123.456.789-00",
      telefone: "(11) 98765-4321",
      imovel: "Apto 101",
      endereco: "Av José Lopes de Oliveira",
      aluguel: "R$ 1.500,00",
      vencimento: "10/05/2026",
      status: "Adimplente",
    },
    {
      nome: "Maria Clara",
      email: "maria.clara@email.com",
      cpf: "987.654.321-00",
      telefone: "(11) 97654-3210",
      imovel: "Casa 02",
      endereco: "Jd. São Paulo",
      aluguel: "R$ 1.800,00",
      vencimento: "15/05/2026",
      status: "Com pendência",
    },
    {
      nome: "Rafael Pereira",
      email: "rafael.pereira@email.com",
      cpf: "456.789.123-00",
      telefone: "(11) 99876-5432",
      imovel: "Apto 203",
      endereco: "Rua das Flores",
      aluguel: "R$ 1.600,00",
      vencimento: "10/05/2026",
      status: "Adimplente",
    },
    {
      nome: "Ana Souza",
      email: "ana.souza@email.com",
      cpf: "321.654.987-00",
      telefone: "(11) 96987-6543",
      imovel: "Casa 05",
      endereco: "Jd. Roberto",
      aluguel: "R$ 1.700,00",
      vencimento: "08/05/2026",
      status: "Com pendência",
    },
  ];

  return (
    <div className={styles.inquilinos}>

      <div className={styles.headerInquilinos}>
        <div>
          <h1 className={styles.tituloInquilinos}>Inquilinos</h1>
          <p className={styles.subtituloInquilinos}>Gerencie os inquilinos da imobiliária.</p>
        </div>

        <button className={styles.novoInquilino}>+ Novo inquilino</button>
      </div>

      <div className={styles.cardsInquilinos}>
        <Card
          title="Inquilinos ativos"
          value={500}
          description="Cadastrados no sistema"
        />

        <Card
          title="Adimplentes"
          value={412}
          description="82,4%"
        />

        <Card
          title="Com pendências"
          value={88}
          description="17,6%"
        />

        <Card
          title="Encerrados"
          value={32}
          description="Contratos finalizados"
        />
      </div>

      <div className={styles.filtrosInquilinos}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Buscar por nome, CPF ou telefone..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Status</label>

          <select className={styles.selectFilter}>
            <option>Todos</option>
            <option>Adimplente</option>
            <option>Com pendência</option>
            <option>Encerrado</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Tipo de imóvel</label>

          <select className={styles.selectFilter}>
            <option>Todos</option>
            <option>Casa</option>
            <option>Apartamento</option>
            <option>Comercial</option>
          </select>
        </div>

        <button className={styles.exportButton}>
          ⇩ Exportar
        </button>
      </div>

      <div className={styles.tabelaContainer}>
        <table className={styles.tabelaInquilinos}>
          <thead> {/* = Cabeçalho da tabela, onde os títulos das colunas são definidos */}
            <tr> {/* = Linha do cabeçalho, onde cada título de coluna é definido */}
              <th>Nome</th> {/* = Título da coluna "Nome", onde o nome do inquilino será exibido */}
              <th>CPF</th>
              <th>Telefone</th>
              <th>Imóvel</th>
              <th>Aluguel</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody> {/* = Corpo da tabela, onde os dados dos inquilinos são renderizados dinamicamente */}
            {inquilinos.map((inquilino, index) => (
              <tr key={index}>
                <td>  {/* = Célula da tabela onde as informações do inquilino são exibidas, incluindo avatar, nome e email */}
                  <div className={styles.infoInquilino}>
                    <div className={styles.avatarInquilino}> {/* = Avatar do inquilino, onde as iniciais do nome são exibidas */}
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

                <td>{inquilino.aluguel}</td>
                <td>{inquilino.vencimento}</td>

                <td>
                  <span
                    className={
                      inquilino.status === "Adimplente"
                        ? styles.statusAdimplente
                        : styles.statusPendente
                    }
                  >
                    {inquilino.status}
                  </span>
                </td>

                <td>
                  <div className={styles.acoesTabela}>
                    <button title="Ver detalhes">👁</button>
                    <button title="Editar">✎</button>
                    <button title="Mais opções">⋮</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.rodapeTabela}>
          <span>Mostrando 1 a 4 de 500 inquilinos</span>

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