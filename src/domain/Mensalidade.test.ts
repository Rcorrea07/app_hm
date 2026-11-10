import { describe, expect, it } from "vitest";
import { Mensalidade } from "./Mensalidade";
import { finatel40, mensalidadeDemo } from "./fixtures";

describe("Mensalidade", () => {
  it("parcela líquida = bruto − desconto", () => {
    const m = mensalidadeDemo();
    expect(m.descontoAplicado).toBe(114_000);
    expect(m.calcularParcelaLiquida()).toBe(171_000);
    expect(m.exibirResumo().percentualDesconto).toBe(40);
  });
  it("desconto nunca passa do bruto", () => {
    const m = new Mensalidade({
      mesReferencia: "2026-11",
      valorBruto: 100_000,
      dataVencimento: "2026-11-15",
      bolsas: [
        { ...finatel40, percentual: 80, cotaNaoReembolsavel: 40, cotaReembolsavel: 40 },
        { ...finatel40, tipo: "Fundacred", percentual: 50, cotaNaoReembolsavel: 0, cotaReembolsavel: 50 },
      ],
    });
    expect(m.descontoAplicado).toBe(100_000);
    expect(m.parcelaLiquida).toBe(0);
  });
});
