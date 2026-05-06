import { useState } from 'react';
import styles from '../style/auth.module.css';
import { useNavigate } from 'react-router-dom';

export default function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', cargo: 'Consultor' });
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();
    setCarregando(true);

    // simulaçao de criaçao de conta (temporario)
    console.log("Enviando para o banco de dados:", form);
    
    setTimeout(() => {
      alert("Conta solicitada com sucesso! Aguarde a aprovação do administrador.");
      setCarregando(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.logoArea}>
          <h2>TABOÃO CENTER</h2>
        </div>

        <h1 className={styles.titulo}>Criar conta</h1>
        <p className={styles.subtitulo}>Cadastre um novo colaborador no sistema.</p>

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
            <label>Cargo / Função</label>
            <select 
              className={styles.inputField}
              value={form.cargo}
              onChange={(e) => setForm({...form, cargo: e.target.value})}
            >
              <option value="Administrador">Administrador</option>
              <option value="Consultor">Consultor</option>
              <option value="Financeiro">Financeiro</option>
            </select>
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
            />
          </div>

          <button type="submit" className={styles.btnAcesso} disabled={carregando}>
            {carregando ? "Criando conta..." : "Finalizar cadastro"}
          </button>
        </form>

        <p className={styles.footerLink}>
          Já possui conta? <span className={styles.linkDestaque} onClick={() => navigate("/login")}>Fazer login</span>
        </p>
      </div>
    </div>
  );
}