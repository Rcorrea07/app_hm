"use client";

import { useEffect } from "react";
import { Delete } from "lucide-react";
import { digitosParaCentavos, formatBRL, type Centavos } from "@/domain/money";
import { vibrar } from "./Toast";
import type { TeclaValor } from "@/domain/teclado";

/* ---------- Campo de dinheiro com máscara (estilo caixa eletrônico) ---------- */
export function CampoDinheiro({
  id,
  rotulo,
  valor,
  onChange,
  autoFocus,
}: {
  id: string;
  rotulo: string;
  valor: Centavos;
  onChange: (v: Centavos) => void;
  autoFocus?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[13px] text-rotulo-2">{rotulo}</span>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        autoFocus={autoFocus}
        value={formatBRL(valor)}
        onChange={(e) => onChange(digitosParaCentavos(e.target.value))}
        onFocus={(e) => {
          const el = e.currentTarget;
          requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length));
        }}
        className="h-14 w-full rounded-lg border border-borda bg-transparent px-4 text-[22px] font-semibold tabular-nums text-rotulo transition-colors focus:border-ativo focus:outline-none"
      />
    </label>
  );
}

/* ---------- Teclado numérico da Tela 10 ---------- */
const TECLAS: TeclaValor[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "apagar"];

export function TecladoNumerico({ onTecla }: { onTecla: (t: TeclaValor) => void }) {
  // Teclado físico também funciona (desktop).
  useEffect(() => {
    const ouvir = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (/^\d$/.test(e.key)) onTecla(e.key as TeclaValor);
      else if (e.key === "," || e.key === ".") onTecla(",");
      else if (e.key === "Backspace") onTecla("apagar");
    };
    window.addEventListener("keydown", ouvir);
    return () => window.removeEventListener("keydown", ouvir);
  }, [onTecla]);

  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Teclado numérico">
      {TECLAS.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => {
            vibrar(8);
            onTecla(t);
          }}
          aria-label={t === "apagar" ? "Apagar" : t === "," ? "Vírgula" : t}
          className="toque flex h-[52px] items-center justify-center rounded-xl bg-superficie-2 text-[24px] font-medium transition-colors active:bg-tecla-ativa"
        >
          {t === "apagar" ? <Delete className="size-6" aria-hidden /> : t}
        </button>
      ))}
    </div>
  );
}
