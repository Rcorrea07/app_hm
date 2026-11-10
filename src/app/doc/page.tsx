import Link from "next/link";
import Image from "next/image";
import { PAGINAS_DOC, ENTREGA } from "@/doc/conteudo";

const RESUMO: Record<string, string> = {
  capa: "Aluno, justificativa pela persona, link do projeto e telas no celular.",
  "user-story": "Contexto da SAE/Finatel, persona Lucas Andrade, user story e critérios de aceite.",
  "analise-da-tarefa": "HTA (Annett & Duncan), planos, Tabela 2 e critérios ISO 9241.",
  "diagrama-de-classes": "As 7 classes do módulo e onde cada uma está no código.",
  wireframe: "As 10 telas do wireframe lado a lado com as telas finais.",
};

export default function IndiceDoc() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="rounded-2xl bg-white p-6 shadow sm:p-8">
        <p className="text-[13px] font-semibold uppercase tracking-widest text-[#0166c0]">Projeto Final · {ENTREGA.disciplina}</p>
        <h1 className="mt-1 text-[30px] font-black leading-tight">{ENTREGA.funcionalidade}</h1>
        <p className="mt-1 text-zinc-600">
          {ENTREGA.aluno} — {ENTREGA.matricula} · {ENTREGA.professor}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/app/perfis" className="flex h-11 items-center rounded-lg bg-[#0166c0] px-5 font-semibold text-white">
            Abrir protótipo
          </Link>
          <Link href="/doc/imprimir" className="flex h-11 items-center rounded-lg border border-zinc-300 px-5 font-semibold">
            Ver as 5 páginas do PDF
          </Link>
        </div>
      </section>

      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGINAS_DOC.map((p) => (
          <li key={p.slug}>
            <Link href={`/doc/${p.slug}`} className="flex h-full flex-col rounded-2xl bg-white p-5 shadow transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#0166c0] font-bold text-white">{p.n}</span>
              <span className="mt-3 text-[18px] font-bold">{p.titulo}</span>
              <span className="mt-1 text-[14px] text-zinc-600">{RESUMO[p.slug]}</span>
            </Link>
          </li>
        ))}
        <li className="flex items-center justify-center rounded-2xl bg-[#0b0d12] p-4">
          <Image src="/doc/telas/tela-09.png" alt="Painel do Orçamento no celular" width={390} height={844} className="h-auto w-28" />
        </li>
      </ol>
    </div>
  );
}
