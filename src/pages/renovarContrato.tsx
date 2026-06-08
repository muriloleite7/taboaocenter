import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { contratosMock } from "../data/contratosMock";
import { inquilinosMock } from "../data/inquilinosMock";
import styles from "../style/editarInquilino.module.css";

const CONTRATOS_STORAGE_KEY = "@TaboaoCenter:contratos";
const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";

function carregarContratos() {
  const contratosSalvos = localStorage.getItem(CONTRATOS_STORAGE_KEY);

  if (contratosSalvos) {
    return JSON.parse(contratosSalvos);
  }

  localStorage.setItem(CONTRATOS_STORAGE_KEY, JSON.stringify(contratosMock));
  return contratosMock;
}

function carregarInquilinos() {
  const inquilinosSalvos = localStorage.getItem(INQUILINOS_STORAGE_KEY);

  if (inquilinosSalvos) {
    return JSON.parse(inquilinosSalvos);
  }

  localStorage.setItem(INQUILINOS_STORAGE_KEY, JSON.stringify(inquilinosMock));
  return inquilinosMock;
}

function formatarDataParaInput(data: string) {
  if (!data) return "";

  if (data.includes("-")) {
    return data.slice(0, 10);
  }

  return "";
}

function somarUmDia(data: string) {
  if (!data) return "";

  const dataObj = new Date(data);
  dataObj.setUTCDate(dataObj.getUTCDate() + 1);

  return dataObj.toISOString().slice(0, 10);
}

