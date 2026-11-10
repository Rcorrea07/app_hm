import type { Centavos } from "./money";
import type { Mensalidade } from "./Mensalidade";
import {
  CategoriaGasto,
  CATEGORIAS,
  SUBCATEGORIAS_SUGERIDAS,
  estadoPorComprometimento,
  type CategoriaId,
  type FonteDeTeto,
} from "./CategoriaGasto";
import { Despesa, type DespesaDados } from "./Despesa";
import { DIVISAO_SUGERIDA, somaPercentuais } from "./tetos";
import { armazenamentoLocal } from "./armazenamentoLocal";

export type FonteRenda = "auxilio" | "estagio" | "bolsaIC";

export const FONTES_RENDA: ReadonlyArray<{ id: FonteRenda; nome: string }> = [
  { id: "auxilio", nome: "Auxílio familiar" },
  { id: "estagio", nome: "Estágio" },
  { id: "bolsaIC", nome: "Bolsa IC" },
];

/** Forma serializável, gravada no localStorage. */
export interface OrcamentoDados {
  mesReferencia: string;
  rendaMensal: Centavos;
  /** Detalhe da renda por fonte (só para a tela; a regra usa rendaMensal). */
  fontes: Partial<Record<FonteRenda, Centavos>>;
  percentuais: Record<CategoriaId, number>;
  despesas: DespesaDados[];
  /** Subcategorias de "Outros gastos" criadas pelo aluno (as sugeridas vêm do código). */
  subcategorias?: string[];
}

/** Subcategoria que recebe os gastos da antiga categoria "Estudos / Material". */
const SUBCATEGORIA_ESTUDOS = SUBCATEGORIAS_SUGERIDAS[0];

/**
 * Converte dados gravados na versão anterior (3ª categoria "estudos") para
 * "outros" + subcategoria "Estudos / Material". Dados novos passam sem mudança.
 */
export function migrarDados(dados: OrcamentoDados): OrcamentoDados {
  const antigos = dados as OrcamentoDados & { percentuais: Record<string, number> };
  const pct: Record<string, number> = { ...antigos.percentuais };
  if (pct.estudos !== undefined && pct.outros === undefined) {
    pct.outros = pct.estudos;
    delete pct.estudos;
  }
  const despesas = dados.despesas.map((d) =>
    (d.categoriaId as string) === "estudos" ? { ...d, categoriaId: "outros" as const, subcategoria: SUBCATEGORIA_ESTUDOS } : d,
  );
  return { ...dados, percentuais: pct as Record<CategoriaId, number>, despesas };
}

/** Classe OrcamentoMensal do diagrama: contém 3 CategoriaGasto e usa a parcela líquida. */
export class OrcamentoMensal implements FonteDeTeto {
  readonly mesReferencia: string;
  private _rendaMensal: Centavos = 0;
  fontes: Partial<Record<FonteRenda, Centavos>> = {};
  readonly categorias: CategoriaGasto[];
  private readonly mensalidade: Mensalidade;

  constructor(mesReferencia: string, mensalidade: Mensalidade, rendaMensal: Centavos = 0) {
    this.mesReferencia = mesReferencia;
    this.mensalidade = mensalidade;
    this.categorias = CATEGORIAS.map((c, i) => new CategoriaGasto(c.id, DIVISAO_SUGERIDA[i], this));
    this.informarRenda(rendaMensal);
  }

  get rendaMensal(): Centavos {
    return this._rendaMensal;
  }

  informarRenda(valor: Centavos): void {
    if (!Number.isInteger(valor) || valor < 0) {
      throw new RangeError("A renda deve ser um inteiro em centavos ≥ 0.");
    }
    this._rendaMensal = valor;
  }

  /** Saldo livre pós-mensalidade: renda − parcela líquida. Pode ser negativo. */
  calcularSaldoLivre(m: Mensalidade = this.mensalidade): Centavos {
    return this._rendaMensal - m.parcelaLiquida;
  }

  get saldoLivre(): Centavos {
    return this.calcularSaldoLivre();
  }

  sugerirTetos(): void {
    this.categorias.forEach((c, i) => c.definirTeto(DIVISAO_SUGERIDA[i]));
  }

