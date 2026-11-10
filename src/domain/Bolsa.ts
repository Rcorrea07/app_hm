import type { Centavos } from "./money";
import { diasEntre, type DataISO } from "./datas";

export type TipoBolsa = "Finatel" | "Fundacred" | "FIES" | "Beneficente" | "Merito";

export type NivelRenovacao = "tranquilo" | "atencao" | "urgente" | "vencida";

export interface BolsaDados {
  tipo: TipoBolsa;
  nome: string;
  /** Percentual total de desconto sobre o valor bruto (0–100). */
  percentual: number;
  /** Parte do percentual que não precisa ser devolvida (pontos percentuais). */
  cotaNaoReembolsavel: number;
  /** Parte do percentual devolvida após a formatura (pontos percentuais). */
  cotaReembolsavel: number;
  dataRenovacao: DataISO;
}

/** Classe Bolsa do diagrama: desconto aplicado sobre a mensalidade. */
export class Bolsa {
  readonly tipo: TipoBolsa;
  readonly nome: string;
  readonly percentual: number;
  readonly cotaNaoReembolsavel: number;
  readonly cotaReembolsavel: number;
  readonly dataRenovacao: DataISO;

  constructor(dados: BolsaDados) {
    if (dados.percentual < 0 || dados.percentual > 100) {
      throw new RangeError("Percentual da bolsa deve ficar entre 0 e 100.");
    }
    if (dados.cotaNaoReembolsavel + dados.cotaReembolsavel !== dados.percentual) {
      throw new RangeError("As cotas devem somar o percentual da bolsa.");
    }
    this.tipo = dados.tipo;
    this.nome = dados.nome;
    this.percentual = dados.percentual;
    this.cotaNaoReembolsavel = dados.cotaNaoReembolsavel;
    this.cotaReembolsavel = dados.cotaReembolsavel;
    this.dataRenovacao = dados.dataRenovacao;
  }

  calcularDesconto(valorBruto: Centavos): Centavos {
    return Math.round((valorBruto * this.percentual) / 100);
  }

  /** Valor em R$ da cota não reembolsável. */
  valorNaoReembolsavel(valorBruto: Centavos): Centavos {
    return Math.round((valorBruto * this.cotaNaoReembolsavel) / 100);
  }

  /** Valor em R$ da cota reembolsável. Fecha a conta com o desconto total. */
  valorReembolsavel(valorBruto: Centavos): Centavos {
    return this.calcularDesconto(valorBruto) - this.valorNaoReembolsavel(valorBruto);
  }

  diasParaRenovacao(hoje: DataISO): number {
    return diasEntre(hoje, this.dataRenovacao);
  }

  /** true quando o prazo de renovação na SAE pede atenção (≤ 30 dias ou vencido). */
  verificarRenovacao(hoje: DataISO): boolean {
    return this.diasParaRenovacao(hoje) <= 30;
  }

  nivelRenovacao(hoje: DataISO): NivelRenovacao {
    const dias = this.diasParaRenovacao(hoje);
    if (dias < 0) return "vencida";
    if (dias <= 7) return "urgente";
    if (dias <= 30) return "atencao";
    return "tranquilo";
  }

  toDados(): BolsaDados {
    return {
      tipo: this.tipo,
      nome: this.nome,
      percentual: this.percentual,
      cotaNaoReembolsavel: this.cotaNaoReembolsavel,
      cotaReembolsavel: this.cotaReembolsavel,
      dataRenovacao: this.dataRenovacao,
    };
  }
}
