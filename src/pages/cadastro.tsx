import { useState } from 'react';
import styles from '../style/auth.module.css';
import { useNavigate } from 'react-router-dom';

export default function Cadastro({ aoMudarTela }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', cargo: 'Consultor' });

  const navigate = useNavigate();

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.logoArea}>
          <h2>TABOÃO CENTER</h2>
        </div>

        <h1 className={styles.titulo}>Criar conta</h1>
        <p className={styles.subtitulo}>Cadastre um novo colaborador no sistema.</p>

        <form>
          <div className={styles.formGroup}>
            <label>Nome completo</label>
            <input type="text" className={styles.inputField} placeholder="Nome do colaborador" />
          </div>

          <div className={styles.formGroup}>
            <label>E-mail corporativo</label>
            <input type="email" className={styles.inputField} placeholder="exemplo@taboao.com" />
          </div>

          <div className={styles.formGroup}>
            <label>Cargo / Função</label>
            <select className={styles.inputField}>
              <option>Administrador</option>
              <option>Consultor</option>
              <option>Financeiro</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Senha de acesso</label>
            <input type="password" className={styles.inputField} placeholder="Mínimo 8 caracteres" />
          </div>

          <button type="submit" className={styles.btnAcesso}>Finalizar cadastro</button>
        </form>

        <p className={styles.footerLink}>
          Já possui conta? <span className={styles.linkDestaque} onClick={() => navigate("/login")}>Fazer login</span>
        </p>
        </div>
    </div>
  );
}