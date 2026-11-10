import type { Centavos } from "./money";
import { Despesa } from "./Despesa";

export type CategoriaId = "moradia" | "alimentacao" | "estudos";

export type EstadoCategoria = "ok" | "atencao" | "estouro";

export const CATEGORIAS: ReadonlyArray<{ id: CategoriaId; nome: string; curto: string }> = [
  { id: "moradia", nome: "Moradia / República", curto: "Moradia" },
  { id: "alimentacao", nome: "Alimentação", curto: "Alimentação" },
  { id: "estudos", nome: "Estudos / Material", curto: "Estudos" },
];

export function nomeCategoria(id: CategoriaId): string {
  return CATEGORIAS.find((c) => c.id === id)?.nome ?? id;
}

/** O teto de cada categoria depende do saldo livre do orçamento que a contém. */
export interface FonteDeTeto {
  tetoDe(categoria: CategoriaGasto): Centavos;
}

export function estadoPorComprometimento(proporcao: number): EstadoCategoria {
  if (proporcao >= 1) return "estouro";
  if (proporcao >= 0.7) return "atencao";
  return "ok";
}

/** Classe CategoriaGasto do diagrama: OrcamentoMensal contém 3; registra 0..* Despesa. */
export class CategoriaGasto {
  readonly id: CategoriaId;
  readonly nome: string;
  private _percentualTeto: number;
  private readonly orcamento: FonteDeTeto;
  readonly despesas: Despesa[] = [];

  constructor(id: CategoriaId, percentualTeto: number, orcamento: FonteDeTeto) {
    this.id = id;
    this.nome = nomeCategoria(id);
    this._percentualTeto = 0;
    this.orcamento = orcamento;
    this.definirTeto(percentualTeto);
  }

  get percentualTeto(): number {
    return this._percentualTeto;
  }

  /** Derivado: parte do saldo livre reservada para esta categoria. */
  get valorTeto(): Centavos {
    return this.orcamento.tetoDe(this);
  }

  /** Derivado: soma dos gastos registrados. */
  get totalGasto(): Centavos {
    return this.despesas.reduce((t, d) => t + d.valor, 0);
  }

  get disponivel(): Centavos {
    return this.valorTeto - this.totalGasto;
  }

  definirTeto(percentual: number): void {
    if (!Number.isInteger(percentual) || percentual < 0 || percentual > 100) {
      throw new RangeError("O teto deve ser um percentual inteiro entre 0 e 100.");
    }
    this._percentualTeto = percentual;
  }

  registrarDespesa(valor: Centavos, data?: string): Despesa {
    const despesa = new Despesa({ valor, categoriaId: this.id, data });
    this.despesas.push(despesa);
    return despesa;
  }

  /** Proporção gasto / teto (1 = 100%). Sem teto e com gasto, conta como estouro. */
  calcularComprometimento(): number {
    const teto = this.valorTeto;
    if (teto <= 0) return this.totalGasto > 0 ? 1 : 0;
    return this.totalGasto / teto;
  }

  get estado(): EstadoCategoria {
    return estadoPorComprometimento(this.calcularComprometimento());
  }

  /** Quanto este valor passaria do teto (0 se não passa). */
  excessoSeRegistrar(valor: Centavos): Centavos {
    return Math.max(0, this.totalGasto + valor - this.valorTeto);
  }
}
