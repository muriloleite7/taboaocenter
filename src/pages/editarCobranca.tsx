import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
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

  const cobrancaEncontrada = getCobrancaById(id);
  const inquilino = getInquilinoById(cobrancaEncontrada?.inquilinoId);

  const [formData, setFormData] = useState({
    nome: inquilino?.nome || "",
    cpf: inquilino?.cpf || "",
    imovel: inquilino?.imovel || "",
    referencia: cobrancaEncontrada?.referencia || "",
    aluguel: cobrancaEncontrada?.aluguel || "",
    agua: cobrancaEncontrada?.agua || "",
    luz: cobrancaEncontrada?.luz || "",
    iptu: cobrancaEncontrada?.iptu || "",
    vencimento: cobrancaEncontrada?.vencimento || "",
    status: cobrancaEncontrada?.status || "Pendente",
    formaPagamento: cobrancaEncontrada?.formaPagamento || "Aguardando pagamento",
    dataPagamento: cobrancaEncontrada?.dataPagamento || "",
    origemPagamento: cobrancaEncontrada?.origemPagamento || "Automático",
    observacao: cobrancaEncontrada?.observacao || "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    const dadosAtualizados = {
      id,
      ...formData,
      subtotal,
      multaAutomatica,
      total,
    };

    console.log("Cobrança atualizada:", dadosAtualizados);
  };

  if (!cobrancaEncontrada || !inquilino) {
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
                <option>Maio/2026</option>
                <option>Junho/2026</option>
                <option>Julho/2026</option>
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
                Valor vindo do contrato. Para alterar o aluguel futuro, edite o
                inquilino/contrato.
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
                <option>Pendente</option>
                <option>Paga</option>
                <option>Atrasada</option>
                <option>Despesas pendentes</option>
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
                ser usado apenas para pagamentos por fora ou ajustes internos.
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
                <option>Automático</option>
                <option>Manual</option>
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
                    <option>Aguardando pagamento</option>
                    <option>Pix</option>
                    <option>Boleto</option>
                  </>
                ) : (
                  <>
                    <option>Dinheiro</option>
                    <option>Transferência</option>
                    <option>Outro</option>
                  </>
                )}
              </select>

              {formData.origemPagamento === "Automático" && (
                <span className={styles.campoAjuda}>
                  Em pagamentos automáticos, a forma será preenchida pelo
                  sistema após a confirmação.
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