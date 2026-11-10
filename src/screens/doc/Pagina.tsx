import type { ReactNode } from "react";
import { ENTREGA } from "@/doc/conteudo";

/** Folha A4 da documentação (fluida na tela, tamanho exato na impressão). */
export function Pagina({
  n,
  artefato,
  paisagem,
  children,
  semCabecalho,
}: {
  n: number;
  artefato: string;
  paisagem?: boolean;
  children: ReactNode;
  semCabecalho?: boolean;
}) {
  return (
    <article
      id={`pagina-${n}`}
      className={`pagina mx-auto flex w-full flex-col bg-white px-5 py-6 text-[10.5pt] leading-snug text-zinc-900 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.35)] sm:px-[13mm] sm:py-[11mm] ${
        paisagem ? "pagina-paisagem max-w-[297mm] sm:min-h-[210mm]" : "max-w-[210mm] sm:min-h-[297mm]"
      }`}
    >
      {!semCabecalho && (
        <header className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b-2 border-[#0166c0] pb-2">
          <div>
            <p className="text-[17pt] font-black italic leading-none tracking-tight text-[#0166c0]">Inatel</p>
            <p className="mt-1 text-[9.5pt] font-semibold">Artefato: {artefato}</p>
          </div>
          <p className="text-right text-[8.5pt] text-zinc-600">
            {ENTREGA.aluno} — {ENTREGA.matricula}
            <br />
            Eixo: {ENTREGA.eixo} · {ENTREGA.funcionalidade}
          </p>
        </header>
      )}
      <div className="min-h-0 flex-1">{children}</div>
      <footer className="mt-4 flex justify-between border-t border-zinc-300 pt-1.5 text-[8pt] text-zinc-500">
        <span>Inatel — {ENTREGA.disciplina}</span>
        <span>Página {n} de 5</span>
      </footer>
    </article>
  );
}

export function Titulo({ children }: { children: ReactNode }) {
  return <h2 className="mb-1.5 mt-3 text-[11.5pt] font-bold uppercase tracking-wide text-[#0166c0] first:mt-0">{children}</h2>;
}

export function Legenda({ children }: { children: ReactNode }) {
  return <p className="mb-1 text-[8.5pt] font-semibold text-zinc-700">{children}</p>;
}

export function Fonte({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-[7.5pt] text-zinc-500">{children}</p>;
}
