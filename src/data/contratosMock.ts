export type ContratoMock = {
  id: string;
  inquilinoId: string;
  status: string;
  inicio: string;
  fim: string;
  diasRestantes: string;
};

export const contratosMock: ContratoMock[] = [
  {
    id: "1",
    inquilinoId: "1",
    status: "Vence em breve",
    inicio: "10/05/2025",
    fim: "10/05/2026",
    diasRestantes: "12 dias",
  },
  {
    id: "2",
    inquilinoId: "2",
    status: "Ativo",
    inicio: "15/05/2025",
    fim: "15/05/2026",
    diasRestantes: "17 dias",
  },
  {
    id: "3",
    inquilinoId: "3",
    status: "Renovação pendente",
    inicio: "01/04/2025",
    fim: "01/05/2026",
    diasRestantes: "Renovação",
  },
  {
    id: "4",
    inquilinoId: "4",
    status: "Encerrado",
    inicio: "08/05/2024",
    fim: "08/05/2025",
    diasRestantes: "Encerrado",
  },
];

export function getContratoById(id: string | undefined) {
  return contratosMock.find((contrato) => contrato.id === id);
}

export function getContratoByInquilinoId(id: string | undefined) {
  return contratosMock.find((contrato) => contrato.inquilinoId === id);
}