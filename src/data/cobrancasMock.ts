export type CobrancaMock = {
  id: string;
  inquilinoId: string;
  referencia: string;
  aluguel: string;
  agua: string;
  luz: string;
  iptu: string;
  vencimento: string;
  status: string;
  formaPagamento: string;
  dataPagamento: string;
  origemPagamento: string;
  observacao: string;
};

export const cobrancasMock: CobrancaMock[] = [
  {
    id: "1",
    inquilinoId: "1",
    referencia: "Maio/2026",
    aluguel: "1500",
    agua: "85",
    luz: "130",
    iptu: "95",
    vencimento: "2026-05-10",
    status: "Pendente",
    formaPagamento: "Aguardando pagamento",
    dataPagamento: "",
    origemPagamento: "Automático",
    observacao: "Cobrança aguardando pagamento por Pix ou boleto.",
  },
  {
    id: "2",
    inquilinoId: "2",
    referencia: "Maio/2026",
    aluguel: "1800",
    agua: "92",
    luz: "145",
    iptu: "110",
    vencimento: "2026-05-08",
    status: "Atrasada",
    formaPagamento: "Aguardando pagamento",
    dataPagamento: "",
    origemPagamento: "Automático",
    observacao: "Cobrança em atraso. Multa será calculada automaticamente.",
  },
  {
    id: "3",
    inquilinoId: "3",
    referencia: "Maio/2026",
    aluguel: "1600",
    agua: "78",
    luz: "118",
    iptu: "90",
    vencimento: "2026-05-12",
    status: "Paga",
    formaPagamento: "Pix",
    dataPagamento: "2026-05-11",
    origemPagamento: "Automático",
    observacao: "Pagamento confirmado automaticamente via Pix.",
  },
  {
    id: "4",
    inquilinoId: "4",
    referencia: "Maio/2026",
    aluguel: "1700",
    agua: "",
    luz: "",
    iptu: "",
    vencimento: "2026-05-15",
    status: "Despesas pendentes",
    formaPagamento: "Aguardando pagamento",
    dataPagamento: "",
    origemPagamento: "Automático",
    observacao: "Aguardando lançamento de água, luz e IPTU.",
  },
];

export function getCobrancaById(id: string | undefined) {
  return cobrancasMock.find((cobranca) => cobranca.id === id);
}

export function getCobrancasByInquilinoId(id: string | undefined) {
  return cobrancasMock.filter((cobranca) => cobranca.inquilinoId === id);
}

export function calcularSubtotal(cobranca: {
  aluguel: string;
  agua: string;
  luz: string;
  iptu: string;
}) {
  return (
    Number(cobranca.aluguel) +
    Number(cobranca.agua || 0) +
    Number(cobranca.luz || 0) +
    Number(cobranca.iptu || 0)
  );
}

export function calcularMultaAutomatica(status: string, subtotal: number) {
  return status === "Atrasada" ? subtotal * 0.02 : 0;
}

export function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarData(data: string) {
  if (!data) return "—";

  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}