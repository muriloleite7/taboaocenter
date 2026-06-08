import { useEffect, useState } from "react";
import styles from "../style/config.module.css";

type ConfiguracoesSistema = {
  multaAtraso: string;
  jurosDia: string;
  diasTolerancia: number;
  aplicarMultaAutomatica: boolean;

  plataformaPagamento: string;
  formaPadraoCobranca: string;
  gerarCobrancaAntes: string;
  gerarCobrancaAutomatica: boolean;
  bloquearEnvioDespesasPendentes: boolean;

  avisoCobrancaAntes: string;
  avisoContratoAntes: string;
  whatsappAutomatico: boolean;
  prepararMensagemWhatsapp: boolean;
  enviarAvisoAposAtraso: boolean;

  mensagemCobranca: string;
  mensagemAtraso: string;
  mensagemRenovacao: string;

  nomeImobiliaria: string;
  telefone: string;
  email: string;
  contaRecebimento: string;

  ambienteAsaas: string;
  statusIntegracaoAsaas: string;
  baixaAutomaticaWebhook: boolean;
  registrarFalhasPagamento: boolean;

  permitirExportacaoRelatorios: boolean;
  exibirNotificacoesInternas: boolean;
  funcionarioPodeCancelarCobranca: boolean;
  funcionarioPodeRegistrarPagamentoManual: boolean;
};

const CONFIG_STORAGE_KEY = "@TaboaoCenter:configuracoes";

const configuracoesPadrao: ConfiguracoesSistema = {
  multaAtraso: "2,00",
  jurosDia: "0,33",
  diasTolerancia: 0,
  aplicarMultaAutomatica: true,

  plataformaPagamento: "Asaas",
  formaPadraoCobranca: "Pix e boleto",
  gerarCobrancaAntes: "5 dias",
  gerarCobrancaAutomatica: true,
  bloquearEnvioDespesasPendentes: true,

  avisoCobrancaAntes: "5 dias",
  avisoContratoAntes: "30 dias",
  whatsappAutomatico: false,
  prepararMensagemWhatsapp: true,
  enviarAvisoAposAtraso: true,

  mensagemCobranca:
    "Olá, [nome]. Sua cobrança referente a [referencia] vence em [data]. O valor atualizado é [valor]. Acesse o pagamento por aqui: [link_pagamento].",
  mensagemAtraso:
    "Olá, [nome]. Identificamos que sua cobrança referente a [referencia] está em atraso. O valor atualizado é [valor]. Regularize pelo link: [link_pagamento].",
  mensagemRenovacao:
    "Olá, [nome]. Seu contrato está próximo do vencimento. Entre em contato para conversar sobre a renovação.",

  nomeImobiliaria: "Taboão Center",
  telefone: "(11) 99999-9999",
  email: "contato@taboaocenter.com",
  contaRecebimento: "Configurada na conta Asaas da imobiliária",

  ambienteAsaas: "Sandbox",
  statusIntegracaoAsaas: "Não conectada",
  baixaAutomaticaWebhook: true,
  registrarFalhasPagamento: true,

  permitirExportacaoRelatorios: true,
  exibirNotificacoesInternas: true,
  funcionarioPodeCancelarCobranca: false,
  funcionarioPodeRegistrarPagamentoManual: true,
};

