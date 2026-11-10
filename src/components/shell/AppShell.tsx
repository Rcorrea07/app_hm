"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  ListChecks,
  Smartphone,
  Monitor,
  FileText,
  Mail,
  ReceiptText,
  PiggyBank,
  LogOut,
} from "lucide-react";
import { StatusBar } from "@/components/ui/StatusBar";
import { ABAS, AVISO_INDISPONIVEL, TabBar } from "@/components/ui/TabBar";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { Folha } from "@/components/ui/Folha";
import { Selo } from "@/components/ui/basicos";
import { SessaoProvider } from "@/store/Sessao";
import { FinanceiroProvider } from "@/store/Financeiro";
import { RoteiroProvider, useRoteiro, PASSOS } from "@/tour/Roteiro";
import { LUCAS } from "@/data/aluno";
import { InfoTelaAtual, LinksSite, PainelRoteiro } from "./PainelRoteiro";

/** Telas sem as abas inferiores / menu lateral (login e modal de lançamento). */
const SEM_ABAS = ["/app/perfis", "/app/login", "/app/financeiro/lancar"];
const SEM_MENU_LATERAL = ["/app/perfis", "/app/login"];
const CHAVE_MOLDURA = "inatel-moldura";

/* ---------- Modo "Ver no celular" ---------- */
const MolduraContexto = createContext<{ moldura: boolean; alternar: () => void }>({ moldura: false, alternar: () => {} });
export const useMoldura = () => useContext(MolduraContexto);

