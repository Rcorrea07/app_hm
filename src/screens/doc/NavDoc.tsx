"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Printer, Smartphone } from "lucide-react";
import { PAGINAS_DOC } from "@/doc/conteudo";

export function NavDoc() {
  const pathname = usePathname();
  return (
    <header className="nao-imprimir sticky top-0 z-20 border-b border-black/10 bg-[#0166c0] text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2">
        <Link href="/doc" className="flex items-baseline gap-2">
          <span className="text-[20px] font-black italic">Inatel</span>
          <span className="text-[14px] text-white/85">Documentação do projeto</span>
        </Link>
        <nav aria-label="Páginas da documentação" className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto pb-1 md:order-none md:w-auto md:pb-0">
          {PAGINAS_DOC.map((p) => {
            const href = `/doc/${p.slug}`;
            const ativo = pathname === href;
            return (
              <Link
                key={p.slug}
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] ${ativo ? "bg-white text-[#0166c0]" : "hover:bg-white/15"}`}
              >
                <span className={`flex size-5 items-center justify-center rounded-full text-[11px] font-bold ${ativo ? "bg-[#0166c0] text-white" : "bg-white/20"}`}>
                  {p.n}
                </span>
                {p.titulo}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Link href="/doc/imprimir" className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] hover:bg-white/15">
            <Printer className="size-4" aria-hidden /> PDF
          </Link>
          <Link href="/app/perfis" className="flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-semibold text-[#0166c0]">
            <Smartphone className="size-4" aria-hidden /> Abrir protótipo
          </Link>
        </div>
      </div>
    </header>
  );
}