export default function Configuracoes() {
  const [config, setConfig] = useState<ConfiguracoesSistema>(configuracoesPadrao);

  useEffect(() => {
    const configuracoesSalvas = localStorage.getItem(CONFIG_STORAGE_KEY);

    if (configuracoesSalvas) {
      setConfig({
        ...configuracoesPadrao,
        ...JSON.parse(configuracoesSalvas),
      });
    }
  }, []);

  const atualizarCampo = (
    campo: keyof ConfiguracoesSistema,
    valor: string | number | boolean
  ) => {
    setConfig((configAtual) => ({
      ...configAtual,
      [campo]: valor,
    }));
  };

  const salvarConfiguracoes = () => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className={styles.configuracoes}>
      <div className={styles.headerConfiguracoes}>
        <div>
          <h1 className={styles.tituloConfiguracoes}>Configurações</h1>
          <p className={styles.subtituloConfiguracoes}>
            Defina as regras de cobrança, pagamentos, avisos e preferências do sistema.
          </p>
        </div>

        <button
          type="button"
          className={styles.salvarButton}
          onClick={salvarConfiguracoes}
        >
          Salvar alterações
        </button>
      </div>

      <div className={styles.configGrid}>
        <div className={styles.configCard}>
          <h2>Regras de cobrança</h2>
          <p className={styles.cardDescription}>
            Defina como o sistema calcula atrasos e valores adicionais.
          </p>

          <div className={styles.formGroup}>
            <label>Multa por atraso (%)</label>
            <input
              type="text"
              value={config.multaAtraso}
              onChange={(e) => atualizarCampo("multaAtraso", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Juros ao dia (%)</label>
            <input
              type="text"
              value={config.jurosDia}
              onChange={(e) => atualizarCampo("jurosDia", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Dias de tolerância</label>
            <input
              type="number"
              value={config.diasTolerancia}
              onChange={(e) =>
                atualizarCampo("diasTolerancia", Number(e.target.value))
              }
            />
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Aplicar multa automaticamente</strong>
              <span>O sistema calcula multa quando a cobrança atrasar.</span>
            </div>

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={config.aplicarMultaAutomatica}
                onChange={(e) =>
                  atualizarCampo("aplicarMultaAutomatica", e.target.checked)
                }
              />
              <span></span>
            </label>
          </div>
        </div>

        <div className={styles.configCard}>
          <h2>Pagamento automático</h2>
          <p className={styles.cardDescription}>
            Configure como o sistema deve gerar cobranças, Pix, boleto e links de pagamento.
          </p>

          <div className={styles.formGroup}>
            <label>Plataforma de pagamento</label>
            <select
              value={config.plataformaPagamento}
              onChange={(e) =>
                atualizarCampo("plataformaPagamento", e.target.value)
              }
            >
              <option>Asaas</option>
              <option>Mercado Pago</option>
              <option>Efí / Gerencianet</option>
              <option>Manual</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Forma padrão de cobrança</label>
            <select
              value={config.formaPadraoCobranca}
              onChange={(e) =>
                atualizarCampo("formaPadraoCobranca", e.target.value)
              }
            >
              <option>Pix e boleto</option>
              <option>Somente Pix</option>
              <option>Somente boleto</option>
              <option>Link de pagamento</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Gerar cobrança antes do vencimento</label>
            <select
              value={config.gerarCobrancaAntes}
              onChange={(e) =>
                atualizarCampo("gerarCobrancaAntes", e.target.value)
              }
            >
              <option>3 dias</option>
              <option>5 dias</option>
              <option>7 dias</option>
              <option>10 dias</option>
            </select>
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Gerar cobrança automaticamente</strong>
              <span>
                Cria a cobrança do mês quando faltar o prazo configurado para o vencimento.
              </span>
            </div>

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={config.gerarCobrancaAutomatica}
                onChange={(e) =>
                  atualizarCampo("gerarCobrancaAutomatica", e.target.checked)
                }
              />
              <span></span>
            </label>
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Bloquear envio com despesas pendentes</strong>
              <span>
                Se água, luz ou IPTU ainda não foram lançados, o sistema não envia a cobrança.
              </span>
            </div>

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={config.bloquearEnvioDespesasPendentes}
                onChange={(e) =>
                  atualizarCampo(
                    "bloquearEnvioDespesasPendentes",
                    e.target.checked
                  )
                }
              />
              <span></span>
            </label>
          </div>
        </div>

        <div className={styles.configCard}>
          <h2>Avisos automáticos</h2>
          <p className={styles.cardDescription}>
            Configure quando o sistema deve preparar ou enviar lembretes.
          </p>

          <div className={styles.formGroup}>
            <label>Avisar cobrança antes do vencimento</label>
            <select
              value={config.avisoCobrancaAntes}
              onChange={(e) =>
                atualizarCampo("avisoCobrancaAntes", e.target.value)
              }
            >
              <option>3 dias</option>
              <option>5 dias</option>
              <option>7 dias</option>
              <option>10 dias</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Avisar contrato antes do vencimento</label>
            <select
              value={config.avisoContratoAntes}
              onChange={(e) =>
                atualizarCampo("avisoContratoAntes", e.target.value)
              }
            >
              <option>15 dias</option>
              <option>30 dias</option>
              <option>45 dias</option>
              <option>60 dias</option>
            </select>
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>WhatsApp automático</strong>
              <span>
                Quando houver integração ativa, envia o aviso automaticamente ao inquilino.
              </span>
            </div>

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={config.whatsappAutomatico}
                onChange={(e) =>
                  atualizarCampo("whatsappAutomatico", e.target.checked)
                }
              />
              <span></span>
            </label>
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Preparar mensagem para WhatsApp</strong>
              <span>
                Enquanto não houver API oficial, o sistema gera o texto para copiar e enviar.
              </span>
            </div>

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={config.prepararMensagemWhatsapp}
                onChange={(e) =>
                  atualizarCampo("prepararMensagemWhatsapp", e.target.checked)
                }
              />
              <span></span>
            </label>
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Enviar aviso após atraso</strong>
              <span>Prepara segunda notificação quando houver atraso.</span>
            </div>

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={config.enviarAvisoAposAtraso}
                onChange={(e) =>
                  atualizarCampo("enviarAvisoAposAtraso", e.target.checked)
                }
              />
              <span></span>
            </label>
          </div>
        </div>

        <div className={styles.configCard}>
          <h2>Mensagens padrão</h2>
          <p className={styles.cardDescription}>
            Textos usados futuramente nos avisos pelo WhatsApp.
          </p>

          <div className={styles.formGroup}>
            <label>Mensagem de cobrança</label>
            <textarea
              value={config.mensagemCobranca}
              onChange={(e) =>
                atualizarCampo("mensagemCobranca", e.target.value)
              }
            />
            <span className={styles.campoAjuda}>
              Você pode usar: [nome], [referencia], [data], [valor] e [link_pagamento].
            </span>
          </div>

          <div className={styles.formGroup}>
            <label>Mensagem de atraso</label>
            <textarea
              value={config.mensagemAtraso}
              onChange={(e) => atualizarCampo("mensagemAtraso", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mensagem de renovação</label>
            <textarea
              value={config.mensagemRenovacao}
              onChange={(e) =>
                atualizarCampo("mensagemRenovacao", e.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.configCard}>
          <h2>Dados da imobiliária</h2>
          <p className={styles.cardDescription}>
            Informações usadas nos relatórios e mensagens.
          </p>

          <div className={styles.formGroup}>
            <label>Nome da imobiliária</label>
            <input
              type="text"
              value={config.nomeImobiliaria}
              onChange={(e) => atualizarCampo("nomeImobiliaria", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Telefone</label>
            <input
              type="text"
              value={config.telefone}
              onChange={(e) => atualizarCampo("telefone", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>E-mail</label>
            <input
              type="email"
              value={config.email}
              onChange={(e) => atualizarCampo("email", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Conta de recebimento</label>
            <input
              type="text"
              value={config.contaRecebimento}
              onChange={(e) =>
                atualizarCampo("contaRecebimento", e.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.configCard}>
          <h2>Integração Asaas</h2>
          <p className={styles.cardDescription}>
            Dados visuais da integração. As chaves reais devem ficar protegidas no back-end.
          </p>

          <div className={styles.formGroup}>
            <label>Ambiente</label>
            <select
              value={config.ambienteAsaas}
              onChange={(e) => atualizarCampo("ambienteAsaas", e.target.value)}
            >
              <option>Sandbox</option>
              <option>Produção</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Status da integração</label>
            <select
              value={config.statusIntegracaoAsaas}
              onChange={(e) =>
                atualizarCampo("statusIntegracaoAsaas", e.target.value)
              }
            >
              <option>Não conectada</option>
              <option>Em testes</option>
              <option>Conectada</option>
              <option>Erro na integração</option>
            </select>
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Baixa automática por webhook</strong>
              <span>
                Atualiza a cobrança para paga quando o Asaas confirmar o pagamento.
              </span>
            </div>

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={config.baixaAutomaticaWebhook}
                onChange={(e) =>
                  atualizarCampo("baixaAutomaticaWebhook", e.target.checked)
                }
              />
              <span></span>
            </label>
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Registrar falhas de pagamento</strong>
              <span>
                Guarda erros de geração de Pix, boleto ou confirmação de pagamento.
              </span>
            </div>

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={config.registrarFalhasPagamento}
                onChange={(e) =>
                  atualizarCampo("registrarFalhasPagamento", e.target.checked)
                }
              />
              <span></span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.configCardFull}>
        <h2>Preferências do sistema</h2>
        <p className={styles.cardDescription}>
          Ajuste permissões e preferências gerais do painel.
        </p>

        <div className={styles.preferenceRow}>
          <div>
            <strong>Permitir exportação de relatórios</strong>
            <span>
              Libera o botão de exportar nas telas de inquilinos, cobranças e contratos.
            </span>
          </div>

          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={config.permitirExportacaoRelatorios}
              onChange={(e) =>
                atualizarCampo("permitirExportacaoRelatorios", e.target.checked)
              }
            />
            <span></span>
          </label>
        </div>

        <div className={styles.preferenceRow}>
          <div>
            <strong>Exibir notificações internas</strong>
            <span>
              Mostra alertas dentro do sistema sobre vencimentos, atrasos e pendências.
            </span>
          </div>

          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={config.exibirNotificacoesInternas}
              onChange={(e) =>
                atualizarCampo("exibirNotificacoesInternas", e.target.checked)
              }
            />
            <span></span>
          </label>
        </div>

        <div className={styles.preferenceRow}>
          <div>
            <strong>Funcionário pode cancelar cobrança</strong>
            <span>
              Se desligado, apenas administradores poderão cancelar cobranças geradas.
            </span>
          </div>

          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={config.funcionarioPodeCancelarCobranca}
              onChange={(e) =>
                atualizarCampo(
                  "funcionarioPodeCancelarCobranca",
                  e.target.checked
                )
              }
            />
            <span></span>
          </label>
        </div>

        <div className={styles.preferenceRow}>
          <div>
            <strong>Funcionário pode registrar pagamento manual</strong>
            <span>
              Permite registrar pagamentos feitos por fora, como dinheiro ou transferência.
            </span>
          </div>

          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={config.funcionarioPodeRegistrarPagamentoManual}
              onChange={(e) =>
                atualizarCampo(
                  "funcionarioPodeRegistrarPagamentoManual",
                  e.target.checked
                )
              }
            />
            <span></span>
          </label>
        </div>
      </div>
    </div>
  );
}