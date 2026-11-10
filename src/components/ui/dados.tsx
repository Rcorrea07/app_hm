"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CircleCheck, TriangleAlert, CircleAlert } from "lucide-react";
import type { EstadoCategoria } from "@/domain/CategoriaGasto";
import { formatBRL, type Centavos } from "@/domain/money";

/* ---------- Tabela com cabeçalho azul (padrão Notas/Frequência) ---------- */
export function Tabela({
  colunas,
  linhas,
  legenda,
}: {
  colunas: [string, string];
  linhas: Array<{ chave: string; celulas: [ReactNode, ReactNode]; forte?: boolean; tom?: string }>;
  legenda?: string;
}) {
  return (
    <table className="w-full border-collapse text-center text-[15px]">
      {legenda && <caption className="sr-only">{legenda}</caption>}
      <thead>
        <tr className="bg-inatel">
          {colunas.map((c) => (
            <th key={c} scope="col" className="h-10 border border-white/70 px-2 font-normal">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.map((l) => (
          <tr key={l.chave} className={l.forte ? "bg-white/[0.06] font-semibold" : ""}>
            <th scope="row" className={`h-11 border border-white/70 px-2 ${l.forte ? "font-semibold" : "font-normal"}`}>
              {l.celulas[0]}
            </th>
            <td className={`h-11 border border-white/70 px-2 tabular-nums ${l.tom ?? ""}`}>{l.celulas[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------- Controle segmentado Resumo / Orçamento ---------- */
export function Segmentado({ ativo }: { ativo: "resumo" | "orcamento" }) {
  const itens = [
    { id: "resumo", rotulo: "Resumo", href: "/app/financeiro" },
    { id: "orcamento", rotulo: "Orçamento", href: "/app/financeiro/orcamento" },
  ] as const;
  return (
    <nav aria-label="Seções do Suporte Financeiro" className="px-4 pt-3">
      <div className="relative grid grid-cols-2 rounded-[9px] bg-superficie-2 p-0.5">
        <span
          aria-hidden
          className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-[7px] bg-[#636366] shadow transition-transform duration-300"
          style={{ transform: ativo === "orcamento" ? "translateX(100%)" : "none" }}
        />
        {itens.map((i) => (
          <Link
            key={i.id}
            href={i.href}
            replace
            aria-current={ativo === i.id ? "page" : undefined}
            className="relative z-10 flex h-9 items-center justify-center text-[14px] font-semibold"
          >
            {i.rotulo}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/* ---------- Número animado (contador do saldo) ---------- */
export function ValorAnimado({ valor, className = "" }: { valor: Centavos; className?: string }) {
  const [mostrado, setMostrado] = useState(valor);
  const anterior = useRef(valor);

  useEffect(() => {
    const de = anterior.current;
    anterior.current = valor;
    if (de === valor) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inicio = performance.now();
    const duracao = reduzido ? 1 : 550;
    let quadro = 0;
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracao);
      const suave = 1 - Math.pow(1 - t, 3);
      setMostrado(Math.round(de + (valor - de) * suave));
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [valor]);

  return <span className={`tabular-nums ${className}`}>{formatBRL(mostrado)}</span>;
}

/* ---------- Barra de progresso por estado ---------- */
export const COR_ESTADO: Record<EstadoCategoria, string> = {
  ok: "var(--color-ok)",
  atencao: "var(--color-atencao)",
  estouro: "var(--color-estouro)",
};

export function BarraProgresso({
  proporcao,
  estado,
  rotulo,
  altura = "h-2",
}: {
  proporcao: number;
  estado: EstadoCategoria;
  rotulo: string;
  altura?: string;
}) {
  const largura = Math.max(0, Math.min(1, proporcao)) * 100;
  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(proporcao * 100)}
      className={`w-full overflow-hidden rounded-full bg-white/12 ${altura}`}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${largura}%`, backgroundColor: COR_ESTADO[estado] }}
      />
    </div>
  );
}

const ICONE_ESTADO = { ok: CircleCheck, atencao: TriangleAlert, estouro: CircleAlert } as const;
const TEXTO_ESTADO = { ok: "Dentro do teto", atencao: "Perto do teto", estouro: "Passou do teto" } as const;
const CLASSE_ESTADO = { ok: "text-ok", atencao: "text-atencao", estouro: "text-estouro" } as const;

/** Estado sempre com ícone + texto, nunca só cor. */
export function EtiquetaEstado({ estado }: { estado: EstadoCategoria }) {
  const Icone = ICONE_ESTADO[estado];
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-medium ${CLASSE_ESTADO[estado]}`}>
      <Icone className="size-3.5" aria-hidden />
      {TEXTO_ESTADO[estado]}
    </span>
  );
}

/* ---------- Progresso de passos (Passo 1 de 2) ---------- */
export function Passos({ atual, total, rotulo }: { atual: number; total: number; rotulo: string }) {
  return (
    <div className="px-4 pt-4">
      <p className="text-[13px] text-rotulo-2">
        Passo {atual} de {total} · {rotulo}
      </p>
      <div className="mt-2 flex gap-1.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < atual ? "bg-ativo" : "bg-white/15"}`}
          />
        ))}
      </div>
    </div>
  );
}
