"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/** Estado do login simulado (telas 1 e 2). Não é persistido. */
interface Sessao {
  curso: string;
  matricula: string;
  setCurso: (c: string) => void;
  setMatricula: (m: string) => void;
  limpar: () => void;
}

const Contexto = createContext<Sessao | null>(null);

export function SessaoProvider({ children }: { children: ReactNode }) {
  const [curso, setCurso] = useState("");
  const [matricula, setMatricula] = useState("");
  const valor = useMemo(
    () => ({
      curso,
      matricula,
      setCurso,
      setMatricula,
      limpar: () => {
        setCurso("");
        setMatricula("");
      },
    }),
    [curso, matricula],
  );
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSessao(): Sessao {
  const c = useContext(Contexto);
  if (!c) throw new Error("useSessao fora do SessaoProvider");
  return c;
}
