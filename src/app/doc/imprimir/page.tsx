import {
  PaginaAnaliseTarefa,
  PaginaCapa,
  PaginaDiagramaClasses,
  PaginaUserStory,
  PaginaWireframe,
} from "@/screens/doc/Paginas";
import { BotaoImprimir } from "@/screens/doc/BotaoImprimir";

/** As 5 páginas na ordem do modelo de entrega, prontas para "Salvar como PDF". */
export default function Imprimir() {
  return (
    <div className="space-y-8 print:space-y-0">
      <div className="nao-imprimir mx-auto flex max-w-[210mm] flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-[14px] shadow">
        <p>
          Para gerar o PDF: <strong>Imprimir → Salvar como PDF</strong>, margens <strong>Nenhuma</strong> e <strong>Gráficos de fundo</strong>{" "}
          ligado.
        </p>
        <BotaoImprimir />
      </div>
      <PaginaCapa />
      <PaginaUserStory />
      <PaginaAnaliseTarefa />
      <PaginaDiagramaClasses />
      <PaginaWireframe />
    </div>
  );
}
