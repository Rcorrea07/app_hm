import { Mensalidade, type MensalidadeDados } from "./Mensalidade";
import { hojeISO, somarDias, type DataISO } from "./datas";

export type TelaSuporte = "resumo" | "orcamento";

/**
 * Dados que o Portal Acadêmico / SAE devolveria para o aluno. São fictícios
 * (persona Lucas Andrade) e as datas andam junto com o dia de hoje, para a demo
 * nunca mostrar prazos vencidos.
 */
export function dadosDoPortal(hoje: DataISO = hojeISO()): MensalidadeDados {
  const [a, m, d] = hoje.split("-").map(Number);
  // Mensalidade vence no dia 15; depois disso, a próxima já é a do mês seguinte.
  const ref = new Date(Date.UTC(a, m - 1 + (d > 15 ? 1 : 0), 15));
  const mesReferencia = ref.toISOString().slice(0, 7);
  return {
    mesReferencia,
    valorBruto: 285_000,
    dataVencimento: ref.toISOString().slice(0, 10),
    bolsas: [
      {
        tipo: "Finatel",
        nome: "Bolsa Socioeconômica Finatel",
        percentual: 40,
        cotaNaoReembolsavel: 20,
        cotaReembolsavel: 20,
        dataRenovacao: somarDias(hoje, 25),
      },
    ],
  };
}

/** Classe SuporteFinanceiro do diagrama: ponto de entrada do módulo novo. */
export class SuporteFinanceiro {
  telaAtiva: TelaSuporte = "resumo";

  abrirResumo(): void {
    this.telaAtiva = "resumo";
  }

  abrirOrcamento(): void {
    this.telaAtiva = "orcamento";
  }

  /** Simula a ida ao Portal Acadêmico / SAE (com atraso de rede). */
  async sincronizarPortal(hoje: DataISO = hojeISO(), atrasoMs = 900): Promise<Mensalidade> {
    await new Promise((r) => setTimeout(r, atrasoMs));
    return new Mensalidade(dadosDoPortal(hoje));
  }
}
