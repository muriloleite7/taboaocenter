// Cadastro.tsx
import { useState } from 'react';
import styles from '../style/auth.module.css';
import { useNavigate } from 'react-router-dom';

export default function Cadastro() {

  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    // LÓGICA DE STATUS:
    // Se for o e-mail master, já nasce Ativo. Se não, nasce Pendente para o Admin aprovar.
    const statusInicial = form.email === "admin@taboao.com" ? "Ativo" : "Pendente";

    console.log("Enviando para o sistema:", { ...form, status: statusInicial });
    
    setTimeout(() => {
      if (statusInicial === "Ativo") {
        alert("Conta de Administrador configurada com sucesso!");
      } else {
        alert("Solicitação de acesso enviada! Aguarde a aprovação do administrador para conseguir logar.");
      }
      
      setCarregando(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.logoArea}><h2>TABOÃO CENTER</h2></div>

        <h1 className={styles.titulo}>Solicitar Acesso</h1>
        <p className={styles.subtitulo}>Cadastre-se para acessar o sistema.</p>

        <form onSubmit={handleCadastro}>
          
          <div className={styles.formGroup}>
            <label>Nome completo</label>
            <input 
              type="text" 
              className={styles.inputField} 
              placeholder="Nome do colaborador" 
              value={form.nome}
              onChange={(e) => setForm({...form, nome: e.target.value})}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>E-mail corporativo</label>
            <input 
              type="email" 
              className={styles.inputField} 
              placeholder="exemplo@taboao.com" 
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Senha de acesso</label>
            <input 
              type="password" 
              className={styles.inputField} 
              placeholder="Mínimo 8 caracteres" 
              value={form.senha}
              onChange={(e) => setForm({...form, senha: e.target.value})}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className={styles.btnAcesso} disabled={carregando}>
            {carregando ? "Enviando solicitação..." : "Enviar Solicitação"}
          </button>
        </form>

        <p className={styles.footerLink}>
          Já tem acesso liberado? <span className={styles.linkDestaque} onClick={() => navigate("/login")}>Fazer login</span>
        </p>
      </div>
    </div>
  );
}