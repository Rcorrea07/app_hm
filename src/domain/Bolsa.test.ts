import { describe, expect, it } from "vitest";
import { Bolsa } from "./Bolsa";

const finatel40 = {
  tipo: "Finatel" as const,
  nome: "Bolsa Socioeconômica Finatel",
  percentual: 40,
  cotaNaoReembolsavel: 20,
  cotaReembolsavel: 20,
  dataRenovacao: "2026-12-05",
};

describe("Bolsa", () => {
  const bolsa = new Bolsa(finatel40);
  it("calcula desconto e cotas", () => {
    expect(bolsa.calcularDesconto(285_000)).toBe(114_000);
    expect(bolsa.valorNaoReembolsavel(285_000)).toBe(57_000);
    expect(bolsa.valorReembolsavel(285_000)).toBe(57_000);
  });
  it("cotas sempre fecham com o desconto, mesmo com arredondamento", () => {
    const b = new Bolsa({ ...finatel40, percentual: 35, cotaNaoReembolsavel: 17, cotaReembolsavel: 18 });
    const bruto = 123_457;
    expect(b.valorNaoReembolsavel(bruto) + b.valorReembolsavel(bruto)).toBe(b.calcularDesconto(bruto));
  });
  it("níveis de renovação", () => {
    expect(bolsa.nivelRenovacao("2026-10-01")).toBe("tranquilo");
    expect(bolsa.verificarRenovacao("2026-10-01")).toBe(false);
    expect(bolsa.nivelRenovacao("2026-11-10")).toBe("atencao");
    expect(bolsa.verificarRenovacao("2026-11-10")).toBe(true);
    expect(bolsa.nivelRenovacao("2026-12-01")).toBe("urgente");
    expect(bolsa.nivelRenovacao("2026-12-06")).toBe("vencida");
  });
  it("rejeita cotas que não fecham", () => {
    expect(() => new Bolsa({ ...finatel40, cotaReembolsavel: 10 })).toThrow();
  });
});
