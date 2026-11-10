"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Mensalidade, type MensalidadeDados } from "@/domain/Mensalidade";
import { OrcamentoMensal, type FonteRenda, type OrcamentoDados } from "@/domain/OrcamentoMensal";
import { SuporteFinanceiro } from "@/domain/SuporteFinanceiro";
import { armazenamentoLocal } from "@/domain/armazenamentoLocal";
import { CATEGORIAS, type CategoriaId } from "@/domain/CategoriaGasto";
import type { DespesaDados } from "@/domain/Despesa";
import { DIVISAO_SUGERIDA, redistribuir } from "@/domain/tetos";
import { hojeISO } from "@/domain/datas";
import type { Centavos } from "@/domain/money";

export type Sincronizacao = "pendente" | "sincronizando" | "pronto";

/** O que o aluno está preenchendo nas telas 7 e 8, antes de salvar. */
export interface Rascunho {
  fontes: Record<FonteRenda, Centavos>;
  ativas: FonteRenda[];
  percentuais: number[];
}

const RASCUNHO_VAZIO: Rascunho = {
  fontes: { auxilio: 0, estagio: 0, bolsaIC: 0 },
  ativas: ["auxilio"],
  percentuais: [...DIVISAO_SUGERIDA],
};

export const EXEMPLO_RENDA: Rascunho = {
  fontes: { auxilio: 220_000, estagio: 0, bolsaIC: 70_000 },
  ativas: ["auxilio", "bolsaIC"],
  percentuais: [...DIVISAO_SUGERIDA],
};

interface FinanceiroApi {
  hidratado: boolean;
  sincronizacao: Sincronizacao;
  hoje: string;
  mensalidade: Mensalidade | null;
  /** Orçamento salvo (null enquanto o aluno não planejou o mês). */
  orcamento: OrcamentoMensal | null;
  /** Orçamento simulado a partir do rascunho (para os cálculos ao vivo das telas 7 e 8). */
  previa: OrcamentoMensal | null;
  rascunho: Rascunho;
  rendaRascunho: Centavos;
  versao: number;

  sincronizar: () => void;
  alternarFonte: (f: FonteRenda) => void;
  definirFonte: (f: FonteRenda, v: Centavos) => void;
  ajustarPercentual: (indice: number, valor: number) => void;
  usarDivisaoSugerida: () => void;
  salvarOrcamento: () => void;
  registrarDespesa: (categoria: CategoriaId, valor: Centavos) => DespesaDados | null;
  removerDespesa: (id: string) => DespesaDados | null;
  restaurarDespesa: (d: DespesaDados) => void;
  preencherExemplo: () => void;
  apagarDados: () => void;
}

const Contexto = createContext<FinanceiroApi | null>(null);

function rendaDe(r: Rascunho): Centavos {
  return r.ativas.reduce((t, f) => t + (r.fontes[f] ?? 0), 0);
}

function rascunhoDe(dados: OrcamentoDados): Rascunho {
  const fontes = { ...RASCUNHO_VAZIO.fontes, ...dados.fontes };
  const ativas = (Object.keys(fontes) as FonteRenda[]).filter((f) => fontes[f] > 0);
  return {
    fontes,
    ativas: ativas.length ? ativas : ["auxilio"],
    percentuais: CATEGORIAS.map((c) => dados.percentuais[c.id] ?? 0),
  };
}

