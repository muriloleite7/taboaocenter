import { useState } from "react";
import styles from "../style/novoInquilino.module.css";

export default function NovoInquilino() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    imovel: "",
    aluguel: "",
    vencimento: "",
    dataInicio: "",
    dataFim: "",

    aguaTipo: "variavel",
    aguaValor: "",

    luzTipo: "variavel",
    luzValor: "",

    iptuTipo: "variavel",
    iptuValor: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalvar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Enviando dados:", formData);

    // Aqui entra a integração com o banco futuramente
  };

  return (
    <div className={styles.containerNovo}>
      <div className={styles.headerHome}>
        <div>
          <h1 className={styles.tituloHome}>Cadastrar Inquilino</h1>
          <p className={styles.subtituloHome}>
            Adicione um novo morador e configure contrato e cobranças.
          </p>
        </div>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
        <div className={styles.gridCampos}>
          <h3 className={styles.secaoTitulo}>Identificação pessoal</h3>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Nome completo</label>
            <input
              type="text"
              name="nome"
              className={styles.inputForm}
              placeholder="Ex: João Silva"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>CPF</label>
            <input
              type="text"
              name="cpf"
              className={styles.inputForm}
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>WhatsApp para contato</label>
            <input
              type="text"
              name="telefone"
              className={styles.inputForm}
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>E-mail</label>
            <input
              type="email"
              name="email"
              className={styles.inputForm}
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.gridCampos}>
          <h3 className={styles.secaoTitulo}>Contrato</h3>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Imóvel vinculado</label>
            <input
              type="text"
              name="imovel"
              className={styles.inputForm}
              placeholder="Ex: Apto 203 - Bloco B"
              value={formData.imovel}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Valor do aluguel</label>
            <input
              type="number"
              name="aluguel"
              className={styles.inputForm}
              placeholder="Ex: 1200"
              value={formData.aluguel}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Dia do vencimento</label>
            <input
              type="number"
              name="vencimento"
              className={styles.inputForm}
              placeholder="Ex: 10"
              min="1"
              max="31"
              value={formData.vencimento}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Data de início</label>
            <input
              type="date"
              name="dataInicio"
              className={styles.inputForm}
              value={formData.dataInicio}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Data de fim</label>
            <input
              type="date"
              name="dataFim"
              className={styles.inputForm}
              value={formData.dataFim}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.despesasCard}>
          <h3 className={styles.secaoTitulo}>Despesas do contrato</h3>
          <p className={styles.textoAjuda}>
            Defina se água, luz e IPTU serão fixos, variáveis ou se não serão
            cobrados neste contrato.
          </p>

          <div className={styles.despesaLinha}>
            <div>
              <h1 className={styles.despesaTitulo}>Água</h1>
              <span>Como a água será cobrada?</span>
            </div>

            <select
              name="aguaTipo"
              className={styles.selectForm}
              value={formData.aguaTipo}
              onChange={handleChange}
            >
              <option value="nao_cobra">Não cobra</option>
              <option value="fixo">Valor fixo</option>
              <option value="variavel">Variável mensal</option>
            </select>

            {formData.aguaTipo === "fixo" && (
              <input
                type="number"
                name="aguaValor"
                className={styles.inputDespesa}
                placeholder="Valor fixo"
                value={formData.aguaValor}
                onChange={handleChange}
              />
            )}
          </div>

          <div className={styles.despesaLinha}>
            <div>
              <h1 className={styles.despesaTitulo}>Luz</h1>
              <span>Como a luz será cobrada?</span>
            </div>

            <select
              name="luzTipo"
              className={styles.selectForm}
              value={formData.luzTipo}
              onChange={handleChange}
            >
              <option value="nao_cobra">Não cobra</option>
              <option value="fixo">Valor fixo</option>
              <option value="variavel">Variável mensal</option>
            </select>

            {formData.luzTipo === "fixo" && (
              <input
                type="number"
                name="luzValor"
                className={styles.inputDespesa}
                placeholder="Valor fixo"
                value={formData.luzValor}
                onChange={handleChange}
              />
            )}
          </div>

          <div className={styles.despesaLinha}>
            <div>
              <h1 className={styles.despesaTitulo}>IPTU</h1>
              <span>Como o IPTU será cobrado?</span>
            </div>

            <select
              name="iptuTipo"
              className={styles.selectForm}
              value={formData.iptuTipo}
              onChange={handleChange}
            >
              <option value="nao_cobra">Não cobra</option>
              <option value="fixo">Valor fixo</option>
              <option value="variavel">Variável mensal</option>
            </select>

            {formData.iptuTipo === "fixo" && (
              <input
                type="number"
                name="iptuValor"
                className={styles.inputDespesa}
                placeholder="Valor fixo"
                value={formData.iptuValor}
                onChange={handleChange}
              />
            )}
          </div>
        </div>

        <div className={styles.areaBotoes}>
          <button
            type="button"
            className={styles.botaoVoltar}
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>

          <button type="submit" className={styles.botaoSalvar}>
            Salvar inquilino
          </button>
        </div>
      </form>
    </div>
  );
}