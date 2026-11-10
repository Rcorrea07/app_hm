import { describe, expect, it } from "vitest";
import { Aluno } from "./Aluno";
import { dadosDoPortal, SuporteFinanceiro } from "./SuporteFinanceiro";

describe("Aluno e SuporteFinanceiro", () => {
  it("autenticação simulada", () => {
    const a = new Aluno({ nome: "Lucas Andrade", matricula: "512", periodo: 4, curso: "GES", email: "x" });
    expect(a.autenticar("512", "senha")).toBe(true);
    expect(a.autenticar("512", " ")).toBe(false);
    expect(a.autenticar("999", "senha")).toBe(false);
  });

  it("dados do portal acompanham a data de hoje", () => {
    const d = dadosDoPortal("2026-11-10");
    expect(d.mesReferencia).toBe("2026-11");
    expect(d.dataVencimento).toBe("2026-11-15");
    expect(d.bolsas[0].dataRenovacao).toBe("2026-12-05");
    expect(dadosDoPortal("2026-12-20").mesReferencia).toBe("2027-01");
  });

  it("troca de aba e sincroniza", async () => {
    const s = new SuporteFinanceiro();
    s.abrirOrcamento();
    expect(s.telaAtiva).toBe("orcamento");
    s.abrirResumo();
    expect(s.telaAtiva).toBe("resumo");
    const m = await s.sincronizarPortal("2026-11-10", 0);
    expect(m.parcelaLiquida).toBe(171_000);
  });
});
