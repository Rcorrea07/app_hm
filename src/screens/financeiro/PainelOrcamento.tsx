"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, PiggyBank, Trash2, Pencil } from "lucide-react";
import { Tela } from "@/components/ui/Tela";
import { Botao, BotaoLink, NotaPrivacidade, SecaoTitulo } from "@/components/ui/basicos";
import { BarraProgresso, EtiquetaEstado, Segmentado, ValorAnimado } from "@/components/ui/dados";
import { Folha } from "@/components/ui/Folha";
import { useToast } from "@/components/ui/Toast";
import { useFinanceiro } from "@/store/Financeiro";
import { nomeCategoria } from "@/domain/CategoriaGasto";
import { formatBRL, formatBRLCurto, porcento } from "@/domain/money";
import { formatarDataHora, formatarMes } from "@/domain/datas";
import { IconeCategoria, Sincronizando } from "./comum";

/** Tela 9 · Painel do Orçamento (HTA 3.2). */
export function PainelOrcamento() {
  const fin = useFinanceiro();
  const toast = useToast();
  const [confirmarApagar, setConfirmarApagar] = useState(false);
  const { orcamento } = fin;

  function remover(id: string) {
    const removida = fin.removerDespesa(id);
    if (!removida) return;
    toast.mostrar({
      tom: "info",
      texto: `Gasto de ${formatBRL(removida.valor)} removido.`,
      acao: { rotulo: "Desfazer", executar: () => fin.restaurarDespesa(removida) },
    });
  }

  return (
    <Tela titulo="Suporte Financeiro" voltar={{ rotulo: "Menu", href: "/app/menu" }} topo={<Segmentado ativo="orcamento" />} largura="larga" className="pb-6">
      {fin.sincronizacao !== "pronto" || !fin.hidratado ? (
        <Sincronizando />
      ) : !orcamento ? (
        <div className="mx-auto flex w-full max-w-md animate-surge flex-col items-center px-8 pt-14 text-center amplo:col-span-2">
          <span className="flex size-20 items-center justify-center rounded-full bg-inatel/20 text-ativo">
            <PiggyBank className="size-10" aria-hidden />
          </span>
          <h2 className="mt-5 text-[20px] font-bold">Seu mês ainda não tem orçamento</h2>
          <p className="mt-2 text-[15px] text-rotulo-2">
            Informe sua renda e o app divide o que sobra depois da mensalidade entre moradia, alimentação e estudos.
          </p>
          <BotaoLink href="/app/financeiro/planejar/renda" className="mt-6">
            Planejar orçamento do mês
          </BotaoLink>
          <NotaPrivacidade />
        </div>
      ) : (
        <div className="animate-surge amplo:grid amplo:grid-cols-[1.25fr_1fr] amplo:gap-8">
          <div>
          <div className="px-4 pt-5">
            <p className="text-[13px] text-rotulo-2">Saldo restante em {formatarMes(orcamento.mesReferencia)}</p>
            <p className={`text-[34px] font-bold leading-tight ${orcamento.saldoRestante < 0 ? "text-estouro" : ""}`} aria-live="polite">
              <ValorAnimado valor={orcamento.saldoRestante} />
            </p>
            <div className="mt-3">
              <BarraProgresso proporcao={orcamento.comprometimento} estado={orcamento.estado} rotulo="Saldo livre comprometido" altura="h-2.5" />
            </div>
            <p className="mt-1.5 flex justify-between text-[13px] text-rotulo-2">
              <span>{porcento(orcamento.comprometimento)} do saldo livre comprometido</span>
              <span className="tabular-nums">
                {formatBRLCurto(orcamento.totalGasto)} de {formatBRLCurto(orcamento.saldoLivre)}
              </span>
            </p>
            <p className="mt-3 rounded-lg bg-superficie px-3 py-2 text-[13px] text-rotulo-2">
              Renda {formatBRLCurto(orcamento.rendaMensal)} − parcela {formatBRLCurto(orcamento.rendaMensal - orcamento.saldoLivre)} ={" "}
              <strong className="text-white">saldo livre {formatBRLCurto(orcamento.saldoLivre)}</strong>
            </p>
          </div>

          <SecaoTitulo>Categorias</SecaoTitulo>
          <ul className="border-y border-separador/70">
            {orcamento.categorias.map((c) => (
              <li key={c.id} className="border-b border-separador/70 px-4 py-3 last:border-b-0">
                <div className="flex items-center gap-2">
                  <IconeCategoria id={c.id} className="size-4.5 text-rotulo-2" />
                  <span className="flex-1 text-[16px] font-semibold">{c.nome}</span>
                  <span className="text-[14px] tabular-nums">
                    {formatBRLCurto(c.totalGasto)} <span className="text-rotulo-2">/ {formatBRLCurto(c.valorTeto)}</span>
                  </span>
                </div>
                <div className="mt-2">
                  <BarraProgresso proporcao={c.calcularComprometimento()} estado={c.estado} rotulo={`Teto de ${c.nome} usado`} />
                </div>
                <p className="mt-1.5 flex items-center justify-between text-[13px] text-rotulo-2">
                  <span>{porcento(c.calcularComprometimento())} do teto usado</span>
                  <EtiquetaEstado estado={c.estado} />
                </p>
              </li>
            ))}
          </ul>

          <div className="px-4 pt-5">
            <BotaoLink href="/app/financeiro/lancar">
              <Plus className="size-5" aria-hidden /> Lançar gasto
            </BotaoLink>
          </div>

          </div>
          <div>
          <SecaoTitulo>Gastos do mês</SecaoTitulo>
          {orcamento.despesas.length === 0 ? (
            <p className="px-4 text-[14px] text-rotulo-2">Nenhum gasto lançado ainda. Toque em “Lançar gasto” quando pagar algo.</p>
          ) : (
            <ul className="border-y border-separador/70">
              {orcamento.despesas.map((d) => (
                <li key={d.id} className="flex animate-sobe items-center gap-3 border-b border-separador/70 py-1 pl-4 pr-1 last:border-b-0">
                  <IconeCategoria id={d.categoriaId} className="size-4.5 text-rotulo-2" />
                  <span className="flex-1">
                    <span className="block text-[15px]">{nomeCategoria(d.categoriaId)}</span>
                    <span className="block text-[12px] text-rotulo-2">{formatarDataHora(d.data)}</span>
                  </span>
                  <span className="text-[15px] font-semibold tabular-nums">{formatBRL(d.valor)}</span>
                  <button
                    type="button"
                    onClick={() => remover(d.id)}
                    aria-label={`Remover gasto de ${formatBRL(d.valor)} em ${nomeCategoria(d.categoriaId)}`}
                    className="flex size-11 items-center justify-center rounded-full text-rotulo-2 active:bg-white/10 active:text-estouro"
                  >
                    <Trash2 className="size-4.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex justify-center gap-6 px-4 text-[15px]">
            <Link href="/app/financeiro/planejar/renda" className="flex h-11 items-center gap-1.5 text-inatel-texto">
              <Pencil className="size-4" aria-hidden /> Replanejar
            </Link>
            <button type="button" onClick={() => setConfirmarApagar(true)} className="flex h-11 items-center gap-1.5 text-estouro">
              <Trash2 className="size-4" aria-hidden /> Apagar meus dados
            </button>
          </div>
          <NotaPrivacidade />
          </div>
        </div>
      )}

      <Folha aberta={confirmarApagar} onFechar={() => setConfirmarApagar(false)} titulo="Apagar meus dados?">
        <p className="pb-4 text-center text-[15px] text-rotulo-2">
          A renda, os tetos e todos os gastos salvos neste celular serão apagados. Os dados da bolsa continuam vindo do Portal.
        </p>
        <div className="space-y-2">
          <Botao
            variante="perigo"
            onClick={() => {
              fin.apagarDados();
              setConfirmarApagar(false);
              toast.mostrar({ tom: "info", texto: "Dados apagados deste celular." });
            }}
          >
            Apagar tudo
          </Botao>
          <Botao variante="secundario" onClick={() => setConfirmarApagar(false)}>
            Cancelar
          </Botao>
        </div>
      </Folha>
    </Tela>
  );
}
