"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  CLASSES,
  CONTEXTO,
  CRITERIOS_ACEITE,
  ENTREGA,
  ESTADOS_EXTRAS,
  ISO_9241,
  JUSTIFICATIVA,
  LEITURA,
  PERSONA,
  PLANOS,
  SIMULACAO,
  TABELA_2,
  TELAS_WIREFRAME,
  USER_STORY,
} from "@/doc/conteudo";
import { Pagina, Titulo, Legenda, Fonte } from "./Pagina";
import { DiagramaClasses, DiagramaHTA } from "./Diagramas";

/* ---------- link público do projeto ---------- */
function useLinkProjeto(): string {
  const [link, setLink] = useState(process.env.NEXT_PUBLIC_URL_PROJETO ?? "");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!process.env.NEXT_PUBLIC_URL_PROJETO) setLink(window.location.origin);
  }, []);
  return link;
}

function QR({ texto }: { texto: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    if (!texto) return;
    QRCode.toString(texto, { type: "svg", margin: 0, color: { dark: "#18181b", light: "#ffffff" } }).then(setSvg);
  }, [texto]);
  return <div aria-label={`QR code para ${texto}`} role="img" className="size-[26mm] shrink-0" dangerouslySetInnerHTML={{ __html: svg }} />;
}

const tdp = "border border-zinc-300 px-2 py-1 align-top";
const thp = "border border-zinc-300 bg-[#0166c0] px-2 py-1 text-left font-semibold text-white";

