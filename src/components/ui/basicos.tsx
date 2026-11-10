"use client";

import Link from "next/link";
import { ChevronRight, Lock, Search } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/* ---------- Cabeçalho de seção (ALUNO, TESOURARIA, …) ---------- */
export function SecaoTitulo({ children, extra }: { children: ReactNode; extra?: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 px-4 pb-2 pt-7 text-[13px] uppercase tracking-wide text-rotulo-2">
      {children}
      {extra}
    </h2>
  );
}

/* ---------- Linha de lista com chevron (Menu) ---------- */
interface LinhaProps {
  titulo: ReactNode;
  subtitulo?: ReactNode;
  href?: string;
  onClick?: () => void;
  chevron?: boolean;
  destaque?: boolean;
  esquerda?: ReactNode;
  direita?: ReactNode;
}

export function Linha({ titulo, subtitulo, href, onClick, chevron = true, destaque, esquerda, direita }: LinhaProps) {
  const corpo = (
    <span className="flex min-h-14 w-full items-center gap-3 border-t border-separador/70 py-2.5 pr-3 text-left">
      {esquerda}
      <span className="min-w-0 flex-1">
        <span className={`block text-[17px] leading-snug ${destaque ? "font-semibold" : ""}`}>{titulo}</span>
        {subtitulo && <span className="mt-0.5 block text-[14px] leading-snug text-rotulo-2">{subtitulo}</span>}
      </span>
      {direita}
      {chevron && <ChevronRight className="size-5 shrink-0 text-rotulo-3" aria-hidden />}
    </span>
  );
  const classe = `toque flex w-full pl-4 transition-colors active:bg-sobre/10 ${
    destaque ? "bg-inatel/15 ring-1 ring-inset ring-inatel/60" : ""
  }`;
  if (href) {
    return (
      <Link href={href} className={classe}>
        {corpo}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classe}>
      {corpo}
    </button>
  );
}

/** Grupo de linhas com separadores recuados, como no iOS. */
export function Grupo({ children }: { children: ReactNode }) {
  return (
    <div className="border-y border-separador/70 [&>*:first-child>span]:border-t-0">
      {children}
    </div>
  );
}

/* ---------- Campo de busca ---------- */
export function CampoBusca({ valor, onChange, rotulo = "Buscar" }: { valor: string; onChange: (v: string) => void; rotulo?: string }) {
  return (
    <div className="shrink-0 border-b border-separador/60 bg-fundo px-2 py-2">
      <label className="flex h-9 items-center gap-1.5 rounded-[10px] bg-campo px-2 text-rotulo-2">
        <Search className="size-[18px]" aria-hidden />
        <span className="sr-only">{rotulo}</span>
        <input
          type="search"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={rotulo}
          className="h-full w-full bg-transparent text-[17px] text-rotulo placeholder:text-rotulo-2 focus:outline-none"
        />
      </label>
    </div>
  );
}

/* ---------- Botões ---------- */
type Variante = "primario" | "secundario" | "perigo" | "texto";

const VARIANTES: Record<Variante, string> = {
  primario: "bg-inatel text-white border border-white/20 active:bg-inatel-press disabled:bg-superficie-2 disabled:text-rotulo-3 disabled:border-transparent",
  secundario: "bg-transparent text-rotulo border border-borda active:bg-sobre/10 disabled:text-rotulo-3",
  perigo: "bg-estouro/15 text-estouro border border-estouro/40 active:bg-estouro/25",
  texto: "bg-transparent text-inatel-texto active:opacity-60",
};

export function Botao({
  variante = "primario",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return (
    <button
      type="button"
      {...props}
      className={`toque flex h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-[17px] font-medium transition-colors disabled:cursor-not-allowed ${VARIANTES[variante]} ${className}`}
    >
      {children}
    </button>
  );
}

export function BotaoLink({ href, variante = "primario", children, className = "" }: { href: string; variante?: Variante; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`toque flex h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-[17px] font-medium transition-colors ${VARIANTES[variante]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* ---------- Selo NOVO ---------- */
export function Selo({ children = "NOVO" }: { children?: ReactNode }) {
  return (
    <span className="rounded-full bg-inatel px-2 py-0.5 text-[11px] font-bold tracking-wider text-white normal-case">
      {children}
    </span>
  );
}

/* ---------- Nota de privacidade ---------- */
export function NotaPrivacidade() {
  return (
    <p className="flex items-center justify-center gap-1.5 px-4 py-3 text-[13px] text-rotulo-2">
      <Lock className="size-3.5" aria-hidden />
      Seus gastos ficam salvos só neste celular
    </p>
  );
}

/* ---------- Skeleton ---------- */
export function Esqueleto({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`block animate-pulso rounded-md bg-superficie-2 ${className}`} />;
}

/* ---------- Chip ---------- */
export function Chip({
  ativo,
  children,
  onClick,
  cor,
}: {
  ativo: boolean;
  children: ReactNode;
  onClick: () => void;
  cor?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      style={ativo && cor ? { backgroundColor: cor, borderColor: cor } : undefined}
      className={`toque flex h-11 items-center justify-center gap-1.5 rounded-full border px-4 text-[15px] font-medium transition-colors ${
        ativo ? "border-inatel bg-inatel text-white" : "border-borda text-rotulo active:bg-sobre/10"
      }`}
    >
      {children}
    </button>
  );
}
