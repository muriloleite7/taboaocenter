import Card from "../components/cards";
import styles from "../home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.headerHome}>
        <div>
          <h1 className={styles.tituloHome}>Olá, Murilo!</h1>
          <p className={styles.subtituloHome}>Veja o resumo da imobiliária hoje.</p>
        </div>

        <button className={styles.novoInquilino}>+ Novo inquilino</button>
      </div>

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

      <h2 className={styles.tituloCards}>Ações rápidas</h2>

      <div className={styles.cardsHome}>

        <Card 
        title="Nova cobrança" 
        value="" 
        description="Lançar aluguel, água ou luz" 
        />

        <Card 
        title="Buscar inquilino" 
        value="" 
        description="Consultar por nome ou CPF" 
        />

        <Card 
        title="Contratos" 
        value="" 
        description="Ver contratos próximos do vencimento" 
        />

        <Card 
        title="Configurações" 
        value="" 
        description="Multa, juros e automações" 
        />

      </div>

    </div>
  );
}

