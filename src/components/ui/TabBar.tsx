"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Clock, ChartNoAxesColumn, CalendarDays, Wallet, Menu } from "lucide-react";
import { useToast } from "./Toast";

/**
 * Abas do app real + a aba nova "Financeiro". Só Avisos, Financeiro e Menu navegam;
 * Horários, Notas e Frequência não fazem parte do protótipo.
 */
export const ABAS = [
  { href: "/app/avisos", rotulo: "Avisos", Icone: Mail, disponivel: true },
  { href: "/app/horarios", rotulo: "Horários", Icone: Clock, disponivel: false },
  { href: "/app/notas", rotulo: "Notas", Icone: ChartNoAxesColumn, disponivel: false },
  { href: "/app/frequencia", rotulo: "Frequência", Icone: CalendarDays, disponivel: false },
  { href: "/app/financeiro", rotulo: "Financeiro", Icone: Wallet, disponivel: true },
  { href: "/app/menu", rotulo: "Menu", Icone: Menu, disponivel: true },
] as const;

export const AVISO_INDISPONIVEL = "Indisponível no protótipo. Só o Suporte Financeiro funciona.";

function abaAtiva(pathname: string): string {
  return ABAS.find((a) => pathname.startsWith(a.href))?.href ?? "";
}

export function TabBar() {
  const pathname = usePathname();
  const toast = useToast();
  const ativa = abaAtiva(pathname);
  return (
    <nav
      aria-label="Abas do aplicativo"
      className="shrink-0 border-t border-sobre/10 bg-barra-abas pb-[env(safe-area-inset-bottom)] desk:hidden"
    >
      <ul className="grid grid-cols-6">
        {ABAS.map(({ href, rotulo, Icone, disponivel }) => {
          const ativo = ativa === href;
          const classe = `flex h-[52px] w-full flex-col items-center justify-center gap-0.5 text-[9px] font-medium transition-colors min-[360px]:text-[10px] ${
            ativo ? "text-ativo" : "text-rotulo-2 active:text-rotulo"
          }`;
          const conteudo = (
            <>
              <Icone className="size-6" strokeWidth={ativo ? 2.4 : 2} aria-hidden />
              <span className="max-w-full truncate px-0.5">{rotulo}</span>
            </>
          );
          return (
            <li key={href}>
              {disponivel ? (
                <Link href={href} aria-current={ativo ? "page" : undefined} className={classe}>
                  {conteudo}
                </Link>
              ) : (
                <button type="button" onClick={() => toast.mostrar({ tom: "info", texto: AVISO_INDISPONIVEL })} className={classe}>
                  {conteudo}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
