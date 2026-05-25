import { Link, useNavigate } from "react-router-dom";
import Card from "../components/cards";
import styles from "../style/home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <div className={styles.headerHome}>
        <div>
          <h1 className={styles.tituloHome}>Olá, Murilo!</h1>
          <p className={styles.subtituloHome}>
            Veja o resumo da imobiliária hoje.
          </p>
        </div>

        <button
          onClick={() => navigate("/novo-inquilino")}
          className={styles.novoInquilino}
        >
          + Novo inquilino
        </button>
      </div>

      <section className={styles.sectionHome}>
        <h2 className={styles.tituloCards}>Resumo geral</h2>

        <div className={styles.cardsHome}>
          <Card
            title="Aluguéis atrasados"
            value={18}
            description="Precisam de cobrança"
          />

          <Card
            title="Vencem em 5 dias"
            value={42}
            description="Próximos vencimentos"
          />

          <Card
            title="Contratos para renovar"
            value={7}
            description="Renovação próxima"
          />

          <Card
            title="Inquilinos ativos"
            value={500}
            description="Cadastrados no sistema"
          />
        </div>
      </section>

      <section className={styles.sectionHome}>
        <h2 className={styles.tituloCards}>Ações rápidas</h2>

        <div className={styles.cardsHome}>
          <Link to="/lancar-despesas" className={styles.cardLink}>
            <Card
              title="Nova cobrança"
              value=""
              description="Lançar aluguel, água, luz ou IPTU"
            />
          </Link>

          <Link to="/inquilinos" className={styles.cardLink}>
            <Card
              title="Buscar inquilino"
              value=""
              description="Consultar por nome ou CPF"
            />
          </Link>

          <Link to="/contratos" className={styles.cardLink}>
            <Card
              title="Contratos"
              value=""
              description="Ver contratos próximos do vencimento"
            />
          </Link>

          <Link to="/configuracoes" className={styles.cardLink}>
            <Card
              title="Configurações"
              value=""
              description="Multa, juros e automações"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}