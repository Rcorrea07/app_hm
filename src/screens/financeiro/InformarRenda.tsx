"use client";

import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { Tela } from "@/components/ui/Tela";
import { Botao, Chip, NotaPrivacidade } from "@/components/ui/basicos";
import { Passos, ValorAnimado } from "@/components/ui/dados";
import { CampoDinheiro } from "@/components/ui/entradas";
import { useFinanceiro } from "@/store/Financeiro";
import { useRoteiro } from "@/tour/Roteiro";
import { FONTES_RENDA } from "@/domain/OrcamentoMensal";
import { formatBRL } from "@/domain/money";
import { Sincronizando } from "./comum";

/** Tela 7 · Informar Renda (HTA 2.1). */
export function InformarRenda() {
  const router = useRouter();
  const fin = useFinanceiro();
  const { marcar } = useRoteiro();
  const { rascunho, previa, mensalidade } = fin;

  const saldo = previa?.saldoLivre ?? 0;
  const semRenda = fin.rendaRascunho === 0;
  const insuficiente = !semRenda && saldo <= 0;

  function continuar() {
    marcar("2.1");
    router.push("/app/financeiro/planejar/tetos");
  }

  return (
    <Tela titulo="Planejar Orçamento" voltar={{ rotulo: "Voltar", href: "/app/financeiro" }} largura="estreita" className="pb-4">
      {fin.sincronizacao !== "pronto" || !mensalidade || !previa ? (
        <Sincronizando />
      ) : (
        <div className="animate-surge">
          <Passos atual={1} total={2} rotulo="Renda do mês" />
          <div className="px-4 pt-5">
            <h2 className="text-[22px] font-bold">Quanto você recebe por mês?</h2>
            <p className="mt-1 text-[14px] text-rotulo-2">Some auxílio da família, estágio ou bolsa IC. Toque para incluir cada fonte.</p>

            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Fontes de renda">
              {FONTES_RENDA.map((f) => (
                <Chip key={f.id} ativo={rascunho.ativas.includes(f.id)} onClick={() => fin.alternarFonte(f.id)}>
                  {f.nome}
                </Chip>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {FONTES_RENDA.filter((f) => rascunho.ativas.includes(f.id)).map((f, i) => (
                <div key={f.id} className="animate-sobe">
                  <CampoDinheiro
                    id={`renda-${f.id}`}
                    rotulo={f.nome}
                    valor={rascunho.fontes[f.id]}
                    onChange={(v) => fin.definirFonte(f.id, v)}
                    autoFocus={i === 0 && semRenda}
                  />
                </div>
              ))}
            </div>
          </div>

          <table className="mt-5 w-full border-collapse text-center text-[15px] desk:mx-4 desk:w-[calc(100%-2rem)]" aria-live="polite">
            <caption className="sr-only">Cálculo do saldo livre</caption>
            <thead>
              <tr className="bg-inatel">
                <th scope="col" className="h-10 border border-white/70 font-normal">Cálculo</th>
                <th scope="col" className="h-10 border border-white/70 font-normal">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="h-11 border border-white/70 font-normal">Renda mensal</th>
                <td className="h-11 border border-white/70 tabular-nums">{formatBRL(fin.rendaRascunho)}</td>
              </tr>
              <tr>
                <th scope="row" className="h-11 border border-white/70 font-normal">(−) Parcela líquida</th>
                <td className="h-11 border border-white/70 tabular-nums">{formatBRL(mensalidade.parcelaLiquida)}</td>
              </tr>
              <tr className="bg-white/[0.06]">
                <th scope="row" className="h-12 border border-white/70 font-semibold">Saldo livre</th>
                <td className={`h-12 border border-white/70 text-[17px] font-bold ${saldo > 0 ? "text-ok" : saldo < 0 ? "text-estouro" : ""}`}>
                  <ValorAnimado valor={saldo} />
                </td>
              </tr>
            </tbody>
          </table>
          <p className="px-4 pt-2 text-[13px] text-rotulo-2">Saldo livre calculado automaticamente: renda − parcela líquida.</p>

          {insuficiente && (
            <div role="alert" className="mx-4 mt-3 flex animate-sobe gap-3 rounded-xl border border-estouro/50 bg-estouro/10 p-3">
              <CircleAlert className="mt-0.5 size-5 shrink-0 text-estouro" aria-hidden />
              <p className="text-[14px] leading-snug">
                <strong>A renda não cobre a parcela da faculdade.</strong> Faltam {formatBRL(-saldo)} para pagar a mensalidade.
                Confira se incluiu todas as fontes ou fale com a SAE sobre o financiamento.
              </p>
            </div>
          )}

          <div className="px-4 pt-5">
            <Botao onClick={continuar} disabled={semRenda || insuficiente}>
              Continuar
            </Botao>
            {semRenda && <p className="pt-2 text-center text-[13px] text-rotulo-2">Informe quanto você recebe para continuar.</p>}
          </div>
          <NotaPrivacidade />
        </div>
      )}
    </Tela>
  );
}
