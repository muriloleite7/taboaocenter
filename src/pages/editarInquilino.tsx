import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "../style/editarInquilino.module.css";

export default function EditarInquilino() {
  const { id } = useParams();

  const inquilinos = [
    {
      id: "1",
      nome: "João Silva",
      cpf: "123.456.789-00",
      telefone: "(11) 98765-4321",
      email: "joao.silva@email.com",
      imovel: "Apto 101",
      aluguel: "1500",
      vencimento: "10",
      dataInicio: "2025-05-10",
      dataFim: "2026-05-10",
      aguaTipo: "variavel",
      aguaValor: "",
      luzTipo: "variavel",
      luzValor: "",
      iptuTipo: "fixo",
      iptuValor: "95",
    },
    {
      id: "2",
      nome: "Maria Clara",
      cpf: "987.654.321-00",
      telefone: "(11) 97654-3210",
      email: "maria.clara@email.com",
      imovel: "Casa 02",
      aluguel: "1800",
      vencimento: "15",
      dataInicio: "2025-05-15",
      dataFim: "2026-05-15",
      aguaTipo: "fixo",
      aguaValor: "80",
      luzTipo: "variavel",
      luzValor: "",
      iptuTipo: "fixo",
      iptuValor: "110",
    },
  ];

  const inquilinoEncontrado = inquilinos.find(
    (inquilino) => inquilino.id === id
  );

  const [formData, setFormData] = useState({
    nome: inquilinoEncontrado?.nome || "",
    cpf: inquilinoEncontrado?.cpf || "",
    telefone: inquilinoEncontrado?.telefone || "",
    email: inquilinoEncontrado?.email || "",
    imovel: inquilinoEncontrado?.imovel || "",
    aluguel: inquilinoEncontrado?.aluguel || "",
    vencimento: inquilinoEncontrado?.vencimento || "",
    dataInicio: inquilinoEncontrado?.dataInicio || "",
    dataFim: inquilinoEncontrado?.dataFim || "",

    aguaTipo: inquilinoEncontrado?.aguaTipo || "variavel",
    aguaValor: inquilinoEncontrado?.aguaValor || "",

    luzTipo: inquilinoEncontrado?.luzTipo || "variavel",
    luzValor: inquilinoEncontrado?.luzValor || "",

    iptuTipo: inquilinoEncontrado?.iptuTipo || "variavel",
    iptuValor: inquilinoEncontrado?.iptuValor || "",
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

  const handleSalvar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Dados atualizados:", {
      id,
      ...formData,
    });

    // Futuramente aqui entra o PUT/PATCH para atualizar no banco
  };

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