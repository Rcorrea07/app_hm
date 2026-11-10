import { Mensalidade } from "./Mensalidade";

/** Bolsa Finatel de 40% (20% não reembolsável + 20% reembolsável) usada nos testes. */
export const finatel40 = {
  tipo: "Finatel" as const,
  nome: "Bolsa Socioeconômica Finatel",
  percentual: 40,
  cotaNaoReembolsavel: 20,
  cotaReembolsavel: 20,
  dataRenovacao: "2026-12-05",
};

/** Mensalidade de R$ 2.850,00 com a Finatel 40%: parcela líquida R$ 1.710,00. */
export function mensalidadeDemo() {
  return new Mensalidade({
    mesReferencia: "2026-11",
    valorBruto: 285_000,
    dataVencimento: "2026-11-15",
    bolsas: [finatel40],
  });
}
