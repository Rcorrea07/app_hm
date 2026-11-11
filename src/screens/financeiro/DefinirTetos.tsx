"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Wand2, Check } from "lucide-react";
import { Tela } from "@/components/ui/Tela";
import { Botao, NotaPrivacidade } from "@/components/ui/basicos";
import { Passos, ValorAnimado } from "@/components/ui/dados";
import { useToast, vibrar } from "@/components/ui/Toast";
import { useFinanceiro } from "@/store/Financeiro";
import { CATEGORIAS } from "@/domain/CategoriaGasto";
import { DIVISAO_SUGERIDA, somaPercentuais } from "@/domain/tetos";
import { formatBRL } from "@/domain/money";
import { IconeCategoria, Sincronizando } from "./comum";

const CORES = ["#0a84ff", "#30d158", "#bf5af2"];

/** Tela 8 · Definir Tetos (HTA 2.2). */
export function DefinirTetos() {
  const router = useRouter();
  const toast = useToast();
  const fin = useFinanceiro();
  const { previa, rascunho } = fin;
  const total = somaPercentuais(rascunho.percentuais);
  const sugerida = rascunho.percentuais.every((p, i) => p === DIVISAO_SUGERIDA[i]);

  // Sem renda (link direto), volta ao passo 1.
  useEffect(() => {
    if (fin.sincronizacao === "pronto" && fin.rendaRascunho === 0) router.replace("/app/financeiro/planejar/renda");
  }, [fin.sincronizacao, fin.rendaRascunho, router]);

  function salvar() {
    fin.salvarOrcamento();
    vibrar(20);
    toast.mostrar({ texto: "Orçamento do mês salvo neste celular." });
    router.push("/app/financeiro/orcamento");
  }

  return (
    <Tela titulo="Planejar Orçamento" voltar={{ rotulo: "Voltar", href: "/app/financeiro/planejar/renda" }} largura="estreita" className="pb-4">
      {fin.sincronizacao !== "pronto" || !previa ? (
        <Sincronizando />
      ) : (
        <div className="animate-surge">
          <Passos atual={2} total={2} rotulo="Tetos por categoria" />

          <div className="px-4 pt-5">
            <p className="text-[13px] text-rotulo-2">Saldo livre para distribuir</p>
            <p className="text-[30px] font-bold">
              <ValorAnimado valor={previa.saldoLivre} />
            </p>

            {/* Prévia da divisão */}
            <div className="mt-3 flex h-3 gap-0.5 overflow-hidden rounded-full" aria-hidden>
              {previa.categorias.map((c, i) => (
                <span
                  key={c.id}
                  className="h-full transition-[width] duration-300"
                  style={{ width: `${c.percentualTeto}%`, backgroundColor: CORES[i] }}
                />
              ))}
            </div>

            <Botao variante="secundario" className="mt-4" onClick={fin.usarDivisaoSugerida} disabled={sugerida}>
              {sugerida ? <Check className="size-5" aria-hidden /> : <Wand2 className="size-5" aria-hidden />}
              {sugerida ? "Divisão sugerida (50/30/20)" : "Usar divisão sugerida"}
            </Botao>
          </div>

          <ul className="mt-2">
            {previa.categorias.map((c, i) => (
              <li key={c.id} className="border-b border-separador/70 px-4 pt-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${CORES[i]}33`, color: CORES[i] }}>
                    <IconeCategoria id={c.id} className="size-4.5" />
                  </span>
                  <label htmlFor={`teto-${c.id}`} className="min-w-0 flex-1 text-[16px] font-semibold">
                    {CATEGORIAS[i].nome}
                    {c.id === "outros" && (
                      <span className="block truncate text-[12px] font-normal text-rotulo-2">Investimento, lazer, viagem, estudos…</span>
                    )}
                  </label>
                  <span className="text-[15px] tabular-nums">
                    <strong>{c.percentualTeto}%</strong> <span className="text-rotulo-2">· {formatBRL(c.valorTeto)}</span>
                  </span>
                </div>
                <input
                  id={`teto-${c.id}`}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={c.percentualTeto}
                  onChange={(e) => fin.ajustarPercentual(i, Number(e.target.value))}
                  aria-valuetext={`${c.percentualTeto}%, ${formatBRL(c.valorTeto)}`}
                  className="slider"
                  style={{ ["--progresso" as string]: `${c.percentualTeto}%`, ["--cor-trilha" as string]: CORES[i] }}
                />
              </li>
            ))}
          </ul>

          <p className="flex items-center justify-between px-4 py-4 text-[16px] font-semibold" aria-live="polite">
            Total distribuído
            <span className={`flex items-center gap-1 ${total === 100 ? "text-ok" : "text-estouro"}`}>
              {total === 100 && <Check className="size-4" aria-hidden />}
              {total}%
            </span>
          </p>
          <p className="-mt-2 px-4 pb-2 text-[13px] text-rotulo-2">Ao mover um controle, os outros se ajustam para somar 100%.</p>

          <div className="px-4 pt-2">
            <Botao onClick={salvar} disabled={total !== 100 || previa.saldoLivre <= 0}>
              Salvar orçamento
            </Botao>
          </div>
          <NotaPrivacidade />
        </div>
      )}
    </Tela>
  );
}
