import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { inquilinosMock, type InquilinoMock } from "../data/inquilinosMock";
import { formatarMoeda } from "../data/cobrancasMock";
import styles from "../style/lancarDespesas.module.css";

export default function LancarDespesas() {
  const [busca, setBusca] = useState("");
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const [formData, setFormData] = useState({
    inquilino: "",
    cpf: "",
    imovel: "",
    referencia: "Maio/2026",
    vencimento: "",
    aluguel: "",
    agua: "",
    luz: "",
    iptu: "",
    observacao: "",
  });

  const resultadosBusca = inquilinosMock.filter((inquilino) => {
    const textoBusca = `${inquilino.nome} ${inquilino.cpf} ${inquilino.imovel}`;

    return textoBusca.toLowerCase().includes(busca.toLowerCase());
  });

  const selecionarInquilino = (inquilino: InquilinoMock) => {
    setBusca(`${inquilino.nome} - ${inquilino.imovel}`);
    setMostrarResultados(false);

    setFormData((prev) => ({
      ...prev,
      inquilino: inquilino.nome,
      cpf: inquilino.cpf,
      imovel: inquilino.imovel,
      aluguel: inquilino.aluguel,
      vencimento: inquilino.vencimentoData,
    }));
  };

  const handleBuscaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value);
    setMostrarResultados(true);

    if (e.target.value === "") {
      setFormData((prev) => ({
        ...prev,
        inquilino: "",
        cpf: "",
        imovel: "",
        aluguel: "",
        vencimento: "",
      }));
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const aluguel = Number(formData.aluguel) || 0;
  const agua = Number(formData.agua) || 0;
  const luz = Number(formData.luz) || 0;
  const iptu = Number(formData.iptu) || 0;
  const multa = 0;

  const subtotal = aluguel + agua + luz + iptu;
  const totalPrevisto = subtotal + multa;

  const handleSalvar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dadosParaEnviar = {
      ...formData,
      subtotal,
      multa,
      totalPrevisto,
      status: "Pendente",
    };

    console.log("Despesas lançadas:", dadosParaEnviar);
  };

  return (
    <div className={styles.lancarDespesas}>
      <div className={styles.headerDespesas}>
        <div>
          <h1 className={styles.tituloDespesas}>Lançar despesas</h1>
          <p className={styles.subtituloDespesas}>
            Informe as despesas variáveis do mês para compor a cobrança do
            inquilino.
          </p>
        </div>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Selecionar cobrança</h2>

          <div className={styles.gridTres}>
            <div className={styles.campoGrupo}>
              <label>Buscar inquilino</label>

              <div className={styles.buscaWrapper}>
                <input
                  type="text"
                  className={styles.inputForm}
                  placeholder="Digite nome, CPF ou imóvel..."
                  value={busca}
                  onChange={handleBuscaChange}
                  onFocus={() => setMostrarResultados(true)}
                />

                {mostrarResultados && busca && (
                  <div className={styles.listaResultados}>
                    {resultadosBusca.length > 0 ? (
                      resultadosBusca.map((inquilino) => (
                        <button
                          type="button"
                          key={inquilino.id}
                          className={styles.resultadoItem}
                          onClick={() => selecionarInquilino(inquilino)}
                        >
                          <h3>{inquilino.nome}</h3>
                          <span>
                            {inquilino.cpf} • {inquilino.imovel}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className={styles.semResultado}>
                        Nenhum inquilino encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.campoGrupo}>
              <label>Referência</label>

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
              <label>Vencimento</label>

              <input
                type="date"
                name="vencimento"
                className={styles.inputForm}
                value={formData.vencimento}
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.inquilino && (
            <div className={styles.inquilinoSelecionado}>
              <div>
                <span>Inquilino selecionado</span>
                <h3>{formData.inquilino}</h3>
              </div>

              <div>
                <span>CPF</span>
                <h3>{formData.cpf}</h3>
              </div>

              <div>
                <span>Imóvel</span>
                <h3>{formData.imovel}</h3>
              </div>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Valores do mês</h2>

          <div className={styles.gridQuatro}>
            <div className={styles.campoGrupo}>
              <label>Aluguel base (R$)</label>

              <input
                type="number"
                name="aluguel"
                className={`${styles.inputForm} ${styles.inputDisabled}`}
                value={formData.aluguel}
                disabled
              />
            </div>

            <div className={styles.campoGrupo}>
              <label>Água (R$)</label>

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
              <label>Luz (R$)</label>

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
              <label>IPTU (R$)</label>

              <input
                type="number"
                name="iptu"
                className={styles.inputForm}
                value={formData.iptu}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className={styles.campoGrupo}>
            <label>Observação</label>

            <textarea
              name="observacao"
              className={styles.textareaForm}
              placeholder="Ex: conta de água recebida em 08/05"
              value={formData.observacao}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Resumo da cobrança</h2>

          <div className={styles.resumoGrid}>
            <div className={styles.resumoCard}>
              <span>Subtotal</span>
              <h3>{formatarMoeda(subtotal)}</h3>
            </div>

            <div className={styles.resumoCard}>
              <span>Multa</span>
              <h3>{formatarMoeda(multa)}</h3>
            </div>

            <div className={styles.resumoCard}>
              <span>Total previsto</span>
              <h3>{formatarMoeda(totalPrevisto)}</h3>
            </div>

            <div className={styles.resumoCard}>
              <span>Status</span>
              <h3 className={styles.statusPendente}>Pendente</h3>
            </div>
          </div>
        </section>

        <div className={styles.areaBotoes}>
          <button
            type="button"
            className={styles.botaoCancelar}
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>

          <button type="submit" className={styles.botaoSalvar}>
            Salvar despesas
          </button>
        </div>
      </form>
    </div>
  );
}