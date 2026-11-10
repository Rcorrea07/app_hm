import { describe, expect, it } from "vitest";
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
