import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { contratosMock } from "../data/contratosMock";
import { inquilinosMock } from "../data/inquilinosMock";
import styles from "../style/editarInquilino.module.css";

const CONTRATOS_STORAGE_KEY = "@TaboaoCenter:contratos";
const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";

export default function EditarContrato() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [existeDados, setExisteDados] = useState(true);

  const [formData, setFormData] = useState({
    inquilinoId: "",
    inquilinoNome: "",
    imovel: "",
    tipoContrato: "Residencial",
    valorAluguel: "",
    valorCondominio: "",
    diaVencimento: "",
    dataInicio: "",
    dataFim: "",
    tipoGarantia: "caucao",
    valorGarantia: "",
    cobrancaAutomatica: "Sim",
    reajuste: "Anual",
    status: "Ativo",
    observacoes: "",
  });

  const carregarContratos = () => {
    const contratosSalvos = localStorage.getItem(CONTRATOS_STORAGE_KEY);

    if (contratosSalvos) {
      return JSON.parse(contratosSalvos);
    }

    localStorage.setItem(CONTRATOS_STORAGE_KEY, JSON.stringify(contratosMock));
    return contratosMock;
  };

  const carregarInquilinos = () => {
    const inquilinosSalvos = localStorage.getItem(INQUILINOS_STORAGE_KEY);

    if (inquilinosSalvos) {
      return JSON.parse(inquilinosSalvos);
    }

    localStorage.setItem(INQUILINOS_STORAGE_KEY, JSON.stringify(inquilinosMock));
    return inquilinosMock;
  };

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

    setFormData({
      inquilinoId: contratoEncontrado.inquilinoId || "",
      inquilinoNome:
        inquilinoEncontrado?.nome ||
        contratoEncontrado.inquilinoNome ||
        "Inquilino não encontrado",

      imovel:
        contratoEncontrado.imovel ||
        inquilinoEncontrado?.imovel ||
        "",

      tipoContrato: contratoEncontrado.tipoContrato || "Residencial",

      valorAluguel: String(
        contratoEncontrado.valorAluguel ||
          contratoEncontrado.aluguel ||
          ""
      ),

      valorCondominio: String(contratoEncontrado.valorCondominio || ""),

      diaVencimento: String(
        contratoEncontrado.diaVencimento ||
          contratoEncontrado.vencimento ||
          ""
      ),

      dataInicio:
        contratoEncontrado.dataInicio ||
        contratoEncontrado.inicio ||
        "",

      dataFim:
        contratoEncontrado.dataFim ||
        contratoEncontrado.fim ||
        "",

      tipoGarantia: contratoEncontrado.tipoGarantia || "caucao",
      valorGarantia: String(contratoEncontrado.valorGarantia || ""),

      cobrancaAutomatica:
        contratoEncontrado.cobrancaAutomatica === false ? "Não" : "Sim",

      reajuste: contratoEncontrado.reajuste || "Anual",
      status: contratoEncontrado.status || "Ativo",
      observacoes: contratoEncontrado.observacoes || "",
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

    if (!formData.valorAluguel || Number(formData.valorAluguel) <= 0) {
      alert("Informe um valor de aluguel válido.");
      return;
    }

    if (
      !formData.diaVencimento ||
      Number(formData.diaVencimento) < 1 ||
      Number(formData.diaVencimento) > 31
    ) {
      alert("Informe um dia de vencimento entre 1 e 31.");
      return;
    }

    if (!formData.dataInicio || !formData.dataFim) {
      alert("Informe a data de início e término do contrato.");
      return;
    }

    const listaContratos = carregarContratos();

    const contratosAtualizados = listaContratos.map((contrato: any) => {
      if (String(contrato.id) !== String(id)) {
        return contrato;
      }

      return {
        ...contrato,

        inquilinoId: formData.inquilinoId,
        inquilinoNome: formData.inquilinoNome,

        imovel: formData.imovel,
        tipoContrato: formData.tipoContrato,

        valorAluguel: Number(formData.valorAluguel),
        aluguel: Number(formData.valorAluguel),

        valorCondominio: Number(formData.valorCondominio || 0),

        diaVencimento: Number(formData.diaVencimento),
        vencimento: Number(formData.diaVencimento),

        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        inicio: formData.dataInicio,
        fim: formData.dataFim,

        tipoGarantia: formData.tipoGarantia,
        valorGarantia: Number(formData.valorGarantia || 0),

        cobrancaAutomatica: formData.cobrancaAutomatica === "Sim",
        reajuste: formData.reajuste,

        status: formData.status,
        observacoes: formData.observacoes,

        dataAtualizacao: new Date().toISOString(),
      };
    });

    localStorage.setItem(
      CONTRATOS_STORAGE_KEY,
      JSON.stringify(contratosAtualizados)
    );

    alert("Contrato atualizado com sucesso!");
    navigate("/contratos");
  };

  if (loading) {
    return (
      <div className={styles.containerEditar}>
        <h1>Carregando contrato...</h1>
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
          <Link to="/contratos" className={styles.voltarLink}>
            ← Voltar para contratos
          </Link>

          <h1 className={styles.tituloEditar}>Editar Contrato</h1>

          <p className={styles.subtituloEditar}>
            Ajuste as condições vigentes deste contrato.
          </p>
        </div>
      </div>

      <div className={styles.avisoEdicao}>
        <h3>Atenção</h3>

        <p>
          Alterações no valor do aluguel, vencimento ou status impactam as
          próximas cobranças geradas para este contrato.
        </p>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
        <div className={styles.gridCampos}>
          <h2 className={styles.secaoTitulo}>Informações principais</h2>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Inquilino vinculado</label>

            <input
              type="text"
              className={`${styles.inputForm} ${styles.inputBloqueado}`}
              value={formData.inquilinoNome}
              disabled
            />
          </div>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Imóvel / Unidade</label>

            <input
              type="text"
              name="imovel"
              className={styles.inputForm}
              value={formData.imovel}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Tipo de contrato</label>

            <select
              name="tipoContrato"
              className={styles.selectForm}
              value={formData.tipoContrato}
              onChange={handleChange}
            >
              <option>Residencial</option>
              <option>Comercial</option>
            </select>
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Status</label>

            <select
              name="status"
              className={styles.selectForm}
              value={formData.status}
              onChange={handleChange}
            >
              <option>Ativo</option>
              <option>Vence em breve</option>
              <option>Renovação pendente</option>
              <option>Encerrado</option>
            </select>
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Valor do aluguel</label>

            <input
              type="number"
              name="valorAluguel"
              className={styles.inputForm}
              value={formData.valorAluguel}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Condomínio / Taxas</label>

            <input
              type="number"
              name="valorCondominio"
              className={styles.inputForm}
              value={formData.valorCondominio}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Dia do vencimento</label>

            <input
              type="number"
              name="diaVencimento"
              className={styles.inputForm}
              min="1"
              max="31"
              value={formData.diaVencimento}
              onChange={handleChange}
            />
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

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Início do contrato</label>

            <input
              type="date"
              name="dataInicio"
              className={styles.inputForm}
              value={formData.dataInicio}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Fim do contrato</label>

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
          <h2 className={styles.secaoTitulo}>Cobrança e garantia</h2>

          <p className={styles.textoAjuda}>
            Configure se o contrato deve continuar gerando cobranças e qual
            garantia está vinculada.
          </p>

          <div className={styles.despesaLinha}>
            <div>
              <h1 className={styles.despesaTitulo}>Cobrança automática</h1>
              <span>Se desligado, o contrato não deve gerar cobranças futuras.</span>
            </div>

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

          <div className={styles.despesaLinha}>
            <div>
              <h1 className={styles.despesaTitulo}>Garantia</h1>
              <span>Tipo de segurança do contrato</span>
            </div>

            <select
              name="tipoGarantia"
              className={styles.selectForm}
              value={formData.tipoGarantia}
              onChange={handleChange}
            >
              <option value="caucao">Depósito caução</option>
              <option value="fiador">Fiador</option>
              <option value="seguro_fianca">Seguro fiança</option>
              <option value="sem_garantia">Sem garantia</option>
            </select>

            {formData.tipoGarantia !== "sem_garantia" && (
              <input
                type="number"
                name="valorGarantia"
                className={styles.inputDespesa}
                placeholder="Valor (R$)"
                value={formData.valorGarantia}
                onChange={handleChange}
              />
            )}
          </div>

          <div style={{ marginTop: "24px" }}>
            <label className={styles.labelForm}>Observações internas</label>

            <input
              type="text"
              name="observacoes"
              className={styles.inputForm}
              placeholder="Anotações sobre contrato, vistoria, chaves, reajuste, etc."
              value={formData.observacoes}
              onChange={handleChange}
              style={{ marginTop: "8px" }}
            />
          </div>
        </div>

        <div className={styles.areaBotoes}>
          <button
            type="button"
            className={styles.botaoVoltar}
            onClick={() => navigate("/contratos")}
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