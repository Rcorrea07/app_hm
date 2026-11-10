import type { Centavos } from "./money";
import type { CategoriaId } from "./CategoriaGasto";
import { armazenamentoLocal } from "./armazenamentoLocal";

export interface DespesaDados {
  id: string;
  valor: Centavos;
  /** Data e hora ISO completas. */
  data: string;
  categoriaId: CategoriaId;
  /** Só em "Outros gastos": Lazer, Investimento, Viagem… */
  subcategoria?: string;
}

let contador = 0;
function novoId(): string {
  contador += 1;
  return `d${Date.now().toString(36)}${contador.toString(36)}`;
}

/** Classe Despesa do diagrama: gasto pessoal, gravado só no aparelho. */
export class Despesa {
  readonly id: string;
  readonly valor: Centavos;
  readonly data: string;
  readonly categoriaId: CategoriaId;
  readonly subcategoria?: string;

  constructor(dados: Omit<DespesaDados, "id" | "data"> & Partial<Pick<DespesaDados, "id" | "data">>) {
    if (!Number.isInteger(dados.valor) || dados.valor <= 0) {
      throw new RangeError("O valor do gasto deve ser maior que zero.");
    }
    this.id = dados.id ?? novoId();
    this.valor = dados.valor;
    this.data = dados.data ?? new Date().toISOString();
    this.categoriaId = dados.categoriaId;
    this.subcategoria = dados.subcategoria;
  }

  /** Grava este gasto no armazenamento local do celular (nunca em servidor). */
  salvarLocal(): boolean {
    return armazenamentoLocal.salvarDespesa(this.toDados());
  }

  toDados(): DespesaDados {
    const dados: DespesaDados = { id: this.id, valor: this.valor, data: this.data, categoriaId: this.categoriaId };
    if (this.subcategoria) dados.subcategoria = this.subcategoria;
    return dados;
  }
}
