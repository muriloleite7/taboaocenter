import styles from "../style/detalheInquilino.module.css"; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
}

export default function ModalConfirmacao({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensagem,
  textoConfirmar = "Confirmar"
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{titulo}</h3>
        <p>{mensagem}</p>
        
        <div className={styles.modalAcoes}>
          <button onClick={onClose} className={styles.btnCancelar}>
            Voltar
          </button>
          <button onClick={onConfirm} className={styles.btnConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}