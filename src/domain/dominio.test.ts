import { describe, expect, it, beforeEach } from "vitest";
import { formatBRL, parseBRL, digitosParaCentavos, porcento } from "./money";
import { diasEntre, somarDias, formatarData, formatarMes } from "./datas";
import { Bolsa } from "./Bolsa";
import { Mensalidade } from "./Mensalidade";
import { OrcamentoMensal } from "./OrcamentoMensal";
import { redistribuir, somaPercentuais } from "./tetos";
import { Aluno } from "./Aluno";
import { dadosDoPortal, SuporteFinanceiro } from "./SuporteFinanceiro";
import { armazenamentoLocal, CHAVE_ORCAMENTO } from "./armazenamentoLocal";

const sp = (s: string) => s.replace(/ /g, " ");

const finatel40 = {
  tipo: "Finatel" as const,
  nome: "Bolsa Socioeconômica Finatel",
  percentual: 40,
  cotaNaoReembolsavel: 20,
  cotaReembolsavel: 20,
  dataRenovacao: "2026-12-05",
};

function mensalidadeDemo() {
  return new Mensalidade({
    mesReferencia: "2026-11",
    valorBruto: 285_000,
    dataVencimento: "2026-11-15",
    bolsas: [finatel40],
  });
}

describe("money", () => {
  it("formata em reais", () => {
    expect(sp(formatBRL(285_000))).toBe("R$ 2.850,00");
    expect(sp(formatBRL(-1_500))).toBe("-R$ 15,00");
  });
  it("lê texto em reais", () => {
    expect(parseBRL("R$ 2.850,50")).toBe(285_050);
    expect(parseBRL("12,5")).toBe(1_250);
    expect(parseBRL("")).toBe(0);
  });
  it("máscara de digitação em centavos", () => {
    expect(digitosParaCentavos("R$ 1.234,56")).toBe(123_456);
    expect(digitosParaCentavos("abc")).toBe(0);
  });
  it("porcentagem", () => {
    expect(porcento(0.705)).toBe("71%");
  });
});

describe("datas", () => {
  it("conta dias e formata", () => {
    expect(diasEntre("2026-11-10", "2026-12-05")).toBe(25);
    expect(somarDias("2026-11-10", 25)).toBe("2026-12-05");
    expect(formatarData("2026-12-05")).toBe("05/12/2026");
    expect(formatarMes("2026-11")).toBe("novembro/2026");
  });
});

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

describe("tetos", () => {
  it("redistribui mantendo 100%", () => {
    const r = redistribuir([50, 30, 20], 0, 60);
    expect(r).toEqual([60, 24, 16]);
    expect(somaPercentuais(r)).toBe(100);
  });
  it("quando os outros estão zerados, divide igual", () => {
    expect(redistribuir([100, 0, 0], 0, 40)).toEqual([40, 30, 30]);
  });
  it("sempre soma 100 com valores quebrados", () => {
    for (let v = 0; v <= 100; v += 7) {
      expect(somaPercentuais(redistribuir([33, 33, 34], 1, v))).toBe(100);
    }
  });
});

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

import { aplicarTecla, textoParaCentavos } from "./teclado";
describe("teclado numérico", () => {
  const digitar = (teclas: string[]) =>
    teclas.reduce((t, k) => aplicarTecla(t, k as Parameters<typeof aplicarTecla>[1]), "");
  it("monta valores com vírgula e limita a 2 casas", () => {
    expect(digitar(["3", "2", ",", "5", "0", "9"])).toBe("32,50");
    expect(textoParaCentavos("32,50")).toBe(3_250);
  });
  it("vírgula no começo vira 0, e zero à esquerda some", () => {
    expect(digitar([",", "5"])).toBe("0,5");
    expect(digitar(["0", "7"])).toBe("7");
  });
  it("apagar e vírgula repetida", () => {
    expect(digitar(["1", ",", ",", "2", "apagar", "apagar"])).toBe("1");
  });
});
