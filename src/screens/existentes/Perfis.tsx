"use client";

import Image from "next/image";
import Link from "next/link";
import { Tela } from "@/components/ui/Tela";
import { LUCAS } from "@/data/aluno";
import { useSessao } from "@/store/Sessao";

/** Tela 1 · Perfis Salvos (captura 01). */
export function Perfis() {
  const sessao = useSessao();
  return (
    <Tela titulo="Inatel Acadêmico" largura="estreita">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
        <Image src="/logo-inatel.png" alt="Inatel" width={193} height={56} priority className="h-auto w-[190px]" />
        <p className="mt-9 font-serif text-[27px] text-rotulo-2">Perfis Salvos</p>
        <Link
          href="/app/login"
          onClick={() => {
            sessao.setCurso("GES");
            sessao.setMatricula(LUCAS.matricula);
          }}
          className="toque mt-7 block w-full rounded-lg border border-separador px-4 py-2.5 text-left active:bg-sobre/10"
        >
          <span className="block text-[16px]">{LUCAS.nome}</span>
          <span className="block text-[16px] text-rotulo-2">
            {LUCAS.curso} - {LUCAS.matricula}
          </span>
        </Link>
        <Link
          href="/app/login"
          onClick={() => sessao.limpar()}
          className="toque mt-14 flex h-12 w-full items-center justify-center rounded-lg border border-white/30 bg-inatel text-[17px] text-white active:bg-inatel-press"
        >
          Outro Usuário
        </Link>
      </div>
    </Tela>
  );
}
