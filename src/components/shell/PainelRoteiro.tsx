"use client";

import { usePathname, useRouter } from "next/navigation";
import { Check, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { PASSOS, useRoteiro } from "@/tour/Roteiro";
import { infoDaTela } from "@/tour/telas";
import { useFinanceiro } from "@/store/Financeiro";
import { useSessao } from "@/store/Sessao";

const TIPO = {
  existente: { texto: "Tela existente", classe: "bg-sobre/10 text-rotulo/70" },
  alterada: { texto: "Existente + alteração", classe: "bg-atencao/15 text-atencao" },
  nova: { texto: "Funcionalidade nova", classe: "bg-ok/15 text-ok" },
} as const;

export function InfoTelaAtual() {
  const pathname = usePathname();
  const info = infoDaTela(pathname);
  if (!info) return null;
  const tipo = TIPO[info.tipo];
  return (
    <section aria-label="Tela atual" className="rounded-2xl border border-sobre/10 bg-sobre/[0.04] p-4">
      <p className="text-[12px] uppercase tracking-wider text-rotulo/50">Você está em</p>
      <p className="mt-1 text-[17px] font-semibold">
        {info.numero ? `Tela ${info.numero} · ` : ""}
        {info.nome}
      </p>
      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[12px] font-medium ${tipo.classe}`}>{tipo.texto}</span>
      {info.hta && (
        <p className="mt-3 text-[13px] text-rotulo/70">
          <span className="font-semibold text-rotulo/90">HTA </span>
          {info.hta}
        </p>
      )}
      {info.classes && (
        <ul className="mt-2 space-y-0.5 break-all font-mono text-[12px] text-inatel-texto">
          {info.classes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function PainelRoteiro({ aoNavegar }: { aoNavegar?: () => void }) {
  const router = useRouter();
  const { feitos, proximo, concluido, duracao, reiniciar } = useRoteiro();
  const fin = useFinanceiro();
  const sessao = useSessao();
  const total = PASSOS.length;
  const feitosN = PASSOS.filter((p) => feitos[p.id]).length;

  function reiniciarDemo() {
    fin.apagarDados();
    reiniciar();
    sessao.limpar();
    aoNavegar?.();
    router.push("/app/perfis");
  }

  function preencherExemplo() {
    fin.preencherExemplo();
    aoNavegar?.();
    router.push("/app/financeiro/planejar/renda");
  }

  return (
    <section aria-label="Roteiro da tarefa" className="rounded-2xl border border-sobre/10 bg-sobre/[0.04] p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[17px] font-semibold">Roteiro da tarefa</h2>
        <span className="text-[13px] tabular-nums text-rotulo/60">
          {feitosN}/{total}
        </span>
      </div>
      <p className="mt-1 text-[13px] text-rotulo/60">
        Meta 0 · Planejar o orçamento do mês integrado à bolsa. Os passos marcam sozinhos conforme você usa o app.
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sobre/10" aria-hidden>
        <div className="h-full rounded-full bg-ok transition-[width] duration-700" style={{ width: `${(feitosN / total) * 100}%` }} />
      </div>

      <ol className="mt-4 space-y-1">
        {PASSOS.map((p) => {
          const feito = Boolean(feitos[p.id]);
          const atual = proximo?.id === p.id;
          return (
            <li
              key={p.id}
              aria-current={atual ? "step" : undefined}
              className={`flex gap-3 rounded-xl px-2 py-2 transition-colors ${atual ? "bg-inatel/20 ring-1 ring-inatel/50" : ""}`}
            >
              <span
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  feito ? "bg-ok text-fundo" : atual ? "bg-ativo text-white" : "bg-sobre/10 text-rotulo/60"
                }`}
              >
                {feito ? <Check className="size-3.5" strokeWidth={3} aria-label="feito" /> : p.id}
              </span>
              <span className="min-w-0">
                <span className={`block text-[14px] font-medium ${feito ? "text-rotulo/60 line-through decoration-rotulo/30" : ""}`}>
                  {p.titulo}
                </span>
                {atual && <span className="mt-0.5 block text-[13px] text-rotulo/70">{p.dica}</span>}
              </span>
            </li>
          );
        })}
      </ol>

      {concluido && (
        <div className="mt-3 flex animate-sobe items-center gap-3 rounded-xl bg-ok/15 p-3 text-ok">
          <Trophy className="size-6 shrink-0" aria-hidden />
          <p className="text-[14px]">
            <strong>Tarefa concluída!</strong>
            {duracao !== null && ` Em ${Math.max(1, Math.round(duracao / 60))} min.`} Você planejou o mês e acompanhou o saldo.
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={preencherExemplo}
          className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-sobre/15 text-[14px] active:bg-sobre/10"
        >
          <Sparkles className="size-4" aria-hidden /> Usar exemplo
        </button>
        <button
          type="button"
          onClick={reiniciarDemo}
          className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-sobre/15 text-[14px] active:bg-sobre/10"
        >
          <RotateCcw className="size-4" aria-hidden /> Reiniciar demo
        </button>
      </div>
    </section>
  );
}
