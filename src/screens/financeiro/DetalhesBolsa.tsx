"use client";

import { ExternalLink, FileText } from "lucide-react";
import { Tela } from "@/components/ui/Tela";
import { SecaoTitulo } from "@/components/ui/basicos";
import { Tabela } from "@/components/ui/dados";
import { useFinanceiro } from "@/store/Financeiro";
import { formatBRL } from "@/domain/money";
import { formatarData } from "@/domain/datas";
import { Sincronizando } from "./comum";
import { ESTILO_RENOVACAO, textoDias } from "./Resumo";

const DOCUMENTOS = [
  "Comprovante de renda de todos do grupo familiar",
  "Comprovante de residência atualizado",
  "Declaração de IR (ou de isenção) dos responsáveis",
  "Formulário socioeconômico preenchido na SAE",
];

/** Tela 6 · Detalhes da Bolsa (HTA 1.2, recomendação: discriminar cotas). */
export function DetalhesBolsa() {
  const { sincronizacao, mensalidade, hoje } = useFinanceiro();
  const bolsa = mensalidade?.bolsas[0];

  return (
    <Tela titulo="Detalhes da Bolsa" voltar={{ rotulo: "Voltar", href: "/app/financeiro" }} largura="media" className="pb-8">
      {sincronizacao !== "pronto" || !mensalidade || !bolsa ? (
        <Sincronizando />
      ) : (
        <div className="animate-surge">
          <h2 className="px-4 pb-2 pt-5 text-[17px] font-semibold">{bolsa.nome}</h2>
          <Tabela
            legenda="Cotas da bolsa"
            colunas={["Informação", "Valor"]}
            linhas={[
              { chave: "pct", celulas: ["Percentual total", `${bolsa.percentual}% · ${formatBRL(bolsa.calcularDesconto(mensalidade.valorBruto))}`] },
              {
                chave: "nr",
                celulas: ["Não reembolsável", `${bolsa.cotaNaoReembolsavel}% · ${formatBRL(bolsa.valorNaoReembolsavel(mensalidade.valorBruto))}`],
              },
              {
                chave: "r",
                celulas: ["Reembolsável", `${bolsa.cotaReembolsavel}% · ${formatBRL(bolsa.valorReembolsavel(mensalidade.valorBruto))}`],
              },
            ]}
          />

          <div className="px-4 pt-5">
            <div className="flex h-3 overflow-hidden rounded-full bg-white/10" aria-hidden>
              <span
                className="h-full bg-ok transition-[width] duration-700"
                style={{ width: `${(bolsa.cotaNaoReembolsavel / bolsa.percentual) * 100}%` }}
              />
              <span className="h-full flex-1 bg-atencao" />
            </div>
            <ul className="mt-2 flex gap-4 text-[13px]">
              <li className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-ok" aria-hidden /> Não reembolsável
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-atencao" aria-hidden /> Reembolsável
              </li>
            </ul>
            <p className="mt-3 text-[14px] leading-snug text-rotulo-2">
              A cota reembolsável é devolvida após a formatura. A não reembolsável é desconto definitivo.
            </p>
          </div>

          <SecaoTitulo>Renovação</SecaoTitulo>
          {(() => {
            const estilo = ESTILO_RENOVACAO[bolsa.nivelRenovacao(hoje)];
            return (
              <div className={`mx-4 flex items-center gap-3 rounded-xl border border-dashed p-3 ${estilo.borda}`} role="note">
                <estilo.Icone className={`size-6 shrink-0 ${estilo.texto}`} aria-hidden />
                <p className="text-[15px]">
                  <strong>Prazo de renovação na SAE</strong>
                  <span className="block text-[14px]">
                    até {formatarData(bolsa.dataRenovacao)}{" "}
                    <span className={estilo.texto}>({textoDias(bolsa.diasParaRenovacao(hoje))})</span>
                  </span>
                </p>
              </div>
            );
          })()}

          <SecaoTitulo>Documentos para renovar</SecaoTitulo>
          <ul className="space-y-2 px-4">
            {DOCUMENTOS.map((d) => (
              <li key={d} className="flex items-start gap-2 text-[15px]">
                <FileText className="mt-0.5 size-4 shrink-0 text-rotulo-2" aria-hidden />
                {d}
              </li>
            ))}
          </ul>

          <div className="px-4 pt-6">
            <a
              href="https://inatel.br/sae/"
              target="_blank"
              rel="noreferrer"
              className="toque flex h-12 items-center justify-center gap-2 rounded-lg border border-borda text-[17px] active:bg-white/10"
            >
              Abrir página da SAE <ExternalLink className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      )}
    </Tela>
  );
}
