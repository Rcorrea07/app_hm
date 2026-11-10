import { describe, expect, it, beforeEach } from "vitest";
import { OrcamentoMensal } from "./OrcamentoMensal";
import { armazenamentoLocal, CHAVE_ORCAMENTO } from "./armazenamentoLocal";
import { mensalidadeDemo } from "./fixtures";

describe("OrcamentoMensal", () => {
  beforeEach(() => armazenamentoLocal.apagarTudo());

  it("saldo livre = renda − parcela líquida", () => {
    const o = new OrcamentoMensal("2026-11", mensalidadeDemo());
    o.informarRenda(290_000);
    expect(o.calcularSaldoLivre()).toBe(119_000);
  });

  it("tetos somam exatamente o saldo livre", () => {
    const o = new OrcamentoMensal("2026-11", mensalidadeDemo(), 290_001);
    o.definirTetos([33, 33, 34]);
    const soma = o.categorias.reduce((t, c) => t + c.valorTeto, 0);
    expect(soma).toBe(o.saldoLivre);
  });

  it("divisão sugerida 50/30/20", () => {
    const o = new OrcamentoMensal("2026-11", mensalidadeDemo(), 290_000);
    o.definirTetos([10, 10, 80]);
    o.sugerirTetos();
    expect(o.categorias.map((c) => c.valorTeto)).toEqual([59_500, 35_700, 23_800]);
  });

  it("registra gastos, comprometimento e estados", () => {
    const o = new OrcamentoMensal("2026-11", mensalidadeDemo(), 290_000);
    const alim = o.categoria("alimentacao"); // teto 357,00
    alim.registrarDespesa(20_000);
    expect(alim.estado).toBe("ok");
    alim.registrarDespesa(6_000); // 260 / 357 = 73%
    expect(alim.estado).toBe("atencao");
    expect(alim.excessoSeRegistrar(10_000)).toBe(300);
    alim.registrarDespesa(10_000);
    expect(alim.estado).toBe("estouro");
    expect(o.saldoRestante).toBe(119_000 - 36_000);
    expect(o.comprometimento).toBeCloseTo(36_000 / 119_000);
  });

  it("rejeita gasto zero e tetos que não somam 100", () => {
    const o = new OrcamentoMensal("2026-11", mensalidadeDemo(), 290_000);
    expect(() => o.categoria("moradia").registrarDespesa(0)).toThrow();
    expect(() => o.definirTetos([50, 30, 30])).toThrow();
  });

  it("renda menor que a parcela: saldo negativo e tetos zerados", () => {
    const o = new OrcamentoMensal("2026-11", mensalidadeDemo(), 100_000);
    expect(o.saldoLivre).toBe(-71_000);
    expect(o.categorias.every((c) => c.valorTeto === 0)).toBe(true);
  });

  it("remove gasto (desfazer)", () => {
    const o = new OrcamentoMensal("2026-11", mensalidadeDemo(), 290_000);
    const d = o.categoria("estudos").registrarDespesa(4_990);
    expect(o.removerDespesa(d.id)?.valor).toBe(4_990);
    expect(o.totalGasto).toBe(0);
  });

  it("ida e volta pelos dados serializados", () => {
    const m = mensalidadeDemo();
    const o = new OrcamentoMensal("2026-11", m, 290_000);
    o.fontes = { auxilio: 220_000, bolsaIC: 70_000 };
    o.definirTetos([45, 35, 20]);
    o.categoria("moradia").registrarDespesa(45_000, "2026-11-02T10:00:00.000Z");
    o.categoria("alimentacao").registrarDespesa(3_250, "2026-11-03T12:00:00.000Z");
    const copia = OrcamentoMensal.fromDados(JSON.parse(JSON.stringify(o.toDados())), m);
    expect(copia.toDados()).toEqual(o.toDados());
    expect(copia.despesas[0].valor).toBe(3_250);
  });
});

describe("armazenamento local", () => {
  it("funciona sem window (SSR) sem lançar erro", () => {
    expect(armazenamentoLocal.lerOrcamento()).toBeNull();
    expect(armazenamentoLocal.salvarOrcamento({} as never)).toBe(false);
    expect(CHAVE_ORCAMENTO).toMatch(/inatel/);
  });
});
