import type { DespesaDados } from "./Despesa";
import type { OrcamentoDados } from "./OrcamentoMensal";

/**
 * Único lugar que toca o localStorage. Os gastos pessoais nunca saem do aparelho
 * (requisito de privacidade do User Story). Toda leitura e escrita tem try/catch,
 * porque o armazenamento pode estar bloqueado (aba anônima, cota cheia).
 */
export const CHAVE_ORCAMENTO = "inatel-planejador:v1";

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export const armazenamentoLocal = {
  lerOrcamento(): OrcamentoDados | null {
    try {
      const bruto = storage()?.getItem(CHAVE_ORCAMENTO);
      return bruto ? (JSON.parse(bruto) as OrcamentoDados) : null;
    } catch {
      return null;
    }
  },

  salvarOrcamento(dados: OrcamentoDados): boolean {
    try {
      const s = storage();
      if (!s) return false;
      s.setItem(CHAVE_ORCAMENTO, JSON.stringify(dados));
      return true;
    } catch {
      return false;
    }
  },

  /** Insere ou atualiza um gasto dentro do orçamento salvo. */
  salvarDespesa(despesa: DespesaDados): boolean {
    const atual = armazenamentoLocal.lerOrcamento();
    if (!atual) return false;
    const despesas = atual.despesas.filter((d) => d.id !== despesa.id);
    despesas.push(despesa);
    return armazenamentoLocal.salvarOrcamento({ ...atual, despesas });
  },

  apagarTudo(): void {
    try {
      storage()?.removeItem(CHAVE_ORCAMENTO);
    } catch {
      /* nada a fazer */
    }
  },
};
