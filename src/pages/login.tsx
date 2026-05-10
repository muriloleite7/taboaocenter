import { useState } from 'react';
import styles from '../style/auth.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';


export default function Login() {
  const [dados, setDados] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    // Simulação da chamada da API -> BACK-END
    setTimeout(() => {
      if (dados.email === "admin@taboao.com" && dados.senha === "123456") {
        
        login({ 
          nome: "Murilo", 
          email: dados.email, 
          cargo: "Administrador" 
        });

        navigate("/");
      } else {
        setErro("E-mail ou senha inválidos. Tente novamente.");
        setCarregando(false);
      }
    }, 1500); 
  };

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
              value={dados.email}
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
              value={dados.senha}
              onChange={(e) => setDados({...dados, senha: e.target.value})}
              required 
            />
          </div>

          {erro && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '15px' }}>{erro}</p>}

          <button type="submit" className={styles.btnAcesso} disabled={carregando}>
            {carregando ? "Autenticando..." : "Entrar no sistema"}
          </button>
        </form>

        <p className={styles.footerLink}>
          Não tem uma conta? <span className={styles.linkDestaque} onClick={() => navigate("/cadastro")}>Solicitar acesso</span>
        </p>
      </div>
    </div>
  );
}