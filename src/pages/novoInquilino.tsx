import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "../style/editarInquilino.module.css"; // Reaproveitando os estilos de formulário

export default function NovoInquilino() {
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState<boolean>(false);

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
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalvar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSalvando(true);

      // Tratamento e higienização dos dados para o formato que o banco de dados/Prisma aceita
      const dadosParaSalvar = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ""), // Remove pontos e traços do CPF se o usuário digitar
        aluguel: formData.aluguel ? Number(formData.aluguel) : null,
        vencimento: formData.vencimento ? Number(formData.vencimento) : null,
        aguaValor: formData.aguaTipo === "fixo" ? Number(formData.aguaValor) : null,
        luzValor: formData.luzTipo === "fixo" ? Number(formData.luzValor) : null,
        iptuValor: formData.iptuTipo === "fixo" ? Number(formData.iptuValor) : null,
      };

      console.log("Enviando novo inquilino para o backend:", dadosParaSalvar);
      
      // Envia os dados para a rota de criação no backend
      const response = await api.post("/inquilinos", dadosParaSalvar);
      
      alert("Inquilino cadastrado com sucesso!");
      
      // Redireciona para a listagem principal ou para o perfil do inquilino recém-criado
      if (response.data && response.data.id) {
        navigate(`/inquilinos/${response.data.id}`);
      } else {
        navigate("/inquilinos");
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar novo inquilino:", error.response?.data || error.message);
      alert("Não foi possível realizar o cadastro. Verifique os dados e tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className={styles.containerEditar}>
      <div className={styles.headerEditar}>
        <div>
          <Link to="/inquilinos" className={styles.voltarLink}>
            ← Voltar para a lista
          </Link>

          <h1 className={styles.tituloEditar}>Novo Inquilino</h1>

          <p className={styles.subtituloEditar}>
            Cadastre um novo locatário, vincule um imóvel e configure as regras de cobranças.
          </p>
        </div>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
        {/* Identificação Pessoal */}
        <div className={styles.gridCampos}>
          <h2 className={styles.secaoTitulo}>Identificação pessoal</h2>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Nome completo</label>
            <input
              type="text"
              name="nome"
              className={styles.inputForm}
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: João da Silva"
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>CPF</label>
            <input
              type="text"
              name="cpf"
              className={styles.inputForm}
              value={formData.cpf}
              onChange={handleChange}
              placeholder="Apenas números ou formato padrão"
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>WhatsApp para contato</label>
            <input
              type="text"
              name="telefone"
              className={styles.inputForm}
              value={formData.telefone}
              onChange={handleChange}
              placeholder="Ex: 11999999999"
              required
            />
          </div>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>E-mail</label>
            <input
              type="email"
              name="email"
              className={styles.inputForm}
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: joao@email.com"
            />
          </div>
        </div>

        {/* Informações do Contrato */}
        <div className={styles.gridCampos}>
          <h2 className={styles.secaoTitulo}>Contrato inicial</h2>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Imóvel vinculado</label>
            <input
              type="text"
              name="imovel"
              className={styles.inputForm}
              value={formData.imovel}
              onChange={handleChange}
              placeholder="Ex: Casa 02, Apartamento 104"
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Valor do aluguel</label>
            <input
              type="number"
              name="aluguel"
              className={styles.inputForm}
              value={formData.aluguel}
              onChange={handleChange}
              placeholder="Ex: 1200"
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Dia do vencimento</label>
            <input
              type="number"
              name="vencimento"
              className={styles.inputForm}
              min="1"
              max="31"
              value={formData.vencimento}
              onChange={handleChange}
              placeholder="Ex: 10"
              required
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
              required
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

        {/* Despesas do Contrato */}
        <div className={styles.despesasCard}>
          <h2 className={styles.secaoTitulo}>Despesas do contrato</h2>

          <p className={styles.textoAjuda}>
            Defina se água, luz e IPTU são fixos, variáveis ou se não serão
            cobrados neste contrato.
          </p>

          {/* ÁGUA */}
          <div className={styles.despesaLinha}>
            <div>
              <h3 className={styles.despesaTitulo}>Água</h3>
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
                required
              />
            )}
          </div>

          {/* LUZ */}
          <div className={styles.despesaLinha}>
            <div>
              <h3 className={styles.despesaTitulo}>Luz</h3>
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
                required
              />
            )}
          </div>

          {/* IPTU */}
          <div className={styles.despesaLinha}>
            <div>
              <h3 className={styles.despesaTitulo}>IPTU</h3>
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
                required
              />
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className={styles.areaBotoes}>
          <button
            type="button"
            className={styles.botaoVoltar}
            onClick={() => navigate("/inquilinos")}
            disabled={salvando}
          >
            Cancelar
          </button>

          <button 
            type="submit" 
            className={styles.botaoSalvar} 
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Cadastrar Inquilino"}
          </button>
        </div>
      </form>
    </div>
  );
}