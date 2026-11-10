import { parseBRL, type Centavos } from "./money";

export type TeclaValor = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "," | "apagar";

/** Aplica uma tecla ao texto do valor ("12,5"). Máximo 2 casas e 6 dígitos inteiros. */
export function aplicarTecla(texto: string, tecla: TeclaValor): string {
  if (tecla === "apagar") return texto.slice(0, -1);
  if (tecla === ",") {
    if (texto.includes(",")) return texto;
    return (texto || "0") + ",";
  }
  const [inteiro, decimais] = texto.split(",");
  if (decimais !== undefined) return decimais.length >= 2 ? texto : texto + tecla;
  if (inteiro === "0") return tecla;
  if (inteiro.length >= 6) return texto;
  return texto + tecla;
}

export function textoParaCentavos(texto: string): Centavos {
  return parseBRL(texto);
}
