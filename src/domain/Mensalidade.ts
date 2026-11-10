import { Bolsa, type BolsaDados } from "./Bolsa";
import type { Centavos } from "./money";
import type { DataISO } from "./datas";

export interface MensalidadeDados {
  /** "AAAA-MM" */
  mesReferencia: string;
  valorBruto: Centavos;
  dataVencimento: DataISO;
  bolsas: BolsaDados[];
}

export interface ResumoMensalidade {
  mesReferencia: string;
  valorBruto: Centavos;
  percentualDesconto: number;
  descontoAplicado: Centavos;
  parcelaLiquida: Centavos;
  dataVencimento: DataISO;
}

/** Classe Mensalidade do diagrama: Mensalidade "aplica" 0..* Bolsa. */
export class Mensalidade {
  readonly mesReferencia: string;
  readonly valorBruto: Centavos;
  readonly dataVencimento: DataISO;
  readonly bolsas: Bolsa[];

  constructor(dados: MensalidadeDados) {
    if (!Number.isInteger(dados.valorBruto) || dados.valorBruto < 0) {
      throw new RangeError("Valor bruto deve ser um inteiro em centavos ≥ 0.");
    }
    this.mesReferencia = dados.mesReferencia;
    this.valorBruto = dados.valorBruto;
    this.dataVencimento = dados.dataVencimento;
    this.bolsas = dados.bolsas.map((b) => new Bolsa(b));
  }

  /** Derivado: soma dos descontos, nunca maior que o valor bruto. */
  get descontoAplicado(): Centavos {
    const soma = this.bolsas.reduce((t, b) => t + b.calcularDesconto(this.valorBruto), 0);
    return Math.min(soma, this.valorBruto);
  }

  /** Derivado: valor que o aluno paga no mês. */
  get parcelaLiquida(): Centavos {
    return this.valorBruto - this.descontoAplicado;
  }

  get percentualDesconto(): number {
    return Math.min(100, this.bolsas.reduce((t, b) => t + b.percentual, 0));
  }

  calcularParcelaLiquida(): Centavos {
    return this.parcelaLiquida;
  }

  exibirResumo(): ResumoMensalidade {
    return {
      mesReferencia: this.mesReferencia,
      valorBruto: this.valorBruto,
      percentualDesconto: this.percentualDesconto,
      descontoAplicado: this.descontoAplicado,
      parcelaLiquida: this.parcelaLiquida,
      dataVencimento: this.dataVencimento,
    };
  }
}
