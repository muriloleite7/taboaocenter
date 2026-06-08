import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { inquilinosMock } from "../data/inquilinosMock";
import {
  calcularMultaAutomatica,
  calcularSubtotal,
  cobrancasMock,
  formatarMoeda,
} from "../data/cobrancasMock";
import styles from "../style/editarCobranca.module.css";

const COBRANCAS_STORAGE_KEY = "@TaboaoCenter:cobrancas";
const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";

function dataHojeInput() {
  return new Date().toISOString().slice(0, 10);
}

export default function EditarCobranca() {
  const { id } = useParams();
  const navigate = useNavigate();

  const dadosIniciais = {
    nome: "",
    cpf: "",
    imovel: "",
    inquilinoId: "",
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

    plataformaPagamento: "Asaas",
    statusAsaas: "Aguardando geração",
    linkPagamento: "",
    pixCopiaCola: "",
    boletoLinhaDigitavel: "",
    boletoUrl: "",
    dataEnvioWhatsapp: "",
  };

  const [loading, setLoading] = useState(true);
  const [existeDados, setExisteDados] = useState(true);
  const [formData, setFormData] = useState(dadosIniciais);

  const carregarCobrancas = () => {
    const salvas = localStorage.getItem(COBRANCAS_STORAGE_KEY);

    if (salvas) return JSON.parse(salvas);

    localStorage.setItem(COBRANCAS_STORAGE_KEY, JSON.stringify(cobrancasMock));
    return cobrancasMock;
  };

  const carregarInquilinos = () => {
    const salvos = localStorage.getItem(INQUILINOS_STORAGE_KEY);

    if (salvos) return JSON.parse(salvos);

    localStorage.setItem(INQUILINOS_STORAGE_KEY, JSON.stringify(inquilinosMock));
    return inquilinosMock;
  };

  useEffect(() => {
    const listaCobrancas = carregarCobrancas();
    const listaInquilinos = carregarInquilinos();

    const cobrancaEncontrada = listaCobrancas.find(
      (cobranca: any) => String(cobranca.id) === String(id)
    );

    if (!cobrancaEncontrada) {
      setExisteDados(false);
      setLoading(false);
      return;
    }

    const inquilinoEncontrado = listaInquilinos.find(
      (inquilino: any) =>
        String(inquilino.id) === String(cobrancaEncontrada.inquilinoId)
    );

    setFormData({
      ...dadosIniciais,

      nome: inquilinoEncontrado?.nome || "",
      cpf: inquilinoEncontrado?.cpf || "",
      imovel: inquilinoEncontrado?.imovel || "",
      inquilinoId: cobrancaEncontrada.inquilinoId || "",

      referencia: cobrancaEncontrada.referencia || "",
      aluguel: String(cobrancaEncontrada.aluguel ?? ""),
      agua: String(cobrancaEncontrada.agua ?? ""),
      luz: String(cobrancaEncontrada.luz ?? ""),
      iptu: String(cobrancaEncontrada.iptu ?? ""),
      vencimento: cobrancaEncontrada.vencimento || "",
      status: cobrancaEncontrada.status || "Pendente",
      formaPagamento:
        cobrancaEncontrada.formaPagamento || "Aguardando pagamento",
      dataPagamento: cobrancaEncontrada.dataPagamento || "",
      origemPagamento: cobrancaEncontrada.origemPagamento || "Automático",
      observacao: cobrancaEncontrada.observacao || "",

      plataformaPagamento: cobrancaEncontrada.plataformaPagamento || "Asaas",
      statusAsaas: cobrancaEncontrada.statusAsaas || "Aguardando geração",
      linkPagamento: cobrancaEncontrada.linkPagamento || "",
      pixCopiaCola: cobrancaEncontrada.pixCopiaCola || "",
      boletoLinhaDigitavel: cobrancaEncontrada.boletoLinhaDigitavel || "",
      boletoUrl: cobrancaEncontrada.boletoUrl || "",
      dataEnvioWhatsapp: cobrancaEncontrada.dataEnvioWhatsapp || "",
    });

    setLoading(false);
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "status") {
      setFormData((prev) => ({
        ...prev,
        status: value,
        dataPagamento:
          value === "Paga" && !prev.dataPagamento
            ? dataHojeInput()
            : prev.dataPagamento,
        formaPagamento:
          value === "Paga" && prev.formaPagamento === "Aguardando pagamento"
            ? "Pix"
            : prev.formaPagamento,
      }));

      return;
    }

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
      dataPagamento:
        origem === "Manual" && prev.status === "Paga" && !prev.dataPagamento
          ? dataHojeInput()
          : origem === "Manual"
            ? prev.dataPagamento
            : prev.dataPagamento,
    }));
  };

  const handleCopiar = (texto: string, mensagemSucesso: string) => {
    if (!texto) {
      alert("Ainda não existe informação para copiar.");
      return;
    }

    navigator.clipboard
      .writeText(texto)
      .then(() => alert(mensagemSucesso))
      .catch(() => alert(texto));
  };

  const subtotal = calcularSubtotal(formData);
  const multaAutomatica = calcularMultaAutomatica(formData.status, subtotal);
  const total = subtotal + multaAutomatica;

  const handleSalvar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const listaCobrancas = carregarCobrancas();

    const cobrancasAtualizadas = listaCobrancas.map((cobranca: any) => {
      if (String(cobranca.id) !== String(id)) return cobranca;

      return {
        ...cobranca,
        referencia: formData.referencia,
        aluguel: Number(formData.aluguel) || 0,
        agua: Number(formData.agua) || 0,
        luz: Number(formData.luz) || 0,
        iptu: Number(formData.iptu) || 0,
        vencimento: formData.vencimento,
        status: formData.status,
        formaPagamento: formData.formaPagamento,
        dataPagamento:
          formData.status === "Paga" && !formData.dataPagamento
            ? dataHojeInput()
            : formData.dataPagamento,
        origemPagamento: formData.origemPagamento,
        observacao: formData.observacao,

        plataformaPagamento: formData.plataformaPagamento,
        statusAsaas: formData.statusAsaas,
        linkPagamento: formData.linkPagamento,
        pixCopiaCola: formData.pixCopiaCola,
        boletoLinhaDigitavel: formData.boletoLinhaDigitavel,
        boletoUrl: formData.boletoUrl,
        dataEnvioWhatsapp: formData.dataEnvioWhatsapp,

        subtotal,
        multaAutomatica,
        total,
      };
    });

    localStorage.setItem(
      COBRANCAS_STORAGE_KEY,
      JSON.stringify(cobrancasAtualizadas)
    );

    alert("Cobrança atualizada com sucesso!");
    navigate("/cobrancas");
  };

  if (loading) {
    return (
      <div className={styles.containerEditar}>
        <h1>Carregando dados...</h1>
      </div>
    );
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
          pagamentos feitos por fora.
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
                className={`${styles.inputForm} ${styles.inputBloqueado}`}
                value={formData.nome}
                disabled
              />
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>CPF</label>
              <input
                type="text"
                className={`${styles.inputForm} ${styles.inputBloqueado}`}
                value={formData.cpf}
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
                className={`${styles.inputForm} ${styles.inputBloqueado}`}
                value={formData.aluguel}
                disabled
              />
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
          <h2 className={styles.secaoTitulo}>Pagamento automático</h2>

          <div className={styles.asaasInfo}>
            <div>
              <h3>Integração com Asaas</h3>
              <p>
                Futuramente, o back-end vai gerar Pix, boleto ou link de
                pagamento pelo Asaas. Quando o inquilino pagar, o webhook
                atualizará esta cobrança automaticamente.
              </p>
            </div>

            <div className={styles.asaasStatus}>
              <span>Plataforma</span>
              <strong>{formData.plataformaPagamento}</strong>
            </div>

            <div className={styles.asaasStatus}>
              <span>Status no Asaas</span>
              <strong>{formData.statusAsaas}</strong>
            </div>
          </div>

          <div className={styles.gridCampos}>
            <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
              <label className={styles.labelForm}>Link de pagamento</label>

              <div className={styles.campoComBotao}>
                <input
                  type="text"
                  name="linkPagamento"
                  className={styles.inputForm}
                  value={formData.linkPagamento}
                  onChange={handleChange}
                  placeholder="Será preenchido pelo back-end"
                />

                <button
                  type="button"
                  className={styles.botaoCopiar}
                  onClick={() =>
                    handleCopiar(
                      formData.linkPagamento,
                      "Link de pagamento copiado."
                    )
                  }
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
              <label className={styles.labelForm}>Pix copia e cola</label>

              <div className={styles.campoComBotao}>
                <input
                  type="text"
                  name="pixCopiaCola"
                  className={styles.inputForm}
                  value={formData.pixCopiaCola}
                  onChange={handleChange}
                  placeholder="Será preenchido pelo Asaas"
                />

                <button
                  type="button"
                  className={styles.botaoCopiar}
                  onClick={() =>
                    handleCopiar(formData.pixCopiaCola, "Pix copiado.")
                  }
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
              <label className={styles.labelForm}>Linha digitável</label>

              <div className={styles.campoComBotao}>
                <input
                  type="text"
                  name="boletoLinhaDigitavel"
                  className={styles.inputForm}
                  value={formData.boletoLinhaDigitavel}
                  onChange={handleChange}
                  placeholder="Será preenchida pelo Asaas"
                />

                <button
                  type="button"
                  className={styles.botaoCopiar}
                  onClick={() =>
                    handleCopiar(
                      formData.boletoLinhaDigitavel,
                      "Linha digitável copiada."
                    )
                  }
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>URL do boleto</label>
              <input
                type="text"
                name="boletoUrl"
                className={styles.inputForm}
                value={formData.boletoUrl}
                onChange={handleChange}
                placeholder="Link do boleto"
              />
            </div>

            <div className={styles.campoGrupo}>
              <label className={styles.labelForm}>Envio no WhatsApp</label>
              <input
                type="date"
                name="dataEnvioWhatsapp"
                className={styles.inputForm}
                value={formData.dataEnvioWhatsapp}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.secaoTitulo}>Pagamento</h2>

          <div className={styles.pagamentoInfo}>
            <div className={styles.pagamentoTexto}>
              <h3>Confirmação automática</h3>
              <p>
                Pagamentos por Pix ou boleto devem ser confirmados pelo sistema.
                Use registro manual apenas para pagamentos por fora.
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
                    <option value="Aguardando pagamento">
                      Aguardando pagamento
                    </option>
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
            onClick={() => navigate("/cobrancas")}
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