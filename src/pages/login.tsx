import { useState } from 'react';
import styles from '../style/auth.module.css';
import { useNavigate } from 'react-router-dom';

export default function Login({ aoMudarTela }) {
  const [dados, setDados] = useState({ email: '', senha: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tentativa de login:", dados);
  };

  const navigate = useNavigate();

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.logoArea}>
          <h2>TABOÃO CENTER</h2>
        </div>
        
        <h1 className={styles.titulo}>Bem-vindo de volta</h1>
        <p className={styles.subtitulo}>Acesse sua conta para gerenciar os imóveis.</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>E-mail corporativo</label>
            <input 
              type="email" 
              className={styles.inputField} 
              placeholder="seu@email.com"
              onChange={(e) => setDados({...dados, email: e.target.value})}
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label>Senha</label>
            <input 
              type="password" 
              className={styles.inputField} 
              placeholder="••••••••"
              onChange={(e) => setDados({...dados, senha: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className={styles.btnAcesso}>Entrar no sistema</button>
        </form>

        <p className={styles.footerLink}>
          Não tem uma conta? <span className={styles.linkDestaque} onClick={() => navigate("/cadastro")}>Solicitar acesso</span>
        </p>
      </div>
    </div>
  );
}