/* =================== 1. Capa =================== */
export function PaginaCapa() {
  const link = useLinkProjeto();
  return (
    <Pagina n={1} artefato="Capa" semCabecalho>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b-2 border-[#0166c0] pb-3">
          <Image src="/logo-inatel.png" alt="Inatel" width={160} height={46} className="h-auto w-[34mm]" />
          <p className="text-right text-[9pt] leading-tight text-zinc-600">
            Instituto Nacional de Telecomunicações
            <br />
            {ENTREGA.disciplina}
            <br />
            {ENTREGA.professor}
          </p>
        </div>

        <p className="mt-6 text-[10pt] font-semibold uppercase tracking-widest text-[#0166c0]">Projeto Final · Eixo {ENTREGA.eixo}</p>
        <h1 className="mt-1 text-[26pt] font-black leading-[1.05] tracking-tight">{ENTREGA.funcionalidade}</h1>
        <p className="mt-1 text-[12pt] text-zinc-600">Nova funcionalidade do {ENTREGA.app}</p>

        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-[11pt]">
          <dt className="text-zinc-500">Aluno</dt>
          <dd className="font-semibold">{ENTREGA.aluno}</dd>
          <dt className="text-zinc-500">Matrícula</dt>
          <dd className="font-semibold">{ENTREGA.matricula}</dd>
        </dl>

        <div className="mt-5 grid flex-1 gap-6 sm:grid-cols-[1fr_auto] print:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <section>
              <Titulo>Justificativa pela persona</Titulo>
              <p>{JUSTIFICATIVA}</p>
            </section>

            <section>
              <Titulo>Link do projeto</Titulo>
              <div className="flex items-center gap-4 rounded-lg border border-zinc-300 p-3">
                <QR texto={link} />
                <div className="min-w-0">
                  <a href={link} className="break-all text-[12pt] font-bold text-[#0166c0] underline">
                    {link || "…"}
                  </a>
                  <p className="mt-1 text-[8.5pt] text-zinc-600">
                    Abre no celular (layout do app) e no computador (menu lateral + roteiro da tarefa). Documentação em /doc.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <Titulo>Simulação de input, processamento e feedback</Titulo>
              <ul className="space-y-1.5">
                {SIMULACAO.map((s) => (
                  <li key={s.etapa} className="flex items-start gap-2">
                    <span className="mt-0.5 w-[28mm] shrink-0 rounded bg-[#0166c0] px-1.5 text-center text-[8pt] font-bold uppercase leading-[1.6] text-white">{s.etapa}</span>
                    <span className="text-[9.5pt]">{s.texto}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <figure className="flex flex-col items-center">
            <div className="flex items-end">
              {["tela-05", "tela-09", "tela-10"].map((t, i) => (
                <Image
                  key={t}
                  src={`/doc/telas/${t}.png`}
                  alt={`Tela ${t.slice(-2)} do protótipo no celular`}
                  width={390}
                  height={844}
                  className={`h-auto drop-shadow-xl ${i === 1 ? "z-10 -mx-[6mm] w-[40mm]" : "w-[33mm]"}`}
                />
              ))}
            </div>
            <figcaption className="mt-2 max-w-[90mm] text-center text-[8pt] text-zinc-500">
              Telas 5 (Resumo), 9 (Painel do Orçamento) e 10 (Lançar Gasto) do protótipo publicado.
            </figcaption>
          </figure>
        </div>
      </div>
    </Pagina>
  );
}

/* =================== 2. User Story =================== */
export function PaginaUserStory() {
  return (
    <Pagina n={2} artefato="User Story">
      <Titulo>Contextualização</Titulo>
      <p className="text-justify text-[9.5pt]">{CONTEXTO}</p>

      <Titulo>Persona primária</Titulo>
      <Legenda>Tabela 1 — Caracterização da persona primária (Lucas Andrade)</Legenda>
      <table className="w-full border-collapse text-[9pt] leading-tight">
        <thead>
          <tr>
            <th className={`${thp} w-[32%]`}>Dimensão</th>
            <th className={thp}>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {PERSONA.map(([d, t]) => (
            <tr key={d}>
              <th scope="row" className={`${tdp} text-left font-semibold`}>
                {d}
              </th>
              <td className={tdp}>{t}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Fonte>Fonte: elaborado pelo autor com base em Pereira (Aula 11 — S05).</Fonte>

      <Titulo>User Story</Titulo>
      <blockquote className="rounded-r-lg border-l-4 border-[#0166c0] bg-[#eef5fc] px-4 py-2 text-[10pt] italic">“{USER_STORY}”</blockquote>
      <ul className="mt-2 space-y-0.5 text-[9.5pt]">
        {LEITURA.map(([k, v]) => (
          <li key={k}>
            <strong>{k}:</strong> {v}
          </li>
        ))}
      </ul>

      <Titulo>Critérios de aceite (verificados no protótipo)</Titulo>
      <ol className="list-decimal space-y-0.5 pl-5 text-[9.5pt]">
        {CRITERIOS_ACEITE.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ol>
    </Pagina>
  );
}

/* =================== 3. Análise da Tarefa =================== */
export function PaginaAnaliseTarefa() {
  return (
    <Pagina n={3} artefato="Análise da Tarefa (HTA)">
      <Legenda>Figura 1 — HTA do módulo Suporte Financeiro (notação de Annett e Duncan, 1967)</Legenda>
      <DiagramaHTA />

      <div className="mt-2 grid gap-x-6 sm:grid-cols-2 print:grid-cols-2">
        {PLANOS.map(([k, v]) => (
          <p key={k} className="text-[9.5pt]">
            <strong>{k}:</strong> {v}
          </p>
        ))}
      </div>

      <Titulo>Plano de análise da tarefa</Titulo>
      <Legenda>Tabela 2 — Planos, entradas, feedbacks, problemas previstos e recomendações</Legenda>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[8.5pt] leading-tight">
          <thead>
            <tr>
              <th className={thp}>Objetivo</th>
              <th className={thp}>Plano e input</th>
              <th className={thp}>Feedback do sistema</th>
              <th className={thp}>Problema → recomendação</th>
            </tr>
          </thead>
          <tbody>
            {TABELA_2.map((r) => (
              <tr key={r.objetivo}>
                <th scope="row" className={`${tdp} w-[18%] text-left font-semibold`}>
                  {r.objetivo}
                  <span className="mt-1 block text-[7.5pt] font-normal text-[#0166c0]">{r.tela}</span>
                </th>
                <td className={tdp}>
                  {r.plano}
                  <br />
                  <em className="text-zinc-600">Input:</em> {r.input}
                </td>
                <td className={tdp}>{r.feedback}</td>
                <td className={tdp}>
                  {r.problema}
                  <br />
                  <strong className="text-[#0166c0]">→</strong> {r.recomendacao}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Titulo>Critérios de usabilidade (NBR ISO 9241-11)</Titulo>
      <ul className="grid gap-2 sm:grid-cols-3 print:grid-cols-3">
        {ISO_9241.map(([k, v]) => (
          <li key={k} className="rounded-md border border-zinc-300 p-2 text-[9pt]">
            <strong className="block text-[#0166c0]">{k}</strong>
            {v}
          </li>
        ))}
      </ul>
      <Fonte>Referências: ANNETT, J.; DUNCAN, K. D. Task analysis and training design, 1967. PEREIRA, R. C. M. Aula 11 — S05, Inatel.</Fonte>
    </Pagina>
  );
}

/* =================== 4. Fluxo de Informação (Diagrama de Classes) =================== */
export function PaginaDiagramaClasses() {
  return (
    <Pagina n={4} artefato="Fluxo de Informação — Diagrama de Classes" paisagem>
      <div className="overflow-x-auto">
        <div className="min-w-[760px] print:mx-auto print:w-[86%] print:min-w-0">
          <DiagramaClasses />
        </div>
      </div>
      <Titulo>Do diagrama ao código</Titulo>
      <p className="mb-2 text-[9pt] text-zinc-600">
        Cada classe é um arquivo TypeScript com os mesmos atributos e métodos (atributos derivados viram getters). As regras têm testes
        automatizados; os valores são inteiros em centavos.
      </p>
      <ul className="grid grid-cols-2 gap-1.5 text-[8.5pt] sm:grid-cols-4 print:grid-cols-4">
        {CLASSES.map((c) => (
          <li key={c.id} className="rounded border border-zinc-300 px-2 py-1">
            <strong>{c.nome}</strong>
            <code className="block truncate text-[7.5pt] text-[#0166c0]">{c.arquivo}</code>
          </li>
        ))}
        <li className="rounded border border-zinc-300 px-2 py-1">
          <strong>Estado da tela</strong>
          <code className="block truncate text-[7.5pt] text-[#0166c0]">src/store/Financeiro.tsx</code>
        </li>
      </ul>
    </Pagina>
  );
}

/* =================== 5. Wireframe =================== */
const TIPO_COR = { existente: "bg-zinc-200 text-zinc-700", alterada: "bg-amber-100 text-amber-800", nova: "bg-emerald-100 text-emerald-800" } as const;
const TIPO_TXT = { existente: "existente", alterada: "existente + alteração", nova: "nova" } as const;

export function PaginaWireframe({ detalhada }: { detalhada?: boolean }) {
  return (
    <Pagina n={5} artefato="Wireframe — do esboço à tela final" paisagem>
      <p className="mb-2 text-[9pt] text-zinc-600">
        Cada quadro mostra o wireframe entregue (esquerda) e a tela final do protótipo (direita). Telas 1–4: app atual (só contexto); telas 5–10:
        funcionalidade nova, acessada pela seção SUPORTE FINANCEIRO do Menu.
      </p>
      <ol className="grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2 lg:grid-cols-5 print:grid-cols-5">
        {TELAS_WIREFRAME.map((t) => (
          <li key={t.n} className="flex flex-col">
            <p className="flex items-center gap-1.5 text-[9pt] font-bold">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#0166c0] text-[8pt] text-white">{t.n}</span>
              <span className="truncate">{t.nome}</span>
            </p>
            <span className={`mt-0.5 self-start rounded px-1.5 text-[7pt] font-semibold ${TIPO_COR[t.tipo]}`}>
              {TIPO_TXT[t.tipo]}
              {t.hta ? ` · HTA ${t.hta}` : ""}
            </span>
            <div className="mt-1 grid grid-cols-2 items-start gap-1">
              <Image
                src={`/doc/wireframe/wf-${String(t.n).padStart(2, "0")}.png`}
                alt={`Wireframe da tela ${t.n}`}
                width={420}
                height={827}
                className="h-auto w-full"
              />
              <Image
                src={`/doc/telas/tela-${String(t.n).padStart(2, "0")}.png`}
                alt={`Tela ${t.n} final`}
                width={390}
                height={844}
                className="h-auto w-full"
              />
            </div>
            <p className="mt-1 text-[7pt] leading-tight text-zinc-600">→ {t.navegacao}</p>
            {detalhada && t.classes && <p className="mt-0.5 font-mono text-[7pt] leading-tight text-[#0166c0]">{t.classes}</p>}
          </li>
        ))}
      </ol>
      {detalhada && (
        <>
          <Titulo>Estados extras implementados</Titulo>
          <ul className="grid list-disc gap-x-6 pl-5 text-[9pt] sm:grid-cols-2 print:grid-cols-3">
            {ESTADOS_EXTRAS.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </>
      )}
    </Pagina>
  );
}