export default function RenovarContrato() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [existeDados, setExisteDados] = useState(true);

  const [formData, setFormData] = useState({
    inquilinoId: "",
    nomeInquilino: "",
    imovel: "",
    fimContratoAtual: "",
    valorAtual: "",
    novoValor: "",
    novoVencimento: "",
    novaDataInicio: "",
    novaDataFim: "",
    cobrancaAutomatica: "Sim",
    reajuste: "Anual",
    observacoes: "",
  });

  useEffect(() => {
    const listaContratos = carregarContratos();
    const listaInquilinos = carregarInquilinos();

    const contratoEncontrado = listaContratos.find(
      (contrato: any) => String(contrato.id) === String(id)
    );

    if (!contratoEncontrado) {
      setExisteDados(false);
      setLoading(false);
      return;
    }

    const inquilinoEncontrado = listaInquilinos.find(
      (inquilino: any) =>
        String(inquilino.id) === String(contratoEncontrado.inquilinoId)
    );

    const dataFimAtual =
      contratoEncontrado.dataFim || contratoEncontrado.fim || "";

    const valorAtual =
      contratoEncontrado.valorAluguel || contratoEncontrado.aluguel || "";

    const vencimentoAtual =
      contratoEncontrado.diaVencimento || contratoEncontrado.vencimento || "";

    setFormData({
      inquilinoId: contratoEncontrado.inquilinoId || "",
      nomeInquilino:
        inquilinoEncontrado?.nome ||
        contratoEncontrado.inquilinoNome ||
        "Inquilino não encontrado",

      imovel:
        contratoEncontrado.imovel ||
        inquilinoEncontrado?.imovel ||
        "",

      fimContratoAtual: formatarDataParaInput(dataFimAtual),
      valorAtual: String(valorAtual),

      novoValor: String(valorAtual),
      novoVencimento: String(vencimentoAtual),
      novaDataInicio: somarUmDia(formatarDataParaInput(dataFimAtual)),
      novaDataFim: "",

      cobrancaAutomatica:
        contratoEncontrado.cobrancaAutomatica === false ? "Não" : "Sim",

      reajuste: contratoEncontrado.reajuste || "Anual",
      observacoes: "",
    });

    setLoading(false);
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalvar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.novoValor || Number(formData.novoValor) <= 0) {
      alert("Informe um novo valor de aluguel válido.");
      return;
    }

    if (
      !formData.novoVencimento ||
      Number(formData.novoVencimento) < 1 ||
      Number(formData.novoVencimento) > 31
    ) {
      alert("Informe um dia de vencimento entre 1 e 31.");
      return;
    }

    if (!formData.novaDataInicio || !formData.novaDataFim) {
      alert("Informe a data de início e fim da renovação.");
      return;
    }

    if (formData.novaDataFim <= formData.novaDataInicio) {
      alert("A data final da renovação precisa ser maior que a data inicial.");
      return;
    }

    const listaContratos = carregarContratos();

    const contratosAtualizados = listaContratos.map((contrato: any) => {
      if (String(contrato.id) !== String(id)) {
        return contrato;
      }

      const historicoRenovacoes = contrato.historicoRenovacoes || [];

      const renovacaoAtual = {
        dataRenovacao: new Date().toISOString(),
        valorAnterior: Number(formData.valorAtual || 0),
        novoValor: Number(formData.novoValor),
        vencimentoAnterior: contrato.diaVencimento || contrato.vencimento || "",
        novoVencimento: Number(formData.novoVencimento),
        dataInicioAnterior: contrato.dataInicio || contrato.inicio || "",
        dataFimAnterior: contrato.dataFim || contrato.fim || "",
        novaDataInicio: formData.novaDataInicio,
        novaDataFim: formData.novaDataFim,
        observacoes: formData.observacoes,
      };

      return {
        ...contrato,

        valorAluguel: Number(formData.novoValor),
        aluguel: Number(formData.novoValor),

        diaVencimento: Number(formData.novoVencimento),
        vencimento: Number(formData.novoVencimento),

        dataInicio: formData.novaDataInicio,
        dataFim: formData.novaDataFim,
        inicio: formData.novaDataInicio,
        fim: formData.novaDataFim,

        cobrancaAutomatica: formData.cobrancaAutomatica === "Sim",
        reajuste: formData.reajuste,

        status: "Ativo",
        observacoes: formData.observacoes,

        historicoRenovacoes: [renovacaoAtual, ...historicoRenovacoes],

        dataUltimaRenovacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
      };
    });

    localStorage.setItem(
      CONTRATOS_STORAGE_KEY,
      JSON.stringify(contratosAtualizados)
    );

    alert("Contrato renovado com sucesso!");
    navigate(`/contratos/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.containerEditar}>
        <h1>Carregando dados para renovação...</h1>
      </div>
    );
  }

  if (!existeDados) {
    return (
      <div className={styles.containerEditar}>
        <h1>Contrato não encontrado</h1>

        <Link to="/contratos" className={styles.voltarLink}>
          Voltar para contratos
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.containerEditar}>
      <div className={styles.headerEditar}>
        <div>
          <Link to={`/contratos/${id}`} className={styles.voltarLink}>
            ← Voltar para o contrato
          </Link>

          <h1 className={styles.tituloEditar}>Renovar Contrato</h1>

          <p className={styles.subtituloEditar}>
            Estenda o prazo do contrato, ajuste valores e mantenha o vínculo
            com o mesmo inquilino.
          </p>
        </div>
      </div>

      <div className={styles.avisoEdicao}>
        <h3>Regra de renovação</h3>

        <p>
          Os dados do inquilino e do imóvel não são alterados nesta tela. Para
          mudar o titular, encerre este contrato e crie um novo.
        </p>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
        <div className={styles.gridCampos}>
          <h2 className={styles.secaoTitulo}>Contrato atual</h2>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Inquilino</label>

            <input
              type="text"
              className={`${styles.inputForm} ${styles.inputBloqueado}`}
              value={formData.nomeInquilino}
              disabled
            />
          </div>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Imóvel</label>

            <input
              type="text"
              className={`${styles.inputForm} ${styles.inputBloqueado}`}
              value={formData.imovel}
              disabled
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Fim do contrato atual</label>

            <input
              type="date"
              className={`${styles.inputForm} ${styles.inputBloqueado}`}
              value={formData.fimContratoAtual}
              disabled
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Valor atual</label>

            <input
              type="text"
              className={`${styles.inputForm} ${styles.inputBloqueado}`}
              value={`R$ ${formData.valorAtual}`}
              disabled
            />
          </div>
        </div>

        <div className={styles.gridCampos}>
          <h2 className={styles.secaoTitulo}>Novas condições</h2>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Novo valor do aluguel</label>

            <input
              type="number"
              name="novoValor"
              className={styles.inputForm}
              placeholder="Ex: 1650"
              value={formData.novoValor}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Novo dia de vencimento</label>

            <input
              type="number"
              name="novoVencimento"
              className={styles.inputForm}
              min="1"
              max="31"
              value={formData.novoVencimento}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Início da renovação</label>

            <input
              type="date"
              name="novaDataInicio"
              className={styles.inputForm}
              value={formData.novaDataInicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Fim da renovação</label>

            <input
              type="date"
              name="novaDataFim"
              className={styles.inputForm}
              value={formData.novaDataFim}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Cobrança automática</label>

            <select
              name="cobrancaAutomatica"
              className={styles.selectForm}
              value={formData.cobrancaAutomatica}
              onChange={handleChange}
            >
              <option>Sim</option>
              <option>Não</option>
            </select>
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Reajuste</label>

            <select
              name="reajuste"
              className={styles.selectForm}
              value={formData.reajuste}
              onChange={handleChange}
            >
              <option>Anual</option>
              <option>Semestral</option>
              <option>Sem reajuste</option>
            </select>
          </div>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Observações da renovação</label>

            <textarea
              name="observacoes"
              className={styles.textareaForm}
              placeholder="Ex: Reajuste aplicado conforme acordo com o inquilino."
              value={formData.observacoes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.areaBotoes}>
          <button
            type="button"
            className={styles.botaoVoltar}
            onClick={() => navigate(`/contratos/${id}`)}
          >
            Cancelar
          </button>

          <button type="submit" className={styles.botaoSalvar}>
            Confirmar renovação
          </button>
        </div>
      </form>
    </div>
  );
}