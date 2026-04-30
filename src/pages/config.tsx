import styles from "../style/config.module.css";

export default function Configuracoes() {
  return (
    <div className={styles.configuracoes}>
      <div className={styles.headerConfiguracoes}>
        <div>
          <h1 className={styles.tituloConfiguracoes}>Configurações</h1>
          <p className={styles.subtituloConfiguracoes}>
            Defina as regras de cobrança, avisos e preferências do sistema.
          </p>
        </div>

        <button className={styles.salvarButton}>Salvar alterações</button>
      </div>

      <div className={styles.configGrid}>
        <div className={styles.configCard}>
          <h2>Regras de cobrança</h2>
          <p className={styles.cardDescription}>
            Defina como o sistema calcula atrasos e valores adicionais.
          </p>

          <div className={styles.formGroup}>
            <label>Multa por atraso (%)</label>
            <input type="text" defaultValue="2,00" />
          </div>

          <div className={styles.formGroup}>
            <label>Juros ao dia (%)</label>
            <input type="text" defaultValue="0,33" />
          </div>

          <div className={styles.formGroup}>
            <label>Dias de tolerância</label>
            <input type="number" defaultValue={0} />
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Aplicar multa automaticamente</strong>
              <span>O sistema calcula multa quando a cobrança atrasar.</span>
            </div>

            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>
        </div>

        <div className={styles.configCard}>
          <h2>Avisos automáticos</h2>
          <p className={styles.cardDescription}>
            Configure quando o sistema deve preparar os lembretes.
          </p>

          <div className={styles.formGroup}>
            <label>Avisar cobrança antes do vencimento</label>
            <select defaultValue="5 dias">
              <option>3 dias</option>
              <option>5 dias</option>
              <option>7 dias</option>
              <option>10 dias</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Avisar contrato antes do vencimento</label>
            <select defaultValue="30 dias">
              <option>15 dias</option>
              <option>30 dias</option>
              <option>45 dias</option>
              <option>60 dias</option>
            </select>
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Enviar lembrete automático</strong>
              <span>Dispara aviso quando faltar o prazo configurado.</span>
            </div>

            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>

          <div className={styles.switchRow}>
            <div>
              <strong>Enviar aviso após atraso</strong>
              <span>Prepara segunda notificação quando houver atraso.</span>
            </div>

            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
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
              defaultValue={
                "Olá, [nome]. Seu aluguel vence em [data]. O valor atualizado é [valor]."
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mensagem de renovação</label>
            <textarea
              defaultValue={
                "Olá, [nome]. Seu contrato está próximo do vencimento. Entre em contato para renovar."
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
            <input type="text" defaultValue="Taboão Center" />
          </div>

          <div className={styles.formGroup}>
            <label>Telefone</label>
            <input type="text" defaultValue="(11) 99999-9999" />
          </div>

          <div className={styles.formGroup}>
            <label>E-mail</label>
            <input type="email" defaultValue="contato@taboaocenter.com" />
          </div>

          <div className={styles.formGroup}>
            <label>Chave Pix padrão</label>
            <input type="text" defaultValue="taboaocenter@pix.com.br" />
          </div>
        </div>
      </div>

      <div className={styles.configCardFull}> {/* Configurações avançadas, onde o ADMIN consegue gerenciar se os funcionários têm acesso a determinadas funcionalidades */}
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
            <input type="checkbox" defaultChecked />
            <span></span>
          </label>
        </div>

        <div className={styles.preferenceRow}>
          <div>
            <strong>Exibir notificações internas</strong>
            <span>
              Mostra alertas dentro do sistema sobre vencimentos e pendências.
            </span>
          </div>

          <label className={styles.switch}>
            <input type="checkbox" defaultChecked />
            <span></span>
          </label>
        </div>
      </div>
    </div>
  );
}