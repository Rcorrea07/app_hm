/** Valores monetários são sempre inteiros em centavos. */
export type Centavos = number;

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** 285000 → "R$ 2.850,00" (com espaço inseparável depois de "R$"). */
export function formatBRL(valor: Centavos): string {
  return formatador.format(valor / 100);
}

/** Versão curta sem centavos quando o valor é redondo: 59500 → "R$ 595". */
export function formatBRLCurto(valor: Centavos): string {
  if (valor % 100 === 0) {
    return `R$ ${new Intl.NumberFormat("pt-BR").format(valor / 100)}`;
  }
  return formatBRL(valor);
}

/** "2.850,50" ou "R$ 2.850,50" → 285050. Texto sem número → 0. */
export function parseBRL(texto: string): Centavos {
  const limpo = texto.replace(/[^\d,]/g, "");
  if (!limpo) return 0;
  const [inteiro, decimais = ""] = limpo.split(",");
  const reais = Number.parseInt(inteiro || "0", 10);
  const cent = Number.parseInt((decimais + "00").slice(0, 2), 10);
  return reais * 100 + cent;
}

/** Máscara de digitação estilo caixa eletrônico: "123" → 123 centavos. */
export function digitosParaCentavos(texto: string): Centavos {
  const digitos = texto.replace(/\D/g, "").slice(0, 9);
  return digitos ? Number.parseInt(digitos, 10) : 0;
}

export function reais(valor: number): Centavos {
  return Math.round(valor * 100);
}

/** Proporção em % inteiro, para exibir. */
export function porcento(proporcao: number): string {
  if (!Number.isFinite(proporcao)) return "—";
  return `${Math.round(proporcao * 100)}%`;
}
