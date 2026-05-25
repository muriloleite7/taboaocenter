import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "../style/editarInquilino.module.css";

export default function RenovarContrato() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nomeInquilino: "",
    imovel: "",
    fimContratoAtual: "",
    valorAtual: "",
    novoValor: "",
    novoVencimento: "",
    novaDataInicio: "",
    novaDataFim: "",
    observacoes: "",
  });

  useEffect(() => {
    // Busca dados originais para preencher os campos bloqueados (mockado)
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        nomeInquilino: "João Silva",
        imovel: "Apto 101 - Edifício Horizonte",
        fimContratoAtual: "2026-05-10",
        valorAtual: "1500",
        novaDataInicio: "2026-05-11",
        novoVencimento: "10",
      }));

      setLoading(false);
    }, 800);
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalvar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const contratosSalvos = JSON.parse(
      localStorage.getItem("contratos_db") || "{}"
    );

    contratosSalvos[id!] = {
      ...contratosSalvos[id!],
      id,
      inquilino: formData.nomeInquilino,
      imovel: formData.imovel,
      aluguel: formData.novoValor,
      vencimento: formData.novoVencimento,
      dataInicio: formData.novaDataInicio,
      dataFim: formData.novaDataFim,
      observacoes: formData.observacoes,
      status: "Ativo",
    };

    localStorage.setItem("contratos_db", JSON.stringify(contratosSalvos));

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

  return (
    <div className={styles.containerEditar}>
      <div className={styles.headerEditar}>
        <div>
          <Link to={`/contratos/${id}`} className={styles.voltarLink}>
            ← Voltar para o contrato
          </Link>

          <h1 className={styles.tituloEditar}>Renovar Contrato #{id}</h1>

          <p className={styles.subtituloEditar}>
            A renovação estende o prazo do contrato e permite reajustar valores.
          </p>
        </div>
      </div>

      <div className={styles.avisoEdicao}>
        <h3>Regra de Renovação</h3>

        <p>
          Os dados do inquilino e imóvel não podem ser alterados nesta tela. Para
          mudar o titular, encerre este contrato e crie um novo.
        </p>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
        <div className={styles.gridCampos}>
          <h2 className={styles.secaoTitulo}>Contrato Atual (Bloqueado)</h2>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Inquilino</label>

            <input
              type="text"
              className={`${styles.inputForm} ${styles.inputBloqueado}`}
              value={formData.nomeInquilino}
              disabled
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Imóvel</label>

            <input
              type="text"
              className={`${styles.inputForm} ${styles.inputBloqueado}`}
              value={formData.imovel}
              disabled
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Valor do aluguel atual</label>

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
              placeholder="Ex: 1650.00"
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

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Observações da renovação</label>

            <textarea
              name="observacoes"
              className={styles.textareaForm}
              placeholder="Ex: Reajuste baseado no IGPM..."
              value={formData.observacoes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.areaBotoes}>
          <button
            type="button"
            className={styles.botaoVoltar}
            onClick={() => navigate(-1)}
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