"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Tela } from "@/components/ui/Tela";
import { CURSOS } from "@/data/aluno";
import { useSessao } from "@/store/Sessao";

/** Lista de cursos (captura 03). */
export function Cursos() {
  const router = useRouter();
  const sessao = useSessao();
  return (
    <Tela voltar={{ rotulo: "Voltar", onClick: () => router.back() }} largura="estreita">
      <ul className="mt-4 border-t border-separador/60">
        {CURSOS.map((c) => (
          <li key={c.sigla} className="border-b border-separador/60 bg-superficie">
            <button
              type="button"
              onClick={() => {
                sessao.setCurso(c.sigla);
                router.back();
              }}
              className="flex min-h-[52px] w-full items-center gap-2 px-4 py-2 text-left text-[17px] active:bg-white/10"
            >
              <span className="flex-1">
                {c.sigla} - {c.nome}
              </span>
              {sessao.curso === c.sigla && <Check className="size-5 text-ativo" aria-label="selecionado" />}
            </button>
          </li>
        ))}
      </ul>
    </Tela>
  );
}
