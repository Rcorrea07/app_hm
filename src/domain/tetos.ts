/** Divisão sugerida do saldo livre: Moradia 50%, Alimentação 30%, Estudos 20%. */
export const DIVISAO_SUGERIDA: readonly [number, number, number] = [50, 30, 20];

/**
 * Muda o percentual de uma categoria e redistribui a diferença nas outras,
 * na proporção que elas já tinham. O total continua exatamente 100.
 */
export function redistribuir(percentuais: readonly number[], indice: number, novoValor: number): number[] {
  const novo = Math.max(0, Math.min(100, Math.round(novoValor)));
  const outros = percentuais.map((_, i) => i).filter((i) => i !== indice);
  const alvo = 100 - novo;
  const pesoTotal = outros.reduce((t, i) => t + percentuais[i], 0);

  const brutos = outros.map((i) =>
    pesoTotal > 0 ? (percentuais[i] / pesoTotal) * alvo : alvo / outros.length,
  );
  const inteiros = brutos.map(Math.floor);
  let sobra = alvo - inteiros.reduce((t, v) => t + v, 0);

  // Maior resto primeiro, para fechar a soma em 100.
  const ordem = brutos
    .map((v, k) => ({ k, resto: v - Math.floor(v) }))
    .sort((a, b) => b.resto - a.resto);
  for (const { k } of ordem) {
    if (sobra <= 0) break;
    inteiros[k] += 1;
    sobra -= 1;
  }

  const resultado = [...percentuais];
  resultado[indice] = novo;
  outros.forEach((i, k) => {
    resultado[i] = inteiros[k];
  });
  return resultado;
}

export function somaPercentuais(percentuais: readonly number[]): number {
  return percentuais.reduce((t, v) => t + v, 0);
}
