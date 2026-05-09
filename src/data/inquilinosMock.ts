export type InquilinoMock = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  imovel: string;
  endereco: string;
  aluguel: string;
  diaVencimento: string;
  vencimentoTexto: string;
  vencimentoData: string;
  dataInicio: string;
  dataFim: string;
  statusContrato: string;
  statusPagamento: string;
  aguaTipo: string;
  aguaValor: string;
  luzTipo: string;
  luzValor: string;
  iptuTipo: string;
  iptuValor: string;
};

export const inquilinosMock: InquilinoMock[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@email.com",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    imovel: "Apto 101",
    endereco: "Av. José Lopes de Oliveira",
    aluguel: "1500",
    diaVencimento: "10",
    vencimentoTexto: "Todo dia 10",
    vencimentoData: "2026-05-10",
    dataInicio: "2025-05-10",
    dataFim: "2026-05-10",
    statusContrato: "Ativo",
    statusPagamento: "Pendente",
    aguaTipo: "variavel",
    aguaValor: "",
    luzTipo: "variavel",
    luzValor: "",
    iptuTipo: "fixo",
    iptuValor: "95",
  },
  {
    id: "2",
    nome: "Maria Clara",
    email: "maria.clara@email.com",
    cpf: "987.654.321-00",
    telefone: "(11) 97654-3210",
    imovel: "Casa 02",
    endereco: "Parque Assunção",
    aluguel: "1800",
    diaVencimento: "15",
    vencimentoTexto: "Todo dia 15",
    vencimentoData: "2026-05-15",
    dataInicio: "2025-05-15",
    dataFim: "2026-05-15",
    statusContrato: "Ativo",
    statusPagamento: "Com pendência",
    aguaTipo: "fixo",
    aguaValor: "80",
    luzTipo: "variavel",
    luzValor: "",
    iptuTipo: "fixo",
    iptuValor: "110",
  },
  {
    id: "3",
    nome: "Rafael Pereira",
    email: "rafael.pereira@email.com",
    cpf: "456.789.123-00",
    telefone: "(11) 96543-2109",
    imovel: "Apto 203",
    endereco: "Rua das Flores",
    aluguel: "1600",
    diaVencimento: "12",
    vencimentoTexto: "Todo dia 12",
    vencimentoData: "2026-05-12",
    dataInicio: "2025-05-12",
    dataFim: "2026-05-12",
    statusContrato: "Ativo",
    statusPagamento: "Adimplente",
    aguaTipo: "variavel",
    aguaValor: "",
    luzTipo: "variavel",
    luzValor: "",
    iptuTipo: "fixo",
    iptuValor: "90",
  },
  {
    id: "4",
    nome: "Ana Souza",
    email: "ana.souza@email.com",
    cpf: "321.654.987-00",
    telefone: "(11) 95432-1098",
    imovel: "Casa 05",
    endereco: "Jd. Roberto",
    aluguel: "1700",
    diaVencimento: "15",
    vencimentoTexto: "Todo dia 15",
    vencimentoData: "2026-05-15",
    dataInicio: "2025-05-15",
    dataFim: "2026-05-15",
    statusContrato: "Ativo",
    statusPagamento: "Despesas pendentes",
    aguaTipo: "variavel",
    aguaValor: "",
    luzTipo: "variavel",
    luzValor: "",
    iptuTipo: "variavel",
    iptuValor: "",
  },
];

export function getInquilinoById(id: string | undefined) {
  return inquilinosMock.find((inquilino) => inquilino.id === id);
}

export function formatarTipoDespesa(tipo: string, valor?: string) {
  if (tipo === "nao_cobra") return "Não cobra";
  if (tipo === "fixo") {
    return valor ? `Valor fixo - R$ ${valor}` : "Valor fixo";
  }

  return "Variável mensal";
}