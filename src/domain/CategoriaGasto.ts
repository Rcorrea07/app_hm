import type { Centavos } from "./money";
import { Despesa } from "./Despesa";

export type CategoriaId = "moradia" | "alimentacao" | "outros";

export type EstadoCategoria = "ok" | "atencao" | "estouro";

export const CATEGORIAS: ReadonlyArray<{ id: CategoriaId; nome: string; curto: string }> = [
  { id: "moradia", nome: "Moradia / República", curto: "Moradia" },
  { id: "alimentacao", nome: "Alimentação", curto: "Alimentação" },
  { id: "outros", nome: "Outros gastos", curto: "Outros" },
];

/** Subcategorias que já vêm prontas em "Outros gastos" (o aluno pode criar mais). */
export const SUBCATEGORIAS_SUGERIDAS: readonly string[] = ["Estudos / Material", "Lazer", "Investimento", "Viagem / Transporte"];

/** Só "Outros gastos" é dividido em subcategorias. */
export function temSubcategorias(id: CategoriaId): boolean {
  return id === "outros";
}

export const LIMITE_NOME_SUBCATEGORIA = 24;

const chave = (nome: string) => nome.trim().toLocaleLowerCase("pt-BR");

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

/**
 * Classe CategoriaGasto do diagrama: OrcamentoMensal contém 3; registra 0..* Despesa.
 * "Outros gastos" tem um teto só, dividido em subcategorias (Lazer, Investimento…).
 */
export class CategoriaGasto {
  readonly id: CategoriaId;
  readonly nome: string;
  private _percentualTeto: number;
  private readonly orcamento: FonteDeTeto;
  readonly despesas: Despesa[] = [];
  /** Sugeridas + criadas pelo aluno. Vazia nas categorias sem subcategorias. */
  readonly subcategorias: string[];

  constructor(id: CategoriaId, percentualTeto: number, orcamento: FonteDeTeto) {
    this.id = id;
    this.nome = nomeCategoria(id);
    this._percentualTeto = 0;
    this.orcamento = orcamento;
    this.subcategorias = temSubcategorias(id) ? [...SUBCATEGORIAS_SUGERIDAS] : [];
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

  /** Encontra a subcategoria pelo nome, sem diferenciar maiúsculas. */
  subcategoria(nome: string): string | undefined {
    return this.subcategorias.find((s) => chave(s) === chave(nome));
  }

  /** Cria uma subcategoria nova e devolve o nome já normalizado. */
  adicionarSubcategoria(nome: string): string {
    if (!temSubcategorias(this.id)) {
      throw new Error(`${this.nome} não tem subcategorias.`);
    }
    const limpo = nome.trim().replace(/\s+/g, " ");
    if (!limpo) throw new RangeError("Dê um nome para a subcategoria.");
    if (limpo.length > LIMITE_NOME_SUBCATEGORIA) {
      throw new RangeError(`Use até ${LIMITE_NOME_SUBCATEGORIA} caracteres.`);
    }
    if (this.subcategoria(limpo)) throw new RangeError("Essa subcategoria já existe.");
    const formatado = limpo.charAt(0).toLocaleUpperCase("pt-BR") + limpo.slice(1);
    this.subcategorias.push(formatado);
    return formatado;
  }

  registrarDespesa(valor: Centavos, data?: string, subcategoria?: string): Despesa {
    let sub: string | undefined;
    if (temSubcategorias(this.id)) {
      sub = subcategoria ? this.subcategoria(subcategoria) : undefined;
      if (!sub) throw new RangeError("Escolha em que você gastou.");
    }
    const despesa = new Despesa({ valor, categoriaId: this.id, data, subcategoria: sub });
    this.despesas.push(despesa);
    return despesa;
  }

  /** Quanto foi gasto em cada subcategoria (só as que têm gasto), do maior para o menor. */
  totalPorSubcategoria(): Array<{ nome: string; total: Centavos }> {
    const totais = new Map<string, Centavos>();
    for (const d of this.despesas) {
      if (!d.subcategoria) continue;
      totais.set(d.subcategoria, (totais.get(d.subcategoria) ?? 0) + d.valor);
    }
    return [...totais].map(([nome, total]) => ({ nome, total })).sort((a, b) => b.total - a.total);
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
