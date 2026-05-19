import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api"; // Instância do Axios ou fetch configurado
import styles from "../style/editarInquilino.module.css";

// Função utilitária para converter datas do formato ISO (vinda do banco) para YYYY-MM-DD (exigida pelo input date)
const formatarDataParaInput = (dataIso: string | undefined): string => {
  if (!dataIso) return "";
  return dataIso.split("T")[0];
};

export default function EditarInquilino() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [inquilinoEncontrado, setInquilinoEncontrado] = useState<boolean>(true);

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

  // Busca os dados do inquilino diretamente da API ao montar o componente
  useEffect(() => {
    async function obterDados() {
      try {
        setLoading(true);
        const response = await api.get(`/inquilinos/${id}`);
        const dados = response.data;

        if (!dados) {
          setInquilinoEncontrado(false);
          return;
        }

        setFormData({
          nome: dados.nome || "",
          cpf: dados.cpf || "",
          telefone: dados.telefone || "",
          email: dados.email || "",
          imovel: dados.imovel || "",
          aluguel: dados.aluguel || "",
          vencimento: dados.diaVencimento || "",
          dataInicio: formatarDataParaInput(dados.dataInicio),
          dataFim: formatarDataParaInput(dados.dataFim),
          aguaTipo: dados.aguaTipo || "variavel",
          aguaValor: dados.aguaValor || "",
          luzTipo: dados.luzTipo || "variavel",
          luzValor: dados.luzValor || "",
          iptuTipo: dados.iptuTipo || "variavel",
          iptuValor: dados.iptuValor || "",
        });
        setInquilinoEncontrado(true);
      } catch (error) {
        console.error("Erro ao buscar dados do inquilino:", error);
        setInquilinoEncontrado(false);
      } finally {
        setLoading(false);
      }
    }

    if (id) obterDados();
  }, [id]);

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
      // Estruturando o payload limpando campos numéricos vazios
      const dadosParaSalvar = {
        ...formData,
        aluguel: formData.aluguel ? Number(formData.aluguel) : null,
        vencimento: formData.vencimento ? Number(formData.vencimento) : null,
        aguaValor: formData.aguaTipo === "fixo" ? Number(formData.aguaValor) : null,
        luzValor: formData.luzTipo === "fixo" ? Number(formData.luzValor) : null,
        iptuValor: formData.iptuTipo === "fixo" ? Number(formData.iptuValor) : null,
      };

      await api.put(`/inquilinos/${id}`, dadosParaSalvar);
      
      // Redireciona o usuário para a página de visualização do inquilino após salvar
      navigate(`/inquilinos/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar dados do inquilino:", error);
      alert("Não foi possível salvar as alterações. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className={styles.containerEditar}>
        <h1>Carregando dados...</h1>
      </div>
    );
  }

  if (!inquilinoEncontrado) {
    return (
      <div className={styles.containerEditar}>
        <h1>Inquilino não encontrado</h1>
        <Link to="/inquilinos" className={styles.voltarLink}>
          Voltar para inquilinos
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.containerEditar}>
      <div className={styles.headerEditar}>
        <div>
          <Link to={`/inquilinos/${id}`} className={styles.voltarLink}>
            ← Voltar para detalhes
          </Link>

          <h1 className={styles.tituloEditar}>Editar Inquilino</h1>

          <p className={styles.subtituloEditar}>
            Atualize os dados cadastrais, contrato e regras para cobranças
            futuras.
          </p>
        </div>
      </div>

      <div className={styles.avisoEdicao}>
        <h3>Atenção</h3>
        <p>
          As alterações feitas aqui afetam o cadastro do inquilino, o contrato e
          as próximas cobranças. Cobranças já lançadas devem ser editadas na
          tela de cobranças.
        </p>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
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
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>CPF</label>
            <input
              type="text"
              name="cpf"
              className={`${styles.inputForm} ${styles.inputBloqueado}`}
              value={formData.cpf}
              disabled
            />
            <span className={styles.campoAjuda}>
              CPF bloqueado para evitar alteração acidental do cadastro.
            </span>
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>WhatsApp para contato</label>
            <input
              type="text"
              name="telefone"
              className={styles.inputForm}
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
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.gridCampos}>
          <h2 className={styles.secaoTitulo}>Contrato</h2>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Imóvel vinculado</label>
            <input
              type="text"
              name="imovel"
              className={styles.inputForm}
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
          <h2 className={styles.secaoTitulo}>Despesas do contrato</h2>

          <p className={styles.textoAjuda}>
            Defina se água, luz e IPTU são fixos, variáveis ou se não são
            cobrados neste contrato. Essas regras serão usadas nas próximas
            cobranças.
          </p>

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
              />
            )}
          </div>

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
              />
            )}
          </div>

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
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}