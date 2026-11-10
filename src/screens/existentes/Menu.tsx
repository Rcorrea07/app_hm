"use client";

import { Wallet } from "lucide-react";
import { Tela } from "@/components/ui/Tela";
import { Grupo, Linha, SecaoTitulo, Selo } from "@/components/ui/basicos";
import { useToast } from "@/components/ui/Toast";
import { AVISO_INDISPONIVEL } from "@/components/ui/TabBar";
import { LUCAS } from "@/data/aluno";
import { MENU_ANTES, MENU_DEPOIS, type SecaoMenu } from "@/data/menu";
import { useRouter } from "next/navigation";

/** Tela 4 · Menu (capturas 08–10) + nova seção SUPORTE FINANCEIRO. */
export function Menu() {
  const toast = useToast();
  const router = useRouter();
  const indisponivel = () => toast.mostrar({ tom: "info", texto: AVISO_INDISPONIVEL });

  const secao = (s: SecaoMenu) => (
    <div key={s.titulo}>
      <SecaoTitulo>{s.titulo}</SecaoTitulo>
      <Grupo>
        {s.itens.map((i) => (
          <Linha key={i.titulo} titulo={i.titulo} subtitulo={i.subtitulo} href={i.href} onClick={i.href ? undefined : indisponivel} />
        ))}
      </Grupo>
    </div>
  );

  return (
    <Tela titulo="Menu" largura="media" className="pb-8">
      <SecaoTitulo>Aluno</SecaoTitulo>
      <div className="flex items-center gap-3 border-y border-separador/70 px-4 py-3">
        <span className="flex flex-col items-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-rotulo-2 text-[20px] font-semibold text-fundo" aria-hidden>
            LA
          </span>
          <button type="button" onClick={indisponivel} className="mt-0.5 text-[15px] text-inatel-texto">
            Editar
          </button>
        </span>
        <span className="min-w-0">
          <span className="block text-[19px]">{LUCAS.nome}</span>
          <span className="block truncate text-[15px] text-rotulo-2">{LUCAS.email}</span>
        </span>
      </div>

      {MENU_ANTES.map(secao)}

      <SecaoTitulo extra={<Selo />}>Suporte Financeiro</SecaoTitulo>
      <Grupo>
        <Linha
          destaque
          href="/app/financeiro"
          titulo="Planejador Financeiro & Bolsa"
          subtitulo="Mensalidade líquida e orçamento do mês"
          esquerda={
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-inatel text-white" aria-hidden>
              <Wallet className="size-5" />
            </span>
          }
        />
      </Grupo>

      {MENU_DEPOIS.map(secao)}
      <Grupo>
        <Linha titulo="Sair" subtitulo="Sair da Aplicação" chevron={false} onClick={() => router.push("/app/perfis")} />
      </Grupo>
    </Tela>
  );
}
