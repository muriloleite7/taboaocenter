import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api"; 
import {
  calcularMultaAutomatica,
  calcularSubtotal,
  formatarMoeda,
} from "../data/cobrancasMock";
import styles from "../style/detalheInquilino.module.css";

// Função utilitária local para tratar a exibição amigável dos tipos de despesas
const formatarTipoDespesa = (tipo?: string, valor?: string | number) => {
  if (tipo === "fixo") return `Fixo: ${formatarMoeda(Number(valor || 0))}`;
  if (tipo === "variavel") return "Variável mensal";
  return "Não cobra / Incluso";
};

// Função utilitária local para formatar datas ISO vindas do banco de dados (AAAA-MM-DD para DD/MM/AAAA)
const ajustarDataBR = (dataIso?: string) => {
  if (!dataIso) return "---";
  const apenasData = dataIso.split("T")[0];
  const partes = apenasData.split("-");
  if (partes.length !== 3) return dataIso;
  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
};

export default function DetalheInquilino() {
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [inquilinoEncontrado, setInquilinoEncontrado] = useState<boolean>(false);
  const [inquilino, setInquilino] = useState<any | null>(null);
  const [cobrancasDoInquilino, setCobrancasDoInquilino] = useState<any[]>([]);

  useEffect(() => {
    async function carregarDetalhes() {
      try {
        setLoading(true);
        
        // Remove possíveis espaços em branco do ID vindo da URL
        const idFormatado = String(id).trim(); 
        
        console.log(`Buscando inquilino na rota: /inquilinos/detalhes/${idFormatado}`);
        const response = await api.get(`/inquilinos/detalhes/${idFormatado}`);
        console.log("Resposta bruta do Backend:", response.data);

        const dadosBackend = response.data;

        // Valida se o backend retornou um objeto válido populado
        if (dadosBackend && (dadosBackend.id || dadosBackend.nome)) {
          setInquilino(dadosBackend);
          setInquilinoEncontrado(true);
          
          // Busca as cobranças de forma dinâmica (dentro do contrato ou na raiz)
          const contrato = dadosBackend.contratos?.[0] || dadosBackend.contrato;
          if (contrato?.cobrancas) {
            setCobrancasDoInquilino(contrato.cobrancas);
          } else if (dadosBackend.cobrancas) {
            setCobrancasDoInquilino(dadosBackend.cobrancas);
          }
        } else {
          setInquilinoEncontrado(false);
        }
      } catch (error: any) {
        console.error("Erro retornado pela API:", error.response?.data || error.message);
        setInquilinoEncontrado(false);
      } finally {
        setLoading(false);
      }
    }

    if (id) carregarDetalhes();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.detalheInquilino}>
        <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
          Carregando informações do CRM...
        </h1>
      </div>
    );
  }

  if (!inquilinoEncontrado || !inquilino) {
    return (
      <div className={styles.detalheInquilino}>
        <h1>Inquilino não encontrado</h1>
        <p style={{ marginBottom: "1.5rem", color: "#666" }}>
          Não encontramos nenhum registro com o ID "{id}". Verifique o console (F12) para detalhes técnicos.
        </p>
        <Link to="/inquilinos" className={styles.voltarLink}>
          Voltar para inquilinos
        </Link>
      </div>
    );
  }

  // Mapeamentos seguros baseados na estrutura relacional do ORM (Prisma/Sequelize)
  const contratoAtivo = inquilino.contratos?.[0] || inquilino.contrato;
  const statusTabela = contratoAtivo?.atraso ? "Pendência" : "Adimplente";
  
  // Tratamento caso config_despesas venha como String JSON ou Objeto do banco
  let despesas = { agua: "variavel", aguaValor: "", luz: "variavel", luzValor: "", iptu: "variavel", iptuValor: "" };
  if (contratoAtivo?.config_despesas) {
    try {
      despesas = typeof contratoAtivo.config_despesas === "string" 
        ? JSON.parse(contratoAtivo.config_despesas) 
        : contratoAtivo.config_despesas;
    } catch (e) {
      console.error("Erro ao converter config_despesas:", e);
    }
  }

  return (
    <div className={styles.detalheInquilino}>
      <div className={styles.headerDetalhe}>
        <div>
          <Link to="/inquilinos" className={styles.voltarLink}>
            ← Voltar para inquilinos
          </Link>
          <h1>{inquilino.nome}</h1>
          <p>Detalhes completos do inquilino, contrato e cobranças.</p>
        </div>

        <Link to={`/inquilinos/${id}/editar`} className={styles.editarButton}>
          Editar inquilino
        </Link>
      </div>

      <div className={styles.gridResumo}>
        <div className={styles.resumoCard}>
          <span>Status do pagamento</span>
          <h3 className={statusTabela === "Adimplente" ? styles.statusAdimplente : styles.statusPendente}>
            {statusTabela}
          </h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Aluguel</span>
          <h3>{formatarMoeda(Number(contratoAtivo?.valor_aluguel || inquilino.aluguel || 0))}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Vencimento</span>
          <h3>Dia {contratoAtivo?.vencimento || inquilino.vencimento || "---"}</h3>
        </div>

        <div className={styles.resumoCard}>
          <span>Contrato</span>
          <h3>{contratoAtivo?.statusContrato || "Ativo"}</h3>
        </div>
      </div>

      <div className={styles.conteudoGrid}>
        <section className={styles.cardInfo}>
          <h2>Dados pessoais</h2>

          <div className={styles.infoLinha}>
            <span>Nome</span>
            <h3>{inquilino.nome}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>CPF</span>
            <h3>{inquilino.cpf}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>WhatsApp</span>
            <h3>{inquilino.telefone}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>E-mail</span>
            <h3>{inquilino.email || "---"}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Imóvel vinculado</h2>

          <div className={styles.infoLinha}>
            <span>Imóvel</span>
            <h3>{contratoAtivo?.imovel?.titulo || inquilino.imovel || "---"}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Endereço/Bairro</span>
            <h3>
              {contratoAtivo?.endereco 
                ? `${contratoAtivo.endereco.rua}, ${contratoAtivo.endereco.numero} - ${contratoAtivo.endereco.cidade}` 
                : (inquilino.endereco || "---")}
            </h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Contrato</h2>

          <div className={styles.infoLinha}>
            <span>Início</span>
            <h3>{ajustarDataBR(contratoAtivo?.data_de_inicio || contratoAtivo?.dataInicio || inquilino.dataInicio)}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Fim</span>
            <h3>{ajustarDataBR(contratoAtivo?.data_de_fim || contratoAtivo?.dataFim || inquilino.dataFim)}</h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Status</span>
            <h3>{contratoAtivo?.statusContrato || "Ativo"}</h3>
          </div>
        </section>

        <section className={styles.cardInfo}>
          <h2>Despesas do contrato</h2>

          <div className={styles.infoLinha}>
            <span>Água</span>
            <h3>
              {formatarTipoDespesa(despesas.agua || inquilino.aguaTipo, despesas.aguaValor || inquilino.aguaValor)}
            </h3>
          </div>

          <div className={styles.infoLinha}>
            <span>Luz</span>
            <h3>
              {formatarTipoDespesa(despesas.luz || inquilino.luzTipo, despesas.luzValor || inquilino.luzValor)}
            </h3>
          </div>

          <div className={styles.infoLinha}>
            <span>IPTU</span>
            <h3>
              {formatarTipoDespesa(despesas.iptu || inquilino.iptuTipo, despesas.iptuValor || inquilino.iptuValor)}
            </h3>
          </div>
        </section>
      </div>

      <section className={styles.cardInfo}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Cobranças recentes</h2>
            <p>Últimas cobranças vinculadas a este inquilino.</p>
          </div>

          <Link to="/cobrancas" className={styles.verTodasLink}>
            Ver cobranças
          </Link>
        </div>

        <div className={styles.cobrancasLista}>
          {cobrancasDoInquilino.length === 0 ? (
            <p style={{ color: "#777", fontStyle: "italic" }}>
              Nenhuma cobrança vinculada a este histórico.
            </p>
          ) : (
            cobrancasDoInquilino.map((cobranca) => {
              const subtotal = calcularSubtotal(cobranca);
              const multa = calcularMultaAutomatica(cobranca.status, subtotal);
              const total = subtotal + multa;

              return (
                <div className={styles.cobrancaItem} key={cobranca.id}>
                  <span>{cobranca.referencia || ajustarDataBR(cobranca.data)}</span>
                  <h3>{formatarMoeda(total || cobranca.valor_aluguel)}</h3>
                  <p className={cobranca.status === "Pago" ? styles.statusAdimplente : styles.statusPendente}>
                    {cobranca.status}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}