"use client";

import Link from "next/link";
import { ChevronRight, TriangleAlert, CalendarClock, CircleCheck } from "lucide-react";
import { Tela } from "@/components/ui/Tela";
import { BotaoLink, SecaoTitulo } from "@/components/ui/basicos";
import { Segmentado, Tabela } from "@/components/ui/dados";
import { useFinanceiro } from "@/store/Financeiro";
import { formatBRL } from "@/domain/money";
import { formatarData, formatarMes } from "@/domain/datas";
import type { NivelRenovacao } from "@/domain/Bolsa";
import { Sincronizando } from "./comum";

export const ESTILO_RENOVACAO: Record<NivelRenovacao, { borda: string; texto: string; Icone: typeof TriangleAlert }> = {
  tranquilo: { borda: "border-separador", texto: "text-rotulo-2", Icone: CalendarClock },
  atencao: { borda: "border-atencao/70", texto: "text-atencao", Icone: TriangleAlert },
  urgente: { borda: "border-estouro/80", texto: "text-estouro", Icone: TriangleAlert },
  vencida: { borda: "border-estouro/80", texto: "text-estouro", Icone: TriangleAlert },
};

export function textoDias(dias: number): string {
  if (dias < 0) return `venceu há ${-dias} ${-dias === 1 ? "dia" : "dias"}`;
  if (dias === 0) return "vence hoje";
  return `faltam ${dias} ${dias === 1 ? "dia" : "dias"}`;
}

/** Tela 5 · Resumo da Mensalidade (HTA 1.2). */
export function Resumo() {
  const { sincronizacao, mensalidade, orcamento, hoje } = useFinanceiro();

  return (
    <Tela titulo="Suporte Financeiro" voltar={{ rotulo: "Menu", href: "/app/menu" }} topo={<Segmentado ativo="resumo" />} largura="larga" className="pb-6">
      {sincronizacao !== "pronto" || !mensalidade ? (
        <Sincronizando />
      ) : (
        <div className="animate-surge amplo:grid amplo:grid-cols-2 amplo:gap-8 amplo:pt-2">
          <div>
          <p className="flex items-center justify-center gap-1.5 pt-3 text-[12px] text-rotulo-2">
            <CircleCheck className="size-3.5 text-ok" aria-hidden />
            Dados do Portal Acadêmico / SAE · atualizado hoje
          </p>

          <h2 className="px-4 pb-2 pt-4 text-[17px] font-semibold">Mensalidade · {formatarMes(mensalidade.mesReferencia)}</h2>
          <Tabela
            legenda="Resumo da mensalidade"
            colunas={["Descrição", "Valor"]}
            linhas={[
              { chave: "bruto", celulas: ["Valor bruto", formatBRL(mensalidade.valorBruto)] },
              {
                chave: "desc",
                celulas: [`Desconto da bolsa (${mensalidade.percentualDesconto}%)`, `− ${formatBRL(mensalidade.descontoAplicado)}`],
                tom: "text-ok",
              },
              { chave: "liq", celulas: ["Parcela líquida", formatBRL(mensalidade.parcelaLiquida)], forte: true },
              { chave: "venc", celulas: ["Vencimento", formatarData(mensalidade.dataVencimento)] },
            ]}
          />

          </div>
          <div>
          <SecaoTitulo>Sua bolsa</SecaoTitulo>
          {mensalidade.bolsas.map((b) => {
            const nivel = b.nivelRenovacao(hoje);
            const estilo = ESTILO_RENOVACAO[nivel];
            return (
              <div key={b.tipo}>
                <Link
                  href="/app/financeiro/bolsa"
                  className="toque flex min-h-14 items-center gap-3 border-y border-separador/70 px-4 py-2.5 active:bg-sobre/10"
                >
                  <span className="flex-1">
                    <span className="block text-[17px]">
                      Bolsa {b.tipo} · {b.percentual}%
                    </span>
                    <span className="block text-[14px] text-rotulo-2">
                      Não reembolsável {b.cotaNaoReembolsavel}% · Reembolsável {b.cotaReembolsavel}%
                    </span>
                  </span>
                  <ChevronRight className="size-5 text-rotulo-3" aria-hidden />
                </Link>
                {b.verificarRenovacao(hoje) && (
                  <div className={`mx-4 mt-3 flex items-center gap-3 rounded-xl border border-dashed p-3 ${estilo.borda}`} role="note">
                    <estilo.Icone className={`size-5 shrink-0 ${estilo.texto}`} aria-hidden />
                    <p className="text-[15px]">
                      <strong>Renovação na SAE até {formatarData(b.dataRenovacao)}</strong>
                      <span className={`block text-[13px] ${estilo.texto}`}>{textoDias(b.diasParaRenovacao(hoje))}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="space-y-2 px-4 pt-6">
            {orcamento ? (
              <>
                <BotaoLink href="/app/financeiro/orcamento">Ver orçamento do mês</BotaoLink>
                <BotaoLink href="/app/financeiro/planejar/renda" variante="texto">
                  Replanejar orçamento
                </BotaoLink>
              </>
            ) : (
              <BotaoLink href="/app/financeiro/planejar/renda">Planejar orçamento do mês</BotaoLink>
            )}
            <p className="pt-1 text-center text-[13px] text-rotulo-2">Toque na bolsa para ver os detalhes</p>
          </div>
          </div>
        </div>
      )}
    </Tela>
  );
}
