"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useFinanceiro } from "@/store/Financeiro";

/** Passos da HTA (Annett & Duncan) que o roteiro acompanha. */
export const PASSOS = [
  { id: "1.1", titulo: "Acessar o Suporte Financeiro", dica: "Abra a aba Menu e toque em Planejador Financeiro & Bolsa." },
  { id: "1.2", titulo: "Ver a mensalidade líquida", dica: "Confira a parcela já com o desconto da bolsa. Toque na bolsa para ver as cotas." },
  { id: "2.1", titulo: "Informar a renda do mês", dica: "Toque em Planejar orçamento do mês, informe a renda e toque em Continuar." },
  { id: "2.2", titulo: "Definir os tetos", dica: "Use a divisão sugerida ou ajuste os controles e toque em Salvar orçamento." },
  { id: "3.1", titulo: "Lançar um gasto", dica: "Toque em + Lançar gasto, digite o valor, escolha a categoria (em Outros, diga em quê) e registre." },
  { id: "3.2", titulo: "Consultar o saldo", dica: "Veja a barra da categoria e o saldo restante atualizados no painel." },
] as const;

export type PassoId = (typeof PASSOS)[number]["id"];

const CHAVE = "inatel-roteiro:v1";

interface Progresso {
  feitos: Partial<Record<PassoId, number>>;
}

interface RoteiroApi {
  feitos: Partial<Record<PassoId, number>>;
  marcar: (p: PassoId) => void;
  reiniciar: () => void;
  proximo: (typeof PASSOS)[number] | null;
  concluido: boolean;
  /** Segundos entre o primeiro e o último passo. */
  duracao: number | null;
}

const Contexto = createContext<RoteiroApi | null>(null);

export function RoteiroProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { sincronizacao, orcamento, versao } = useFinanceiro();
  const [progresso, setProgresso] = useState<Progresso>({ feitos: {} });
  const [lido, setLido] = useState(false);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      // Hidratação do progresso salvo (só existe no navegador).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (bruto) setProgresso(JSON.parse(bruto));
    } catch {
      /* sem armazenamento */
    }
    setLido(true);
  }, []);

  useEffect(() => {
    if (!lido) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(progresso));
    } catch {
      /* sem armazenamento */
    }
  }, [lido, progresso]);

  const marcar = useCallback((p: PassoId) => {
    setProgresso((atual) => (atual.feitos[p] ? atual : { feitos: { ...atual.feitos, [p]: Date.now() } }));
  }, []);

  const reiniciar = useCallback(() => setProgresso({ feitos: {} }), []);

  // Passos que dependem só da tela atual (sincroniza o roteiro com a navegação).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (pathname.startsWith("/app/financeiro")) marcar("1.1");
    if ((pathname === "/app/financeiro" || pathname === "/app/financeiro/bolsa") && sincronizacao === "pronto") {
      marcar("1.2");
    }
  }, [pathname, sincronizacao, marcar]);

  // 3.2: voltar ao painel depois de lançar um gasto.
  useEffect(() => {
    if (pathname === "/app/financeiro/orcamento" && progresso.feitos["3.1"] && (orcamento?.despesas.length ?? 0) > 0) {
      const t = setTimeout(() => marcar("3.2"), 900);
      return () => clearTimeout(t);
    }
  }, [pathname, progresso.feitos, orcamento, versao, marcar]);

  const valor = useMemo<RoteiroApi>(() => {
    const proximo = PASSOS.find((p) => !progresso.feitos[p.id]) ?? null;
    const tempos = Object.values(progresso.feitos).filter((x): x is number => typeof x === "number");
    const duracao = !proximo && tempos.length ? Math.round((Math.max(...tempos) - Math.min(...tempos)) / 1000) : null;
    return { feitos: progresso.feitos, marcar, reiniciar, proximo, concluido: !proximo, duracao };
  }, [progresso, marcar, reiniciar]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useRoteiro(): RoteiroApi {
  const c = useContext(Contexto);
  if (!c) throw new Error("useRoteiro fora do RoteiroProvider");
  return c;
}
