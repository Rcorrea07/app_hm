import { describe, expect, it } from "vitest";
import { formatBRL, parseBRL, digitosParaCentavos, porcento } from "./money";

const sp = (s: string) => s.replace(/\u00a0/g, " ");

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
