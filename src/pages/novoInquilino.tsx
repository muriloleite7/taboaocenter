import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style/novoInquilino.module.css";
import api from "../services/api"; // Certifique-se de que sua instância do axios está aqui

export default function NovoInquilino() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    imovel: "", // Será o 'titulo' no banco
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

    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    uf: "",
    numero: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf") formattedValue = maskCPF(value);
    if (name === "telefone") formattedValue = maskPhone(value);

    if (name === "cep" && value === "") {
      setFormData((prev) => ({
        ...prev,
        cep: "",
        rua: "",
        bairro: "",
        cidade: "",
        uf: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // --- LÓGICA DE SALVAMENTO INTEGRADA ---
  const handleSalvar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Estruturamos o objeto para o backend relacional
      const payload = {
        inquilino: {
          nome: formData.nome,
          cpf: formData.cpf,
          telefone: formData.telefone,
          email: formData.email,
        },
        imovel: {
          titulo: formData.imovel,
        },
        endereco: {
          cep: formData.cep,
          rua: formData.rua,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf,
          numero: formData.numero,
        },
        contrato: {
          data_de_inicio: new Date(formData.dataInicio).toISOString(),
          data_de_fim: formData.dataFim ? new Date(formData.dataFim).toISOString() : null,
          vencimento: Number(formData.vencimento),
          valor_aluguel: parseFloat(formData.aluguel),
          // Enviamos as configurações de despesas
          config_despesas: {
            agua: { tipo: formData.aguaTipo, valor: parseFloat(formData.aguaValor) || 0 },
            luz: { tipo: formData.luzTipo, valor: parseFloat(formData.luzValor) || 0 },
            iptu: { tipo: formData.iptuTipo, valor: parseFloat(formData.iptuValor) || 0 },
          }
        }
      };

      await api.post("/inquilinos/completo", payload);
      
      alert("Cadastro realizado com sucesso!");
      navigate("/inquilinos");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.error || "Erro ao salvar inquilino. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  // --- MÁSCARAS E CEP (Mantidos conforme original) ---
  const maskCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .substring(0, 14);
  };

  const maskPhone = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  const checkCEP = (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          }));
        }
      });
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
        {/* SEÇÃO: Identificação pessoal */}
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
              required
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

        {/* SEÇÃO: Endereço */}
        <div className={styles.gridCampos}>
          <h3 className={styles.secaoTitulo}>Endereço de residência (Inquilino)</h3>
          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>CEP</label>
            <input
              type="text"
              name="cep"
              className={styles.inputForm}
              placeholder="00000-000"
              value={formData.cep}
              onChange={handleChange}
              onBlur={checkCEP}
            />
          </div>
          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Rua</label>
            <input
              type="text"
              name="rua"
              className={styles.inputForm}
              value={formData.rua}
              onChange={handleChange}
            />
          </div>
          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Bairro</label>
            <input
              type="text"
              name="bairro"
              className={styles.inputForm}
              value={formData.bairro}
              onChange={handleChange}
            />
          </div>
          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Número / Comp.</label>
            <input
              type="text"
              name="numero"
              className={styles.inputForm}
              value={formData.numero}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SEÇÃO: Contrato */}
        <div className={styles.gridCampos}>
          <h3 className={styles.secaoTitulo}>Contrato</h3>
          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Imóvel vinculado (Título)</label>
            <input
              type="text"
              name="imovel"
              className={styles.inputForm}
              placeholder="Ex: Sala 102 - Taboão Center"
              value={formData.imovel}
              onChange={handleChange}
              required
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
              required
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

        {/* SEÇÃO: Despesas */}
        <div className={styles.despesasCard}>
          <h3 className={styles.secaoTitulo}>Despesas do contrato</h3>
          <p className={styles.textoAjuda}>
            Defina se água, luz e IPTU serão fixos, variáveis ou não cobrados.
          </p>

          {/* Água */}
          <div className={styles.despesaLinha}>
            <div>
              <h1 className={styles.despesaTitulo}>Água</h1>
              <span>Como a água será cobrada?</span>
            </div>
            <select name="aguaTipo" className={styles.selectForm} value={formData.aguaTipo} onChange={handleChange}>
              <option value="nao_cobra">Não cobra</option>
              <option value="fixo">Valor fixo</option>
              <option value="variavel">Variável mensal</option>
            </select>
            {formData.aguaTipo === "fixo" && (
              <input type="number" name="aguaValor" className={styles.inputDespesa} placeholder="Valor fixo" value={formData.aguaValor} onChange={handleChange} />
            )}
          </div>

          {/* Luz */}
          <div className={styles.despesaLinha}>
            <div>
              <h1 className={styles.despesaTitulo}>Luz</h1>
              <span>Como a luz será cobrada?</span>
            </div>
            <select name="luzTipo" className={styles.selectForm} value={formData.luzTipo} onChange={handleChange}>
              <option value="nao_cobra">Não cobra</option>
              <option value="fixo">Valor fixo</option>
              <option value="variavel">Variável mensal</option>
            </select>
            {formData.luzTipo === "fixo" && (
              <input type="number" name="luzValor" className={styles.inputDespesa} placeholder="Valor fixo" value={formData.luzValor} onChange={handleChange} />
            )}
          </div>

          {/* IPTU */}
          <div className={styles.despesaLinha}>
            <div>
              <h1 className={styles.despesaTitulo}>IPTU</h1>
              <span>Como o IPTU será cobrado?</span>
            </div>
            <select name="iptuTipo" className={styles.selectForm} value={formData.iptuTipo} onChange={handleChange}>
              <option value="nao_cobra">Não cobra</option>
              <option value="fixo">Valor fixo</option>
              <option value="variavel">Variável mensal</option>
            </select>
            {formData.iptuTipo === "fixo" && (
              <input type="number" name="iptuValor" className={styles.inputDespesa} placeholder="Valor fixo" value={formData.iptuValor} onChange={handleChange} />
            )}
          </div>
        </div>

        <div className={styles.areaBotoes}>
          <button type="button" className={styles.botaoVoltar} onClick={() => navigate("/inquilinos")}>
            Cancelar
          </button>
          <button type="submit" className={styles.botaoSalvar} disabled={loading}>
            {loading ? "Salvando..." : "Salvar inquilino"}
          </button>
        </div>
      </form>
    </div>
  );
}