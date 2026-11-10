"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Tela } from "@/components/ui/Tela";
import { Botao, BotaoLink, NotaPrivacidade } from "@/components/ui/basicos";
import { TecladoNumerico } from "@/components/ui/entradas";
import { Folha } from "@/components/ui/Folha";
import { useToast, vibrar } from "@/components/ui/Toast";
import { useFinanceiro } from "@/store/Financeiro";
import { useRoteiro } from "@/tour/Roteiro";
import { CATEGORIAS, type CategoriaId } from "@/domain/CategoriaGasto";
import { aplicarTecla, textoParaCentavos, type TeclaValor } from "@/domain/teclado";
import { formatBRL } from "@/domain/money";
import { IconeCategoria, Sincronizando } from "./comum";

/** Tela 10 · Lançar Gasto (HTA 3.1). */
export function LancarGasto() {
  const router = useRouter();
  const toast = useToast();
  const fin = useFinanceiro();
  const { marcar } = useRoteiro();
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<CategoriaId | null>(null);
  const [confirmar, setConfirmar] = useState(false);
  const [tremer, setTremer] = useState(0);

  const valor = textoParaCentavos(texto);
  const { orcamento } = fin;
  const cat = orcamento && categoria ? orcamento.categoria(categoria) : null;
  const excesso = cat ? cat.excessoSeRegistrar(valor) : 0;
  const pronto = valor > 0 && categoria !== null;

  const onTecla = useCallback((t: TeclaValor) => setTexto((x) => aplicarTecla(x, t)), []);

  function registrar() {
    if (!categoria) return;
    const d = fin.registrarDespesa(categoria, valor);
    if (!d) return;
    marcar("3.1");
    vibrar(25);
    toast.mostrar({
      texto: `${formatBRL(valor)} em ${CATEGORIAS.find((c) => c.id === categoria)?.curto} registrado.`,
      acao: { rotulo: "Desfazer", executar: () => fin.removerDespesa(d.id) },
    });
    router.push("/app/financeiro/orcamento");
  }

  function tentarRegistrar() {
    if (!pronto) {
      setTremer((n) => n + 1);
      vibrar(40);
      return;
    }
    if (excesso > 0) setConfirmar(true);
    else registrar();
  }

  const mostrado = texto ? `R$ ${texto}` : "R$ 0,00";

  return (
    <Tela titulo="Lançar Gasto" voltar={{ rotulo: "Cancelar", href: "/app/financeiro/orcamento", seta: false }} largura="estreita">
      {fin.sincronizacao !== "pronto" || !fin.hidratado ? (
        <Sincronizando />
      ) : !orcamento ? (
        <div className="px-6 pt-16 text-center">
          <p className="text-[17px] font-semibold">Planeje o orçamento antes de lançar gastos.</p>
          <BotaoLink href="/app/financeiro/planejar/renda" className="mt-6">
            Planejar orçamento do mês
          </BotaoLink>
        </div>
      ) : (
        <div className="flex flex-1 flex-col px-4 pt-4">
          <div className="text-center">
            <p className="text-[13px] text-rotulo-2">Valor</p>
            <p
              key={tremer}
              aria-live="polite"
              className={`mx-auto mt-1 inline-block min-w-[60%] border-b-2 pb-1 text-[40px] font-bold tabular-nums transition-colors ${
                texto ? "border-ativo text-rotulo" : "border-sobre/20 text-rotulo-3"
              } ${tremer ? "animate-[tremer_300ms]" : ""}`}
            >
              {mostrado}
            </p>
          </div>

          <p className="mt-5 text-[13px] text-rotulo-2">Categoria (1 toque)</p>
          <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label="Categoria do gasto">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={categoria === c.id}
                onClick={() => setCategoria(c.id)}
                className={`toque flex h-16 flex-col items-center justify-center gap-1 rounded-xl border text-[14px] font-medium transition-colors ${
                  categoria === c.id ? "border-inatel bg-inatel text-white" : "border-borda active:bg-sobre/10"
                }`}
              >
                <IconeCategoria id={c.id} className="size-5" />
                {c.curto}
              </button>
            ))}
          </div>
          <p className="mt-2 min-h-5 text-center text-[13px]" aria-live="polite">
            {cat ? (
              excesso > 0 ? (
                <span className="text-atencao">Passa do teto de {cat.nome} em {formatBRL(excesso)}</span>
              ) : (
                <span className="text-rotulo-2">
                  Disponível em {cat.nome}: <strong className="text-rotulo">{formatBRL(Math.max(0, cat.disponivel))}</strong>
                </span>
              )
            ) : (
              <span className="text-rotulo-3">Escolha onde o dinheiro foi gasto</span>
            )}
          </p>

          <div className="mt-3">
            <TecladoNumerico onTecla={onTecla} />
          </div>

          <div className="mt-4">
            <Botao onClick={tentarRegistrar} aria-disabled={!pronto} className={pronto ? "" : "!bg-superficie-2 !text-rotulo-3 !border-transparent"}>
              Registrar gasto
            </Botao>
            {!pronto && tremer > 0 && (
              <p className="pt-2 text-center text-[13px] text-atencao" role="alert">
                {valor === 0 ? "Digite um valor maior que zero." : "Escolha uma categoria."}
              </p>
            )}
          </div>
          <NotaPrivacidade />
        </div>
      )}

      <Folha aberta={confirmar} onFechar={() => setConfirmar(false)} titulo="Vai passar do teto">
        <div className="flex flex-col items-center pb-4 text-center">
          <TriangleAlert className="size-9 text-atencao" aria-hidden />
          <p className="mt-2 text-[15px] text-rotulo-2">
            Este gasto passa o teto de <strong className="text-rotulo">{cat?.nome}</strong> em{" "}
            <strong className="text-atencao">{formatBRL(excesso)}</strong>. Registrar mesmo assim?
          </p>
        </div>
        <div className="space-y-2">
          <Botao
            onClick={() => {
              setConfirmar(false);
              registrar();
            }}
          >
            Registrar mesmo assim
          </Botao>
          <Botao variante="secundario" onClick={() => setConfirmar(false)}>
            Revisar valor
          </Botao>
        </div>
      </Folha>
    </Tela>
  );
}