/* ---------- Botão do roteiro (quando o painel lateral não cabe) ---------- */
function BotaoRoteiro({ onClick, className }: { onClick: () => void; className: string }) {
  const { feitos } = useRoteiro();
  const n = PASSOS.filter((p) => feitos[p.id]).length;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Abrir roteiro da tarefa, ${n} de ${PASSOS.length} passos feitos`}
      className={`z-30 flex h-8 items-center gap-1 rounded-full bg-black/25 px-2.5 text-[13px] font-semibold text-white backdrop-blur active:bg-black/40 ${className}`}
    >
      <ListChecks className="size-4" aria-hidden />
      {n}/{PASSOS.length}
    </button>
  );
}

/* ---------- Barra superior do computador ---------- */
function BarraSuperior({ onRoteiro }: { onRoteiro: () => void }) {
  const { alternar } = useMoldura();
  return (
    <header className="hidden h-14 shrink-0 items-center gap-4 bg-inatel px-5 desk:flex">
      <Link href="/app/avisos" className="flex items-baseline gap-2">
        <span className="text-[24px] font-black italic tracking-tight">Inatel</span>
        <span className="text-[15px] text-white/85">Acadêmico</span>
      </Link>
      <div className="ml-auto flex items-center gap-1">
        <BotaoRoteiro onClick={onRoteiro} className="largo:hidden" />
        <button
          type="button"
          onClick={alternar}
          className="flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] text-white/90 hover:bg-white/15"
        >
          <Smartphone className="size-4" aria-hidden /> Ver no celular
        </button>
        <Link href="/doc" className="flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] text-white/90 hover:bg-white/15">
          <FileText className="size-4" aria-hidden /> Documentação
        </Link>
        <span className="ml-2 flex items-center gap-2 border-l border-white/25 pl-4 text-[14px]">
          <span className="flex size-8 items-center justify-center rounded-full bg-white/20 text-[12px] font-bold" aria-hidden>
            LA
          </span>
          {LUCAS.nome}
        </span>
      </div>
    </header>
  );
}

/* ---------- Menu lateral do computador (substitui as abas) ---------- */
const NAV_FIN = [
  { href: "/app/financeiro", rotulo: "Resumo da mensalidade", Icone: ReceiptText, exato: true },
  { href: "/app/financeiro/orcamento", rotulo: "Orçamento do mês", Icone: PiggyBank, exato: false },
];

function MenuLateral() {
  const pathname = usePathname();
  const toast = useToast();
  const item = (href: string, rotulo: string, Icone: typeof Mail, ativo: boolean) => (
    <Link
      key={href}
      href={href}
      aria-current={ativo ? "page" : undefined}
      className={`flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] transition-colors ${
        ativo ? "bg-inatel/25 font-semibold text-white" : "text-white/75 hover:bg-white/8 hover:text-white"
      }`}
    >
      <Icone className={`size-5 ${ativo ? "text-ativo" : ""}`} aria-hidden />
      {rotulo}
    </Link>
  );
  const naFin = pathname.startsWith("/app/financeiro");
  const finAtivo = (href: string, exato: boolean) =>
    exato
      ? pathname === href || pathname === "/app/financeiro/bolsa"
      : pathname.startsWith(href) || pathname.startsWith("/app/financeiro/planejar") || pathname === "/app/financeiro/lancar";

  return (
    <nav aria-label="Navegação principal" className="hidden w-60 shrink-0 flex-col gap-1 border-r border-white/10 bg-[#0e0e10] p-3 desk:flex">
      {ABAS.map((n) =>
        n.disponivel ? (
          item(n.href, n.rotulo, n.Icone, !naFin && pathname.startsWith(n.href))
        ) : (
          <button
            key={n.href}
            type="button"
            onClick={() => toast.mostrar({ tom: "info", texto: AVISO_INDISPONIVEL })}
            className="flex h-11 items-center gap-3 rounded-lg px-3 text-left text-[15px] text-white/45 hover:bg-white/5"
          >
            <n.Icone className="size-5" aria-hidden />
            {n.rotulo}
          </button>
        ),
      )}
      <p className="mt-5 flex items-center gap-2 px-3 pb-1 text-[12px] uppercase tracking-wider text-rotulo-2">
        Suporte Financeiro <Selo />
      </p>
      {NAV_FIN.map((n) => item(n.href, n.rotulo, n.Icone, finAtivo(n.href, n.exato)))}
      <Link
        href="/app/perfis"
        className="mt-auto flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] text-white/60 hover:bg-white/8 hover:text-white"
      >
        <LogOut className="size-5" aria-hidden /> Sair
      </Link>
    </nav>
  );
}

/* ---------- O app em si ---------- */
function App({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { moldura } = useMoldura();
  const [roteiroAberto, setRoteiroAberto] = useState(false);
  const comAbas = !SEM_ABAS.some((r) => pathname.startsWith(r));
  const comMenuLateral = !SEM_MENU_LATERAL.some((r) => pathname.startsWith(r));
  const fechar = () => setRoteiroAberto(false);

  return (
    <div
      data-celular
      data-moldura={moldura ? "" : undefined}
      className="@container/app fixed inset-0 flex flex-col overflow-hidden bg-fundo
        moldura:relative moldura:inset-auto moldura:aspect-[390/844] moldura:h-[clamp(700px,calc(100dvh-96px),844px)]
        moldura:shrink-0 moldura:rounded-[56px] moldura:shadow-[0_0_0_11px_#1d1d1f,0_0_0_13px_#3a3a3c,0_40px_80px_-20px_rgb(0_0_0/0.8)]"
    >
      <ToastProvider>
        {moldura && (
          <>
            <span
              aria-hidden
              className="absolute left-1/2 top-[11px] z-40 hidden h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black moldura:block"
            />
            <StatusBar />
          </>
        )}
        <BarraSuperior onRoteiro={() => setRoteiroAberto(true)} />
        <div className="flex min-h-0 flex-1">
          {comMenuLateral && <MenuLateral />}
          <div className="@container/conteudo relative flex min-h-0 min-w-0 flex-1 flex-col">
            <div key={pathname} className="min-h-0 flex-1 animate-tela">
              {children}
            </div>
            {comAbas && <TabBar />}
          </div>
          <aside
            aria-label="Roteiro da tarefa"
            className="rolagem hidden w-[340px] shrink-0 space-y-4 overflow-y-auto border-l border-white/10 bg-[#0b0b0d] p-4 largo:block"
          >
            <PainelRoteiro />
            <InfoTelaAtual />
          </aside>
        </div>
        {moldura && (
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-2 left-1/2 z-40 hidden h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-white/80 moldura:block"
          />
        )}
        <BotaoRoteiro
          onClick={() => setRoteiroAberto(true)}
          className={`absolute right-2 top-[calc(env(safe-area-inset-top)+6px)] moldura:top-[56px] desk:hidden ${moldura ? "lg:hidden" : ""}`}
        />
        <Folha aberta={roteiroAberto} onFechar={fechar} titulo="Protótipo · S05 IHM">
          <div className="rolagem max-h-[70dvh] space-y-3 overflow-y-auto pb-2">
            <PainelRoteiro aoNavegar={fechar} />
            <InfoTelaAtual />
            <LinksSite aoNavegar={fechar} />
          </div>
        </Folha>
      </ToastProvider>
    </div>
  );
}

/** Página em volta do app quando o modo "Ver no celular" está ligado. */
function PaginaMoldura({ children }: { children: ReactNode }) {
  const { alternar } = useMoldura();
  return (
    <div data-fundo className="min-h-dvh bg-[radial-gradient(ellipse_at_top,#0d2a4d_0%,#0b0d12_60%)] text-white">
      <header className="hidden items-center justify-between px-6 py-3 min-[500px]:flex">
        <p className="text-[14px] text-white/70">
          <strong className="text-white">App Inatel Acadêmico</strong> · Planejador Financeiro &amp; Bolsa
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={alternar}
            className="flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] text-white/80 hover:bg-white/10"
          >
            <Monitor className="size-4" aria-hidden /> Ver no computador
          </button>
          <LinksSite />
        </div>
      </header>
      <main className="flex items-start justify-center gap-10 min-[500px]:px-4 min-[500px]:pb-8 min-[500px]:pt-2">
        {children}
        <aside className="hidden w-[340px] shrink-0 space-y-4 lg:block">
          <PainelRoteiro />
          <InfoTelaAtual />
        </aside>
      </main>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [moldura, setMoldura] = useState(false);

  // Preferência salva ou ?moldura=1 na URL (usado nas capturas da documentação).
  useEffect(() => {
    try {
      const pedido = new URLSearchParams(window.location.search).get("moldura");
      const salvo = localStorage.getItem(CHAVE_MOLDURA) === "1";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMoldura(pedido ? pedido === "1" : salvo);
    } catch {
      /* sem armazenamento */
    }
  }, []);

  const alternar = useCallback(() => {
    setMoldura((m) => {
      try {
        localStorage.setItem(CHAVE_MOLDURA, m ? "0" : "1");
      } catch {
        /* sem armazenamento */
      }
      return !m;
    });
  }, []);

  const app = <App>{children}</App>;
  return (
    <MolduraContexto.Provider value={{ moldura, alternar }}>
      <SessaoProvider>
        <FinanceiroProvider>
          <RoteiroProvider>{moldura ? <PaginaMoldura>{app}</PaginaMoldura> : app}</RoteiroProvider>
        </FinanceiroProvider>
      </SessaoProvider>
    </MolduraContexto.Provider>
  );
}
