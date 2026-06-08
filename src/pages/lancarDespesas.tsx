import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { inquilinosMock, type InquilinoMock } from "../data/inquilinosMock";
import { formatarMoeda, cobrancasMock } from "../data/cobrancasMock";
import styles from "../style/lancarDespesas.module.css";

const COBRANCAS_STORAGE_KEY = "@TaboaoCenter:cobrancas";
const INQUILINOS_STORAGE_KEY = "@TaboaoCenter:inquilinos";

function formatarDataParaInput(data: string) {
  if (!data) return "";

  if (data.includes("T")) {
    return data.slice(0, 10);
  }

  if (data.includes("-")) {
    return data.slice(0, 10);
  }

  return "";
}

function gerarReferenciasMeses(quantidade = 6) {
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const hoje = new Date();

  return Array.from({ length: quantidade }, (_, index) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() + index, 1);
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear();

    return `${mes}/${ano}`;
  });
}

function montarVencimentoPorDia(diaVencimento: number | string) {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  const dia = Number(diaVencimento || 1);

  const data = new Date(ano, mes, dia);

  return data.toISOString().slice(0, 10);
}

export default function LancarDespesas() {
  const navigate = useNavigate();

  const referenciasDisponiveis = gerarReferenciasMeses(6);

  const [listaInquilinos, setListaInquilinos] = useState<InquilinoMock[]>([]);
  const [busca, setBusca] = useState("");
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const [inquilinoSelecionado, setInquilinoSelecionado] =
    useState<InquilinoMock | null>(null);

  const [cobrancaIdSelecionada, setCobrancaIdSelecionada] =
    useState<string | null>(null);

  const [formData, setFormData] = useState({
    inquilino: "",
    cpf: "",
    imovel: "",
    referencia: referenciasDisponiveis[0],
    vencimento: "",
    aluguel: "",
    agua: "",
    luz: "",
    iptu: "",
    observacao: "",
  });

  useEffect(() => {
    const inquilinosSalvos = localStorage.getItem(INQUILINOS_STORAGE_KEY);

    if (inquilinosSalvos) {
      setListaInquilinos(JSON.parse(inquilinosSalvos));
    } else {
      setListaInquilinos(inquilinosMock);
      localStorage.setItem(
        INQUILINOS_STORAGE_KEY,
        JSON.stringify(inquilinosMock)
      );
    }

    const cobrancasSalvas = localStorage.getItem(COBRANCAS_STORAGE_KEY);

    if (!cobrancasSalvas) {
      localStorage.setItem(
        COBRANCAS_STORAGE_KEY,
        JSON.stringify(cobrancasMock)
      );
    }
  }, []);

  const carregarCobrancas = () => {
    const cobrancasSalvas = localStorage.getItem(COBRANCAS_STORAGE_KEY);

    if (cobrancasSalvas) {
      return JSON.parse(cobrancasSalvas);
    }

    localStorage.setItem(COBRANCAS_STORAGE_KEY, JSON.stringify(cobrancasMock));

    return [...cobrancasMock];
  };

  const buscarCobrancaExistente = (
    inquilinoId: string,
    referencia: string
  ) => {
    const listaCobrancas = carregarCobrancas();

    return listaCobrancas.find(
      (cobranca: any) =>
        String(cobranca.inquilinoId) === String(inquilinoId) &&
        cobranca.referencia === referencia
    );
  };

  const obterVencimentoPadrao = (inquilino: any) => {
    if (inquilino.vencimentoData) {
      const dataFormatada = formatarDataParaInput(inquilino.vencimentoData);

      if (dataFormatada) {
        return dataFormatada;
      }
    }

    const diaVencimento = inquilino.diaVencimento || inquilino.vencimento;

    if (diaVencimento) {
      return montarVencimentoPorDia(diaVencimento);
    }

    return "";
  };

  const preencherDadosDoInquilino = (
    inquilino: InquilinoMock,
    referencia: string
  ) => {
    const cobrancaExistente = buscarCobrancaExistente(
      inquilino.id,
      referencia
    );

    if (cobrancaExistente) {
      setCobrancaIdSelecionada(cobrancaExistente.id);

      setFormData((prev) => ({
        ...prev,
        inquilino: inquilino.nome,
        cpf: inquilino.cpf,
        imovel: inquilino.imovel,
        referencia,
        aluguel: String(cobrancaExistente.aluguel || ""),
        vencimento: formatarDataParaInput(cobrancaExistente.vencimento),
        agua: String(cobrancaExistente.agua || ""),
        luz: String(cobrancaExistente.luz || ""),
        iptu: String(cobrancaExistente.iptu || ""),
        observacao: cobrancaExistente.observacao || "",
      }));

      return;
    }

    setCobrancaIdSelecionada(null);

    setFormData((prev) => ({
      ...prev,
      inquilino: inquilino.nome,
      cpf: inquilino.cpf,
      imovel: inquilino.imovel,
      referencia,
      aluguel: String(inquilino.aluguel || ""),
      vencimento: obterVencimentoPadrao(inquilino),
      agua: "",
      luz: "",
      iptu: "",
      observacao: "",
    }));
  };

  const resultadosBusca = listaInquilinos.filter((inquilino) => {
    const textoBusca = `
      ${inquilino.nome || ""}
      ${inquilino.cpf || ""}
      ${inquilino.imovel || ""}
      ${inquilino.email || ""}
      ${inquilino.telefone || ""}
    `.toLowerCase();

    return textoBusca.includes(busca.toLowerCase());
  });

  const selecionarInquilino = (inquilino: InquilinoMock) => {
    setInquilinoSelecionado(inquilino);
    setBusca(`${inquilino.nome} - ${inquilino.imovel}`);
    setMostrarResultados(false);

    preencherDadosDoInquilino(inquilino, formData.referencia);
  };

  const handleBuscaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value);
    setMostrarResultados(true);

    if (e.target.value === "") {
      setInquilinoSelecionado(null);
      setCobrancaIdSelecionada(null);

      setFormData((prev) => ({
        ...prev,
        inquilino: "",
        cpf: "",
        imovel: "",
        aluguel: "",
        vencimento: "",
        agua: "",
        luz: "",
        iptu: "",
        observacao: "",
      }));
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "referencia") {
      setFormData((prev) => ({
        ...prev,
        referencia: value,
      }));

      if (inquilinoSelecionado) {
        preencherDadosDoInquilino(inquilinoSelecionado, value);
      }

      return;
    }

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

    if (!inquilinoSelecionado) {
      alert("Por favor, selecione um inquilino.");
      return;
    }

    if (!formData.vencimento) {
      alert("Por favor, informe a data de vencimento.");
      return;
    }

    let listaCobrancas = carregarCobrancas();

    const cobrancaExistente =
      cobrancaIdSelecionada ||
      listaCobrancas.find(
        (cobranca: any) =>
          String(cobranca.inquilinoId) === String(inquilinoSelecionado.id) &&
          cobranca.referencia === formData.referencia
      )?.id;

    if (cobrancaExistente) {
      listaCobrancas = listaCobrancas.map((cobranca: any) => {
        if (String(cobranca.id) === String(cobrancaExistente)) {
          return {
            ...cobranca,
            referencia: formData.referencia,
            aluguel,
            agua,
            luz,
            iptu,
            vencimento: formData.vencimento,
            observacao: formData.observacao,
            subtotal,
            total: totalPrevisto,
            status: "Pendente",
            dataAtualizacao: new Date().toISOString(),
          };
        }

        return cobranca;
      });

      alert("Despesas aplicadas à cobrança com sucesso!");
    } else {
      const novaCobranca = {
        id: `cob_${Date.now()}`,
        inquilinoId: inquilinoSelecionado.id,
        referencia: formData.referencia,
        aluguel,
        agua,
        luz,
        iptu,
        vencimento: formData.vencimento,
        observacao: formData.observacao,
        subtotal,
        total: totalPrevisto,
        status: "Pendente",
        formaPagamento: "Aguardando pagamento",
        dataPagamento: "",
        origemPagamento: "Automático",

        plataformaPagamento: "Asaas",
        statusAsaas: "Aguardando geração",
        linkPagamento: "",
        pixCopiaCola: "",
        boletoLinhaDigitavel: "",
        boletoUrl: "",
        dataEnvioWhatsapp: "",

        dataCriacao: new Date().toISOString(),
      };

      listaCobrancas.unshift(novaCobranca);

      alert("Nova cobrança com despesas gerada com sucesso!");
    }

    localStorage.setItem(
      COBRANCAS_STORAGE_KEY,
      JSON.stringify(listaCobrancas)
    );

    navigate("/cobrancas");
  };

  return (
    <div className={styles.lancarDespesas}>
      <div className={styles.headerDespesas}>
        <div>
          <h1 className={styles.tituloDespesas}>Lançar despesas variáveis</h1>

          <p className={styles.subtituloDespesas}>
            Informe água, luz, IPTU e outras despesas do mês para compor a
            cobrança do inquilino.
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
                {referenciasDisponiveis.map((referencia) => (
                  <option key={referencia}>{referencia}</option>
                ))}
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
              <span>Status após salvar</span>
              <h3 className={styles.statusPendente}>Pendente</h3>
            </div>
          </div>
        </section>

        <div className={styles.areaBotoes}>
          <button
            type="button"
            className={styles.botaoCancelar}
            onClick={() => navigate("/cobrancas")}
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