import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getInquilinoById } from "../data/inquilinosMock";
import {
  calcularMultaAutomatica,
  calcularSubtotal,
  formatarMoeda,
  getCobrancaById,
} from "../data/cobrancasMock";
import styles from "../style/editarCobranca.module.css";

export default function EditarCobranca() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [existeDados, setExisteDados] = useState(true);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    imovel: "",
    referencia: "",
    aluguel: "",
    agua: "",
    luz: "",
    iptu: "",
    vencimento: "",
    status: "Pendente",
    formaPagamento: "Aguardando pagamento",
    dataPagamento: "",
    origemPagamento: "Automático",
    observacao: "",
  });

  useEffect(() => {
    const cobrancasSalvas = JSON.parse(localStorage.getItem("cobrancas_db") || "{}");

    if (cobrancasSalvas[id!]) {
      setFormData(cobrancasSalvas[id!]);
    } else {
      const cobrancaMock = getCobrancaById(id);
      const inquilinoMock = getInquilinoById(cobrancaMock?.inquilinoId);

      if (cobrancaMock && inquilinoMock) {
        setFormData({
          nome: inquilinoMock.nome || "",
          cpf: inquilinoMock.cpf || "",
          imovel: inquilinoMock.imovel || "",
          referencia: cobrancaMock.referencia || "",
          aluguel: cobrancaMock.aluguel || "",
          agua: cobrancaMock.agua || "",
          luz: cobrancaMock.luz || "",
          iptu: cobrancaMock.iptu || "",
          vencimento: cobrancaMock.vencimento || "",
          status: cobrancaMock.status || "Pendente",
          formaPagamento: cobrancaMock.formaPagamento || "Aguardando pagamento",
          dataPagamento: cobrancaMock.dataPagamento || "",
          origemPagamento: cobrancaMock.origemPagamento || "Automático",
          observacao: cobrancaMock.observacao || "",
        });
      } else {
        setExisteDados(false);
      }
    }
    setLoading(false);
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrigemPagamentoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const origem = e.target.value;
    setFormData((prev) => ({
      ...prev,
      origemPagamento: origem,
      formaPagamento: origem === "Manual" ? "Dinheiro" : "Aguardando pagamento",
      dataPagamento: origem === "Manual" ? prev.dataPagamento : "",
    }));
  };

  const subtotal = calcularSubtotal(formData);
  const multaAutomatica = calcularMultaAutomatica(formData.status, subtotal);
  const total = subtotal + multaAutomatica;

  const handleSalvar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cobrancasSalvas = JSON.parse(localStorage.getItem("cobrancas_db") || "{}");
    
    cobrancasSalvas[id!] = {
      ...formData,
      id,
      subtotal,
      multaAutomatica,
      total,
    };

    localStorage.setItem("cobrancas_db", JSON.stringify(cobrancasSalvas));

    alert("Cobrança atualizada com sucesso!");
    navigate("/cobrancas");
  };

  if (loading) {
    return <div className={styles.containerEditar}><h1>Carregando dados...</h1></div>;
  }

  if (!existeDados) {
    return (
      <div className={styles.containerEditar}>
        <h1>Cobrança não encontrada</h1>
        <Link to="/cobrancas" className={styles.voltarLink}>
          Voltar para cobranças
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.containerEditar}>
      <div className={styles.headerEditar}>
        <div>
          <Link to="/cobrancas" className={styles.voltarLink}>
            ← Voltar para cobranças
          </Link>
          <h1 className={styles.tituloEditar}>Editar Cobrança</h1>
          <p className={styles.subtituloEditar}>
            Atualize os valores, vencimento e status desta cobrança específica.
          </p>
        </div>
      </div>

      <div className={styles.avisoEdicao}>
        <h3>Atenção</h3>
        <p>
          Pix e boleto devem ser confirmados automaticamente pelo sistema. Use a
          edição manual apenas para corrigir valores, ajustar status ou registrar
          pagamentos feitos por fora, como dinheiro.
        </p>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
        <section className={styles.section}>
          <h2 className={styles.secaoTitulo}>Dados da cobrança</h2>

          <div className={styles.gridCampos}>
            <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
              <label className={styles.labelForm}>Inquilino</label>
              <input
                type="text"
                name="nome"
                className={`${styles.inputForm} ${styles.inputBloqueado}`}
                value={formData.nome}
                disabled
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
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Imóvel</label>
              <input
                type="text"
                name="imovel"
                className={`${styles.inputForm} ${styles.inputBloqueado}`}
                value={formData.imovel}
                disabled
              />
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Referência</label>
              <select
                name="referencia"
                className={styles.inputForm}
                value={formData.referencia}
                onChange={handleChange}
              >
                <option value="Maio/2026">Maio/2026</option>
                <option value="Junho/2026">Junho/2026</option>
                <option value="Julho/2026">Julho/2026</option>
              </select>
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Vencimento</label>
              <input
                type="date"
                name="vencimento"
                className={styles.inputForm}
                value={formData.vencimento}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.secaoTitulo}>Valores da cobrança</h2>

          <div className={styles.gridValores}>
            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Aluguel base</label>
              <input
                type="number"
                name="aluguel"
                className={`${styles.inputForm} ${styles.inputBloqueado}`}
                value={formData.aluguel}
                disabled
              />
              <span className={styles.campoAjuda}>
                Valor vindo do contrato. Para alterar o aluguel futuro, edite o inquilino/contrato.
              </span>
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Água</label>
              <input
                type="number"
                name="agua"
                className={styles.inputForm}
                value={formData.agua}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Luz</label>
              <input
                type="number"
                name="luz"
                className={styles.inputForm}
                value={formData.luz}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>IPTU</label>
              <input
                type="number"
                name="iptu"
                className={styles.inputForm}
                value={formData.iptu}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Status</label>
              <select
                name="status"
                className={styles.inputForm}
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pendente">Pendente</option>
                <option value="Paga">Paga</option>
                <option value="Atrasada">Atrasada</option>
                <option value="Despesas pendentes">Despesas pendentes</option>
              </select>
            </div>
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Observação</label>
            <textarea
              name="observacao"
              className={styles.textareaForm}
              value={formData.observacao}
              onChange={handleChange}
              placeholder="Adicione uma observação sobre esta cobrança..."
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.secaoTitulo}>Pagamento</h2>

          <div className={styles.pagamentoInfo}>
            <div className={styles.pagamentoTexto}>
              <h3>Confirmação automática</h3>
              <p>
                Quando o inquilino pagar por Pix ou boleto, o sistema deverá
                atualizar esta cobrança automaticamente. O registro manual deve
                ser usado apenas para pagamentos por fora ou adjustments internos.
              </p>
            </div>

            <div className={styles.pagamentoStatus}>
              <span>Origem atual</span>
              <h3>{formData.origemPagamento}</h3>
            </div>
          </div>

          <div className={styles.gridCampos}>
            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Origem do pagamento</label>
              <select
                name="origemPagamento"
                className={styles.inputForm}
                value={formData.origemPagamento}
                onChange={handleOrigemPagamentoChange}
              >
                <option value="Automático">Automático</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Forma de pagamento</label>
              <select
                name="formaPagamento"
                className={styles.inputForm}
                value={formData.formaPagamento}
                onChange={handleChange}
                disabled={formData.origemPagamento === "Automático"}
              >
                {formData.origemPagamento === "Automático" ? (
                  <>
                    <option value="Aguardando pagamento">Aguardando pagamento</option>
                    <option value="Pix">Pix</option>
                    <option value="Boleto">Boleto</option>
                  </>
                ) : (
                  <>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Outro">Outro</option>
                  </>
                )}
              </select>

              {formData.origemPagamento === "Automático" && (
                <span className={styles.campoAjuda}>
                  Em pagamentos automáticos, a forma será preenchida pelo sistema após a confirmação.
                </span>
              )}
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Data de pagamento</label>
              <input
                type="date"
                name="dataPagamento"
                className={styles.inputForm}
                value={formData.dataPagamento}
                onChange={handleChange}
                disabled={formData.origemPagamento === "Automático"}
              />
              {formData.origemPagamento === "Automático" && (
                <span className={styles.campoAjuda}>
                  A data será preenchida automaticamente após o pagamento.
                </span>
              )}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.secaoTitulo}>Resumo atualizado</h2>
          <div className={styles.resumoGrid}>
            <div className={styles.resumoCard}>
              <span>Subtotal</span>
              <h3>{formatarMoeda(subtotal)}</h3>
            </div>

            <div className={styles.resumoCard}>
              <span>Multa automática</span>
              <h3>{formatarMoeda(multaAutomatica)}</h3>
            </div>

            <div className={styles.resumoCard}>
              <span>Total</span>
              <h3>{formatarMoeda(total)}</h3>
            </div>

            <div className={styles.resumoCard}>
              <span>Status</span>
              <h3 className={styles.statusResumo}>{formData.status}</h3>
            </div>
          </div>
        </section>

        <div className={styles.areaBotoes}>
          <button
            type="button"
            className={styles.botaoVoltar}
            onClick={() => navigate(-1)}
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