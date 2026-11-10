"use client";

import Link from "next/link";
import { useState } from "react";
import { Tela } from "@/components/ui/Tela";
import { CampoBusca, Selo } from "@/components/ui/basicos";
import { AVISOS } from "@/data/academico";

const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Tela 3 · Avisos (captura 04). Tela inicial depois do login. */
export function Avisos() {
  const [busca, setBusca] = useState("");
  const lista = AVISOS.filter((a) => normalizar(a.titulo + a.texto).includes(normalizar(busca)));

  return (
    <Tela titulo="Avisos" largura="media" topo={<CampoBusca valor={busca} onChange={setBusca} />}>
      {lista.length === 0 ? (
        <p className="border-b border-separador/60 py-8 text-center text-[17px] text-inatel-texto">Não há Informações.</p>
      ) : (
        <ul>
          {lista.map((a) => {
            const conteudo = (
              <>
                <span className="flex items-center gap-2">
                  <span className="flex-1 text-[16px] font-semibold">{a.titulo}</span>
                  <span className="text-[13px] text-rotulo-2">{a.data}</span>
                </span>
                <span className="mt-1 block text-[14px] leading-snug text-rotulo-2">{a.texto}</span>
                {a.href && (
                  <span className="mt-2 inline-flex">
                    <Selo />
                  </span>
                )}
              </>
            );
            return (
              <li key={a.id} className="border-b border-separador/60">
                {a.href ? (
                  <Link href={a.href} className="block px-4 py-3 active:bg-white/10">
                    {conteudo}
                  </Link>
                ) : (
                  <div className="px-4 py-3">{conteudo}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Tela>
  );
}
