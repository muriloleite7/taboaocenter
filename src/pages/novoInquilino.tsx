import React, { useState } from 'react';
import styles from '../style/novoinquilino.module.css';

export default function NovoInquilino() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    imovel: '',
    aluguel: '',
    vencimento: '',
    agua: '',
    luz: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    console.log("Enviando dados:", formData);
    // Aqui entra a integração com o banco futuramente
  };

  return (
    <div className={styles.containerNovo}>
      {/* Reaproveitando suas classes da Home para manter o padrão */}
      <div className={styles.headerHome}> 
        <div>
          <h1 className={styles.tituloHome}>Cadastrar Inquilino</h1>
          <p className={styles.subtituloHome}>Adicione um novo morador e configure as cobranças.</p>
        </div>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
        
        {/* Seção 1: Identificação */}
        <div className={styles.gridCampos}>
          <h3 className={styles.secaoTitulo}>Identificação Pessoal</h3>
          
          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Nome Completo</label>
            <input type="text" name="nome" className={styles.inputForm} placeholder="Ex: João Silva" onChange={handleChange} required />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>CPF</label>
            <input type="text" name="cpf" className={styles.inputForm} placeholder="000.000.000-00" onChange={handleChange} />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>WhatsApp (para o Robô)</label>
            <input type="text" name="telefone" className={styles.inputForm} placeholder="(11) 99999-9999" onChange={handleChange} />
          </div>
        </div>

        {/* Seção 2: Financeiro e Imóvel */}
        <div className={styles.gridCampos}>
          <h3 className={styles.secaoTitulo}>Contrato e Cobrança</h3>
          
          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Imóvel Selecionado</label>
            <input type="text" name="imovel" className={styles.inputForm} placeholder="Ex: Apto 203 - Bloco B" onChange={handleChange} />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Valor do Aluguel (R$)</label>
            <input type="number" name="aluguel" className={styles.inputForm} placeholder="1200" onChange={handleChange} />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Dia do Vencimento</label>
            <input type="number" name="vencimento" className={styles.inputForm} placeholder="10" min="1" max="31" onChange={handleChange} />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Valor Fixo Água (Opcional)</label>
            <input type="number" name="agua" className={styles.inputForm} placeholder="Ex: 50" onChange={handleChange} />
          </div>
        </div>

        {/* Ações */}
        <div className={styles.areaBotoes}>
          <button type="button" className={styles.botaoVoltar} onClick={() => window.history.back()}>
            Cancelar
          </button>
          <button type="submit" className={styles.botaoSalvar}>
            Finalizar Cadastro
          </button>
        </div>
      </form>
    </div>
  );
};