export function FinanceiroProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const suporte = useRef(new SuporteFinanceiro());
  const [hidratado, setHidratado] = useState(false);
  const [sincronizacao, setSincronizacao] = useState<Sincronizacao>("pendente");
  const [mensalidadeDados, setMensalidadeDados] = useState<MensalidadeDados | null>(null);
  const [orcamentoDados, setOrcamentoDados] = useState<OrcamentoDados | null>(null);
  const [rascunho, setRascunho] = useState<Rascunho>(RASCUNHO_VAZIO);
  const [versao, setVersao] = useState(0);
  // Data de hoje só no navegador (não pode ser congelada no prerender).
  const [hoje, setHoje] = useState("");

  // Lê o que já estava salvo neste celular (só no navegador, depois de montar).
  useEffect(() => {
    const salvo = armazenamentoLocal.lerOrcamento();
    // Hidratação: o localStorage só existe no navegador, então a leitura fica no efeito.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (salvo) {
      setOrcamentoDados(salvo);
      setRascunho(rascunhoDe(salvo));
    }
    setHoje(hojeISO());
    setHidratado(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const iniciouSync = useRef(false);
  const sincronizar = useCallback(() => {
    if (iniciouSync.current) return;
    iniciouSync.current = true;
    setSincronizacao("sincronizando");
    suporte.current.sincronizarPortal(hojeISO()).then((m) => {
      setMensalidadeDados({
        mesReferencia: m.mesReferencia,
        valorBruto: m.valorBruto,
        dataVencimento: m.dataVencimento,
        bolsas: m.bolsas.map((b) => b.toDados()),
      });
      setSincronizacao("pronto");
    });
  }, []);

  // Entrar no módulo dispara a sincronização com o "Portal/SAE".
  useEffect(() => {
    if (pathname.startsWith("/app/financeiro")) sincronizar();
    if (pathname === "/app/financeiro") suporte.current.abrirResumo();
    if (pathname === "/app/financeiro/orcamento") suporte.current.abrirOrcamento();
  }, [pathname, sincronizar]);

  const mensalidade = useMemo(
    () => (mensalidadeDados ? new Mensalidade(mensalidadeDados) : null),
    [mensalidadeDados],
  );

  const orcamento = useMemo(
    () => (mensalidade && orcamentoDados ? OrcamentoMensal.fromDados(orcamentoDados, mensalidade) : null),
    [mensalidade, orcamentoDados],
  );

  const rendaRascunho = rendaDe(rascunho);

  const previa = useMemo(() => {
    if (!mensalidade) return null;
    const o = new OrcamentoMensal(mensalidade.mesReferencia, mensalidade, rendaRascunho);
    o.definirTetos(rascunho.percentuais);
    return o;
  }, [mensalidade, rendaRascunho, rascunho.percentuais]);

  // Persiste toda mudança do orçamento (só depois de ler o que havia).
  useEffect(() => {
    if (!hidratado) return;
    if (orcamentoDados) armazenamentoLocal.salvarOrcamento(orcamentoDados);
  }, [hidratado, orcamentoDados]);

  const alternarFonte = useCallback((f: FonteRenda) => {
    setRascunho((r) => {
      const ativa = r.ativas.includes(f);
      if (ativa && r.ativas.length === 1) return r; // pelo menos uma fonte
      return { ...r, ativas: ativa ? r.ativas.filter((x) => x !== f) : [...r.ativas, f] };
    });
  }, []);

  const definirFonte = useCallback((f: FonteRenda, v: Centavos) => {
    setRascunho((r) => ({ ...r, fontes: { ...r.fontes, [f]: v } }));
  }, []);

  const ajustarPercentual = useCallback((indice: number, valor: number) => {
    setRascunho((r) => ({ ...r, percentuais: redistribuir(r.percentuais, indice, valor) }));
  }, []);

  const usarDivisaoSugerida = useCallback(() => {
    setRascunho((r) => ({ ...r, percentuais: [...DIVISAO_SUGERIDA] }));
  }, []);

  const salvarOrcamento = useCallback(() => {
    if (!mensalidade) return;
    const o = new OrcamentoMensal(mensalidade.mesReferencia, mensalidade);
    o.informarRenda(rendaRascunho);
    o.fontes = Object.fromEntries(rascunho.ativas.map((f) => [f, rascunho.fontes[f]]));
    o.definirTetos(rascunho.percentuais);
    // Replanejar o mês mantém os gastos já lançados.
    const despesas = orcamentoDados?.despesas ?? [];
    setOrcamentoDados({ ...o.toDados(), despesas });
    setVersao((v) => v + 1);
  }, [mensalidade, rendaRascunho, rascunho, orcamentoDados]);

  const registrarDespesa = useCallback(
    (categoria: CategoriaId, valor: Centavos) => {
      if (!mensalidade || !orcamentoDados) return null;
      const o = OrcamentoMensal.fromDados(orcamentoDados, mensalidade);
      const despesa = o.categoria(categoria).registrarDespesa(valor);
      setOrcamentoDados(o.toDados());
      despesa.salvarLocal();
      setVersao((v) => v + 1);
      return despesa.toDados();
    },
    [mensalidade, orcamentoDados],
  );

  // Guarda a versão mais recente para o "Desfazer" de um toast antigo funcionar.
  const dadosRef = useRef(orcamentoDados);
  useEffect(() => {
    dadosRef.current = orcamentoDados;
  }, [orcamentoDados]);

  const removerDespesa = useCallback((id: string) => {
    const removida = dadosRef.current?.despesas.find((d) => d.id === id) ?? null;
    if (!removida) return null;
    setOrcamentoDados((atual) => (atual ? { ...atual, despesas: atual.despesas.filter((d) => d.id !== id) } : atual));
    setVersao((v) => v + 1);
    return removida;
  }, []);

  const restaurarDespesa = useCallback((d: DespesaDados) => {
    setOrcamentoDados((atual) =>
      atual && !atual.despesas.some((x) => x.id === d.id)
        ? { ...atual, despesas: [d, ...atual.despesas].sort((a, b) => b.data.localeCompare(a.data)) }
        : atual,
    );
    setVersao((v) => v + 1);
  }, []);

  const preencherExemplo = useCallback(() => setRascunho(EXEMPLO_RENDA), []);

  const apagarDados = useCallback(() => {
    armazenamentoLocal.apagarTudo();
    setOrcamentoDados(null);
    setRascunho(RASCUNHO_VAZIO);
    setVersao((v) => v + 1);
  }, []);

  const api: FinanceiroApi = {
    hidratado,
    sincronizacao,
    hoje,
    mensalidade,
    orcamento,
    previa,
    rascunho,
    rendaRascunho,
    versao,
    sincronizar,
    alternarFonte,
    definirFonte,
    ajustarPercentual,
    usarDivisaoSugerida,
    salvarOrcamento,
    registrarDespesa,
    removerDespesa,
    restaurarDespesa,
    preencherExemplo,
    apagarDados,
  };

  return <Contexto.Provider value={api}>{children}</Contexto.Provider>;
}

export function useFinanceiro(): FinanceiroApi {
  const c = useContext(Contexto);
  if (!c) throw new Error("useFinanceiro fora do FinanceiroProvider");
  return c;
}
