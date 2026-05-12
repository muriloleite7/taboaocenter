// Login.tsx
import { useState } from 'react';
import styles from '../style/auth.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';

export default function Login() {
  const [dados, setDados] = useState({ email: '', senha: '' });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' }); // tipo: 'erro' ou 'info'
  const [carregando, setCarregando] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });
    setCarregando(true);

    setTimeout(() => {
      // simulação de lógica de status
      const usuarioSimulado = {
        email: dados.email,
        status: dados.email === "novo@taboao.com" ? "Pendente" : "Ativo"
      };

      if (dados.email === "admin@taboao.com" && dados.senha === "admin123") {
        login({ nome: "Admin", email: dados.email, cargo: "Administrador" });
        navigate("/");
      } 
      else if (usuarioSimulado.status === "Pendente") {
        setMensagem({ 
          texto: "Seu acesso ainda está em análise pelo administrador.", 
          tipo: 'info' 
        });
        setCarregando(false);
      } 
      else {
        setMensagem({ texto: "E-mail ou senha inválidos.", tipo: 'erro' });
        setCarregando(false);
      }
    }, 1500); 
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.logoArea}><h2>TABOÃO CENTER</h2></div>
        <h1 className={styles.titulo}>Login</h1>

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

          {mensagem.texto && (
            <p style={{ 
              color: mensagem.tipo === 'erro' ? '#ef4444' : '#3b82f6', 
              fontSize: '13px', 
              marginBottom: '15px',
              backgroundColor: mensagem.tipo === 'erro' ? '#fef2f2' : '#eff6ff',
              padding: '10px',
              borderRadius: '6px'
            }}>
              {mensagem.texto}
            </p>
          )}

          <button type="submit" className={styles.btnAcesso} disabled={carregando}>
            {carregando ? "Autenticando..." : "Entrar no sistema"}
          </button>
        </form>

        <p className={styles.footerLink}>
          Novo colaborador? <span className={styles.linkDestaque} onClick={() => navigate("/cadastro")}>Solicitar acesso</span>
        </p>
      </div>
    </div>
  );
}