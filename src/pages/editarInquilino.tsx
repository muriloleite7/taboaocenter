import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { inquilinosMock } from "../data/inquilinosMock";
import styles from "../style/editarInquilino.module.css";

const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";

type LocationState = {
  voltarPara?: string;
  textoVoltar?: string;
};

export default function EditarInquilino() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const rotaVoltar = state?.voltarPara || `/inquilinos/${id}`;
  const textoVoltar = state?.textoVoltar || "← Voltar para detalhes";

  const [loading, setLoading] = useState(true);
  const [existeInquilino, setExisteInquilino] = useState(true);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",

    emergenciaNome: "",
    emergenciaTel: "",

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

    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    uf: "",
    numero: "",

    statusPagamento: "Adimplente",
    statusContrato: "Ativo",
  });

  const carregarInquilinos = () => {
    const inquilinosSalvos = localStorage.getItem(INQUILINOS_STORAGE_KEY);

    if (inquilinosSalvos) {
      return JSON.parse(inquilinosSalvos);
    }

    localStorage.setItem(INQUILINOS_STORAGE_KEY, JSON.stringify(inquilinosMock));
    return inquilinosMock;
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  const montarDataVencimento = (diaVencimento: string) => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const dia = Number(diaVencimento || 1);

    return new Date(ano, mes, dia).toISOString();
  };

  const montarEndereco = () => {
    const partes = [
      formData.rua,
      formData.numero,
      formData.bairro,
      formData.cidade,
      formData.uf,
    ].filter(Boolean);

    return partes.join(" - ");
  };

  useEffect(() => {
    const listaInquilinos = carregarInquilinos();

    const inquilinoEncontrado = listaInquilinos.find(
      (inquilino: any) => String(inquilino.id) === String(id)
    );

    if (!inquilinoEncontrado) {
      setExisteInquilino(false);
      setLoading(false);
      return;
    }

    setFormData({
      nome: inquilinoEncontrado.nome || "",
      cpf: inquilinoEncontrado.cpf || "",
      telefone: inquilinoEncontrado.telefone || "",
      email: inquilinoEncontrado.email || "",

      emergenciaNome: inquilinoEncontrado.emergenciaNome || "",
      emergenciaTel: inquilinoEncontrado.emergenciaTel || "",

      imovel: inquilinoEncontrado.imovel || "",
      aluguel: String(inquilinoEncontrado.aluguel || ""),

      vencimento: String(
        inquilinoEncontrado.vencimento ||
          inquilinoEncontrado.diaVencimento ||
          ""
      ),

      dataInicio: inquilinoEncontrado.dataInicio || "",
      dataFim: inquilinoEncontrado.dataFim || "",

      aguaTipo: inquilinoEncontrado.aguaTipo || "variavel",
      aguaValor: String(inquilinoEncontrado.aguaValor || ""),

      luzTipo: inquilinoEncontrado.luzTipo || "variavel",
      luzValor: String(inquilinoEncontrado.luzValor || ""),

      iptuTipo: inquilinoEncontrado.iptuTipo || "variavel",
      iptuValor: String(inquilinoEncontrado.iptuValor || ""),

      cep: inquilinoEncontrado.cep || "",
      rua: inquilinoEncontrado.rua || "",
      bairro: inquilinoEncontrado.bairro || "",
      cidade: inquilinoEncontrado.cidade || "",
      uf: inquilinoEncontrado.uf || "",
      numero: inquilinoEncontrado.numero || "",

      statusPagamento: inquilinoEncontrado.statusPagamento || "Adimplente",
      statusContrato: inquilinoEncontrado.statusContrato || "Ativo",
    });

    setLoading(false);
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "telefone" || name === "emergenciaTel") {
      formattedValue = maskPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSalvar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert("Informe o nome do inquilino.");
      return;
    }

    if (!formData.imovel.trim()) {
      alert("Informe o imóvel vinculado.");
      return;
    }

    if (!formData.aluguel || Number(formData.aluguel) <= 0) {
      alert("Informe um valor de aluguel válido.");
      return;
    }

    if (
      !formData.vencimento ||
      Number(formData.vencimento) < 1 ||
      Number(formData.vencimento) > 31
    ) {
      alert("Informe um dia de vencimento entre 1 e 31.");
      return;
    }

    const listaInquilinos = carregarInquilinos();

    const inquilinosAtualizados = listaInquilinos.map((inquilino: any) => {
      if (String(inquilino.id) !== String(id)) {
        return inquilino;
      }

      return {
        ...inquilino,

        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
        email: formData.email,

        emergenciaNome: formData.emergenciaNome,
        emergenciaTel: formData.emergenciaTel,

        imovel: formData.imovel,

        aluguel: Number(formData.aluguel),

        vencimento: Number(formData.vencimento),
        diaVencimento: Number(formData.vencimento),
        vencimentoTexto: `Dia ${formData.vencimento}`,
        vencimentoData: montarDataVencimento(formData.vencimento),

        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,

        aguaTipo: formData.aguaTipo,
        aguaValor: Number(formData.aguaValor || 0),

        luzTipo: formData.luzTipo,
        luzValor: Number(formData.luzValor || 0),

        iptuTipo: formData.iptuTipo,
        iptuValor: Number(formData.iptuValor || 0),

        cep: formData.cep,
        rua: formData.rua,
        bairro: formData.bairro,
        cidade: formData.cidade,
        uf: formData.uf,
        numero: formData.numero,
        endereco: montarEndereco() || inquilino.endereco || "",

        statusPagamento: formData.statusPagamento,
        statusContrato: formData.statusContrato,

        dataAtualizacao: new Date().toISOString(),
      };
    });

    localStorage.setItem(
      INQUILINOS_STORAGE_KEY,
      JSON.stringify(inquilinosAtualizados)
    );

    alert("Inquilino atualizado com sucesso!");
    navigate(`/inquilinos/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.containerEditar}>
        <h1>Carregando dados...</h1>
      </div>
    );
  }

  if (!existeInquilino) {
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
          <button
            type="button"
            className={styles.voltarLink}
            onClick={() => navigate(rotaVoltar)}
          >
            {textoVoltar}
          </button>

          <h1 className={styles.tituloEditar}>Editar Inquilino</h1>

          <p className={styles.subtituloEditar}>
            Atualize os dados cadastrais, contrato e regras para cobranças futuras.
          </p>
        </div>
      </div>

      <div className={styles.avisoEdicao}>
        <h3>Atenção</h3>

        <p>
          As alterações feitas aqui afetam o cadastro do inquilino e as próximas
          cobranças. Cobranças já lançadas devem ser editadas na tela de cobranças.
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
          <h2 className={styles.secaoTitulo}>Contato de emergência</h2>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Nome do contato</label>

            <input
              type="text"
              name="emergenciaNome"
              className={styles.inputForm}
              value={formData.emergenciaNome}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Telefone de emergência</label>

            <input
              type="text"
              name="emergenciaTel"
              className={styles.inputForm}
              value={formData.emergenciaTel}
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
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Status do pagamento</label>

            <select
              name="statusPagamento"
              className={styles.selectForm}
              value={formData.statusPagamento}
              onChange={handleChange}
            >
              <option>Adimplente</option>
              <option>Com pendência</option>
              <option>Despesas pendentes</option>
            </select>
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Status do contrato</label>

            <select
              name="statusContrato"
              className={styles.selectForm}
              value={formData.statusContrato}
              onChange={handleChange}
            >
              <option>Ativo</option>
              <option>Encerrado</option>
            </select>
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
            cobrados neste contrato.
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
            onClick={() => navigate(rotaVoltar)}
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