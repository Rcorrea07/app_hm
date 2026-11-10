"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

type Acao = { rotulo: string; href?: string; onClick?: () => void; seta?: boolean };

interface TelaProps {
  titulo?: string;
  /** Botão à esquerda da barra azul ("‹ Voltar", "‹ Menu" ou "Cancelar"). */
  voltar?: Acao;
  direita?: ReactNode;
  /** Conteúdo fixo logo abaixo da barra azul (ex.: busca, cabeçalho de grade). */
  topo?: ReactNode;
  children: ReactNode;
  /** Conteúdo fixo no rodapé, acima das abas (ex.: botão principal). */
  rodape?: ReactNode;
  className?: string;
  /** Largura máxima do conteúdo em telas grandes. */
  largura?: "estreita" | "media" | "larga";
}

const LARGURAS = { estreita: "max-w-xl", media: "max-w-3xl", larga: "max-w-6xl" } as const;

function BotaoVoltar({ acao, comTitulo }: { acao: Acao; comTitulo: boolean }) {
  const seta = acao.seta ?? true;
  const conteudo = (
    <>
      {seta && <ChevronLeft className="-ml-1.5 size-7 shrink-0" strokeWidth={2.4} aria-hidden />}
      <span className="truncate">{acao.rotulo}</span>
    </>
  );
  const classe = `flex h-11 min-w-11 items-center text-[17px] text-white active:opacity-60 desk:h-9 desk:max-w-none desk:rounded-full desk:bg-sobre/8 desk:text-rotulo desk:pl-2 desk:pr-4 desk:text-[15px] desk:hover:bg-sobre/15 ${
    comTitulo ? "max-w-[24%]" : "max-w-[70%]"
  }`;
  if (acao.href) {
    return (
      <Link href={acao.href} className={classe}>
        {conteudo}
      </Link>
    );
  }
  return (
    <button type="button" onClick={acao.onClick} className={classe}>
      {conteudo}
    </button>
  );
}

/** Esqueleto comum das telas: barra azul com título + área rolável. */
export function Tela({ titulo, voltar, direita, topo, children, rodape, className, largura = "media" }: TelaProps) {
  const max = LARGURAS[largura];
  return (
    <section className="flex h-full min-h-0 flex-col">
      {/* Celular: barra azul com título centralizado. Computador: cabeçalho da página. */}
      <header
        className="relative box-content flex h-11 shrink-0 items-center bg-inatel px-4 text-white desk:text-rotulo pt-[env(safe-area-inset-top)]
          desk:h-auto desk:gap-4 desk:border-b desk:border-sobre/10 desk:bg-transparent desk:px-8 desk:py-5"
      >
        {voltar && <BotaoVoltar acao={voltar} comTitulo={Boolean(titulo)} />}
        {titulo && (
          <h1
            className="pointer-events-none absolute inset-x-0 mx-auto w-[55%] truncate text-center text-[17px] font-semibold
              desk:pointer-events-auto desk:static desk:mx-0 desk:w-auto desk:text-left desk:text-[26px] desk:font-bold"
          >
            {titulo}
          </h1>
        )}
        {direita && <div className="ml-auto flex items-center">{direita}</div>}
      </header>
      {topo && <div className={`mx-auto w-full ${max} desk:px-4`}>{topo}</div>}
      <div className={`rolagem min-h-0 flex-1 overflow-y-auto`}>
        <div className={`mx-auto flex min-h-full w-full flex-col ${max} desk:px-4 desk:pb-10 ${className ?? ""}`}>{children}</div>
      </div>
      {rodape}
    </section>
  );
}