  definirTetos(percentuais: readonly number[]): void {
    if (somaPercentuais(percentuais) !== 100) {
      throw new RangeError("Os tetos precisam somar 100%.");
    }
    this.categorias.forEach((c, i) => c.definirTeto(percentuais[i]));
  }

  get percentuais(): number[] {
    return this.categorias.map((c) => c.percentualTeto);
  }

  /**
   * Teto em R$ de uma categoria. As duas primeiras são arredondadas para baixo e a
   * última recebe o resto, para a soma dos tetos bater com o saldo livre ao centavo.
   */
  tetoDe(categoria: CategoriaGasto): Centavos {
    const base = Math.max(0, this.saldoLivre);
    const fecha100 = somaPercentuais(this.percentuais) === 100;
    const indice = this.categorias.indexOf(categoria);
    const parcial = (c: CategoriaGasto) => Math.floor((base * c.percentualTeto) / 100);
    if (fecha100 && indice === this.categorias.length - 1) {
      return base - this.categorias.slice(0, -1).reduce((t, c) => t + parcial(c), 0);
    }
    return parcial(categoria);
  }

  categoria(id: CategoriaId): CategoriaGasto {
    const c = this.categorias.find((x) => x.id === id);
    if (!c) throw new Error(`Categoria desconhecida: ${id}`);
    return c;
  }

  get totalGasto(): Centavos {
    return this.categorias.reduce((t, c) => t + c.totalGasto, 0);
  }

  calcularSaldoRestante(): Centavos {
    return this.saldoLivre - this.totalGasto;
  }

  get saldoRestante(): Centavos {
    return this.calcularSaldoRestante();
  }

  /** Proporção do saldo livre já gasta (1 = 100%). */
  get comprometimento(): number {
    const livre = this.saldoLivre;
    if (livre <= 0) return this.totalGasto > 0 ? 1 : 0;
    return this.totalGasto / livre;
  }

  get estado() {
    return estadoPorComprometimento(this.comprometimento);
  }

  /** Todas as despesas do mês, mais recentes primeiro. */
  get despesas(): Despesa[] {
    return this.categorias
      .flatMap((c) => c.despesas)
      .sort((a, b) => b.data.localeCompare(a.data));
  }

  removerDespesa(id: string): Despesa | undefined {
    for (const c of this.categorias) {
      const i = c.despesas.findIndex((d) => d.id === id);
      if (i >= 0) return c.despesas.splice(i, 1)[0];
    }
    return undefined;
  }

  salvarLocal(): boolean {
    return armazenamentoLocal.salvarOrcamento(this.toDados());
  }

  toDados(): OrcamentoDados {
    const percentuais = Object.fromEntries(
      this.categorias.map((c) => [c.id, c.percentualTeto]),
    ) as Record<CategoriaId, number>;
    return {
      mesReferencia: this.mesReferencia,
      rendaMensal: this._rendaMensal,
      fontes: { ...this.fontes },
      percentuais,
      despesas: this.despesas.map((d) => d.toDados()),
      subcategorias: this.categoria("outros").subcategorias.filter((s) => !SUBCATEGORIAS_SUGERIDAS.includes(s)),
    };
  }

  static fromDados(salvos: OrcamentoDados, mensalidade: Mensalidade): OrcamentoMensal {
    const dados = migrarDados(salvos);
    const o = new OrcamentoMensal(dados.mesReferencia, mensalidade, dados.rendaMensal);
    const outros = o.categoria("outros");
    for (const s of dados.subcategorias ?? []) {
      if (!outros.subcategoria(s)) outros.subcategorias.push(s);
    }
    o.fontes = { ...dados.fontes };
    o.definirTetos(CATEGORIAS.map((c) => dados.percentuais[c.id] ?? 0));
    for (const d of [...dados.despesas].reverse()) {
      if (d.subcategoria && d.categoriaId === "outros" && !outros.subcategoria(d.subcategoria)) {
        outros.subcategorias.push(d.subcategoria);
      }
      o.categoria(d.categoriaId).despesas.push(new Despesa(d));
    }
    return o;
  }
}
