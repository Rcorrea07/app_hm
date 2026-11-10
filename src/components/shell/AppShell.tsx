"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  ListChecks,
  Mail,
  ReceiptText,
  PiggyBank,
  LogOut,
} from "lucide-react";
import { ABAS, AVISO_INDISPONIVEL, TabBar } from "@/components/ui/TabBar";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { Folha } from "@/components/ui/Folha";
import { Selo } from "@/components/ui/basicos";
import { SessaoProvider } from "@/store/Sessao";
import { FinanceiroProvider } from "@/store/Financeiro";
import { RoteiroProvider, useRoteiro, PASSOS } from "@/tour/Roteiro";
import { LUCAS } from "@/data/aluno";
import { InfoTelaAtual, PainelRoteiro } from "./PainelRoteiro";

/** Telas sem as abas inferiores / menu lateral (login e modal de lançamento). */
const SEM_ABAS = ["/app/perfis", "/app/login", "/app/financeiro/lancar"];
const SEM_MENU_LATERAL = ["/app/perfis", "/app/login"];

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
  return (
    <header className="hidden h-14 shrink-0 items-center gap-4 bg-inatel px-5 text-white desk:flex">
      <Link href="/app/avisos" className="flex items-baseline gap-2">
        <span className="text-[24px] font-black italic tracking-tight">Inatel</span>
        <span className="text-[15px] text-white/85">Acadêmico</span>
      </Link>
      <div className="ml-auto flex items-center gap-1">
        <BotaoRoteiro onClick={onRoteiro} className="largo:hidden" />
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
        ativo ? "bg-inatel/15 font-semibold text-rotulo" : "text-rotulo/75 hover:bg-sobre/8 hover:text-rotulo"
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
    <nav aria-label="Navegação principal" className="hidden w-60 shrink-0 flex-col gap-1 border-r border-sobre/10 bg-painel p-3 desk:flex">
      {ABAS.map((n) =>
        n.disponivel ? (
          item(n.href, n.rotulo, n.Icone, !naFin && pathname.startsWith(n.href))
        ) : (
          <button
            key={n.href}
            type="button"
            onClick={() => toast.mostrar({ tom: "info", texto: AVISO_INDISPONIVEL })}
            className="flex h-11 items-center gap-3 rounded-lg px-3 text-left text-[15px] text-rotulo/45 hover:bg-sobre/5"
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
        className="mt-auto flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] text-rotulo/60 hover:bg-sobre/8 hover:text-rotulo"
      >
        <LogOut className="size-5" aria-hidden /> Sair
      </Link>
    </nav>
  );
}

/* ---------- O app em si ---------- */
function App({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [roteiroAberto, setRoteiroAberto] = useState(false);
  const comAbas = !SEM_ABAS.some((r) => pathname.startsWith(r));
  const comMenuLateral = !SEM_MENU_LATERAL.some((r) => pathname.startsWith(r));
  const fechar = () => setRoteiroAberto(false);

  return (
    <div
      data-app
      className="@container/app fixed inset-0 flex flex-col overflow-hidden bg-fundo"
    >
      <ToastProvider>
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
            className="rolagem hidden w-[340px] shrink-0 space-y-4 overflow-y-auto border-l border-sobre/10 bg-painel p-4 largo:block"
          >
            <PainelRoteiro />
            <InfoTelaAtual />
          </aside>
        </div>
        <BotaoRoteiro
          onClick={() => setRoteiroAberto(true)}
          className="absolute right-2 top-[calc(env(safe-area-inset-top)+6px)] desk:hidden"
        />
        <Folha aberta={roteiroAberto} onFechar={fechar} titulo="Protótipo · S05 IHM">
          <div className="rolagem max-h-[70dvh] space-y-3 overflow-y-auto pb-2">
            <PainelRoteiro aoNavegar={fechar} />
            <InfoTelaAtual />
          </div>
        </Folha>
      </ToastProvider>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SessaoProvider>
      <FinanceiroProvider>
        <RoteiroProvider>
          <App>{children}</App>
        </RoteiroProvider>
      </FinanceiroProvider>
    </SessaoProvider>
  );
}
