import Card from '../components/cards';
import styles from '../inquilinos.module.css';

export default function Inquilinos() {
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

      <div className="pesquisarInquiilino"></div>

    </div>
  );
}