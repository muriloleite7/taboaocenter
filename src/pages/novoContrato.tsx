import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style/novoInquilino.module.css";

export default function NovoContrato() {
  const navigate = useNavigate();

  const [inquilinos, setInquilinos] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    inquilinoId: "",
    imovel: "",
    valorAluguel: "",
    valorCondominio: "",
    diaVencimento: "",
    dataInicio: "",
    dataFim: "",
    tipoGarantia: "caucao",
    valorGarantia: "",
    observacoes: "",
  });

  useEffect(() => {
    const inquilinosSalvos = localStorage.getItem("@TaboaoCenter:inquilinos");
    if (inquilinosSalvos) {
      setInquilinos(JSON.parse(inquilinosSalvos));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalvar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inquilinoSelecionado = inquilinos.find(
      (i) => i.id === formData.inquilinoId,
    );

    if (!formData.inquilinoId) {
      alert("Por favor, selecione um inquilino.");
      return;
    }

    const novoContrato = {
      id: Math.random().toString(36).substring(2, 11),
      inquilinoNome: inquilinoSelecionado
        ? inquilinoSelecionado.nome
        : "Desconhecido",
      inquilinoId: formData.inquilinoId,
      imovel: formData.imovel,
      valorAluguel: Number(formData.valorAluguel),
      valorCondominio: Number(formData.valorCondominio || 0),
      diaVencimento: formData.diaVencimento,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      tipoGarantia: formData.tipoGarantia,
      valorGarantia: Number(formData.valorGarantia || 0),
      status: "Ativo",
      dataCriacao: new Date().toISOString(),
    };

    const contratosAtuais = JSON.parse(
      localStorage.getItem("@TaboaoCenter:contratos") || "[]",
    );
    const novosContratos = [novoContrato, ...contratosAtuais];
    localStorage.setItem(
      "@TaboaoCenter:contratos",
      JSON.stringify(novosContratos),
    );

    alert("Contrato gerado com sucesso!");
    navigate("/contratos");
  };

  return (
    <div className={styles.containerNovo}>
      <div className={styles.headerHome}>
        <div>
          <h1 className={styles.tituloHome}>Novo Contrato</h1>
          <p className={styles.subtituloHome}>
            Vincule um inquilino a um imóvel e defina os termos vigentes.
          </p>
        </div>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
        <div className={styles.gridCampos}>
          <h3 className={styles.secaoTitulo}>Partes do Contrato</h3>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Inquilino Titular *</label>
            <select
              name="inquilinoId"
              className={styles.selectForm}
              value={formData.inquilinoId}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecione um inquilino cadastrado --</option>
              {inquilinos.map((inquilino) => (
                <option key={inquilino.id} value={inquilino.id}>
                  {inquilino.nome} ({inquilino.cpf || "Sem CPF"})
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Imóvel / Unidade *</label>
            <input
              type="text"
              name="imovel"
              className={styles.inputForm}
              placeholder="Ex: Sala 104 - Bloco A"
              value={formData.imovel}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.gridCampos}>
          <h3 className={styles.secaoTitulo}>Valores e Prazos</h3>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Valor do Aluguel *</label>
            <input
              type="number"
              name="valorAluguel"
              className={styles.inputForm}
              placeholder="Ex: 1500"
              value={formData.valorAluguel}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Condomínio / Taxas</label>
            <input
              type="number"
              name="valorCondominio"
              className={styles.inputForm}
              placeholder="Ex: 350"
              value={formData.valorCondominio}
              onChange={handleChange}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Dia do Vencimento *</label>
            <input
              type="number"
              name="diaVencimento"
              className={styles.inputForm}
              placeholder="Ex: 10"
              min="1"
              max="31"
              value={formData.diaVencimento}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.campoGrupo}></div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Data de Início *</label>
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
            <label className={styles.labelForm}>Data de Término *</label>
            <input
              type="date"
              name="dataFim"
              className={styles.inputForm}
              value={formData.dataFim}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.despesasCard}>
          <h3 className={styles.secaoTitulo}>Garantia e Condições</h3>
          <p className={styles.textoAjuda}>
            Defina o modelo de garantia locatícia escolhido para este contrato.
          </p>

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
              <option value="caucao">Depósito Caução</option>
              <option value="fiador">Fiador</option>
              <option value="seguro_fianca">Seguro Fiança</option>
              <option value="sem_garantia">Sem Garantia</option>
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
            <label className={styles.labelForm}>
              Observações Internas (Opcional)
            </label>
            <input
              type="text"
              name="observacoes"
              className={styles.inputForm}
              placeholder="Anotações sobre vistoria, chaves, etc."
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
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>

          <button type="submit" className={styles.botaoSalvar}>
            Emitir Contrato
          </button>
        </div>
      </form>
    </div>
  );
}
