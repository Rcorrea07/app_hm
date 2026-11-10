import { describe, expect, it } from "vitest";
import { OrcamentoMensal } from "./OrcamentoMensal";
import { SUBCATEGORIAS_SUGERIDAS } from "./CategoriaGasto";
import { mensalidadeDemo } from "./fixtures";

/** Saldo livre de R$ 1.190,00; Outros gastos (20%) = R$ 238,00. */
const novo = () => new OrcamentoMensal("2026-11", mensalidadeDemo(), 290_000);

describe("CategoriaGasto — Outros gastos e subcategorias", () => {
  it("só Outros gastos tem subcategorias, e já vem com as sugeridas", () => {
    const o = novo();
    expect(o.categoria("outros").nome).toBe("Outros gastos");
    expect(o.categoria("outros").subcategorias).toEqual([...SUBCATEGORIAS_SUGERIDAS]);
    expect(o.categoria("moradia").subcategorias).toEqual([]);
    expect(() => o.categoria("moradia").adicionarSubcategoria("Luz")).toThrow();
  });

  it("subcategoria é obrigatória em Outros e ignorada nas demais", () => {
    const o = novo();
    expect(() => o.categoria("outros").registrarDespesa(1_000)).toThrow("Escolha em que você gastou.");
    expect(() => o.categoria("outros").registrarDespesa(1_000, undefined, "Inexistente")).toThrow();
    const d = o.categoria("outros").registrarDespesa(1_000, undefined, "lazer");
    expect(d.subcategoria).toBe("Lazer");
    expect(o.categoria("moradia").registrarDespesa(1_000, undefined, "Lazer").subcategoria).toBeUndefined();
  });

  it("cria subcategoria nova normalizando o nome", () => {
    const c = novo().categoria("outros");
    expect(c.adicionarSubcategoria("  academia   e   saúde ")).toBe("Academia e saúde");
    expect(c.subcategorias).toContain("Academia e saúde");
    expect(() => c.adicionarSubcategoria("LAZER")).toThrow("já existe");
    expect(() => c.adicionarSubcategoria("   ")).toThrow();
    expect(() => c.adicionarSubcategoria("x".repeat(25))).toThrow();
  });

  it("todas as subcategorias descontam do mesmo teto e somam por subcategoria", () => {
    const o = novo();
    const outros = o.categoria("outros");
    expect(outros.valorTeto).toBe(23_800);
    outros.registrarDespesa(10_000, undefined, "Investimento");
    outros.registrarDespesa(5_000, undefined, "Lazer");
    outros.registrarDespesa(3_000, undefined, "Lazer");
    expect(outros.totalGasto).toBe(18_000);
    expect(outros.estado).toBe("atencao");
    expect(outros.totalPorSubcategoria()).toEqual([
      { nome: "Investimento", total: 10_000 },
      { nome: "Lazer", total: 8_000 },
    ]);
    expect(outros.excessoSeRegistrar(6_000)).toBe(200);
  });
});
