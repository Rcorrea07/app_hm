"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CircleCheck, Info, TriangleAlert } from "lucide-react";

type Tom = "ok" | "info" | "alerta";

interface ToastDados {
  id: number;
  texto: string;
  tom: Tom;
  acao?: { rotulo: string; executar: () => void };
}

interface ToastApi {
  mostrar: (t: Omit<ToastDados, "id" | "tom"> & { tom?: Tom }) => void;
}

const Contexto = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const c = useContext(Contexto);
  if (!c) throw new Error("useToast fora do ToastProvider");
  return c;
}

/** Vibração curta onde o aparelho permitir (feedback tátil). */
export function vibrar(ms = 12) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* sem suporte */
  }
}

const ICONES = { ok: CircleCheck, info: Info, alerta: TriangleAlert } as const;
const CORES = { ok: "text-ok", info: "text-ativo", alerta: "text-atencao" } as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [atual, setAtual] = useState<ToastDados | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const seq = useRef(0);

  const mostrar = useCallback<ToastApi["mostrar"]>((t) => {
    seq.current += 1;
    setAtual({ tom: "ok", ...t, id: seq.current });
  }, []);

  useEffect(() => {
    if (!atual) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAtual(null), atual.acao ? 5000 : 3200);
    return () => clearTimeout(timer.current);
  }, [atual]);

  const Icone = atual ? ICONES[atual.tom] : null;

  return (
    <Contexto.Provider value={{ mostrar }}>
      {children}
      <div aria-live="polite" className="pointer-events-none absolute inset-x-3 top-[calc(env(safe-area-inset-top)+52px)] z-40 flex justify-center desk:top-20">
        {atual && Icone && (
          <div
            key={atual.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-desce items-center gap-3 rounded-2xl bg-toast/95 px-4 py-3 shadow-2xl ring-1 ring-sobre/10 backdrop-blur"
          >
            <Icone className={`size-5 shrink-0 ${CORES[atual.tom]}`} aria-hidden />
            <span className="flex-1 text-[15px] leading-snug">{atual.texto}</span>
            {atual.acao && (
              <button
                type="button"
                onClick={() => {
                  atual.acao?.executar();
                  setAtual(null);
                }}
                className="-my-2 h-11 shrink-0 px-2 text-[15px] font-semibold text-ativo active:opacity-60"
              >
                {atual.acao.rotulo}
              </button>
            )}
          </div>
        )}
      </div>
    </Contexto.Provider>
  );
}
