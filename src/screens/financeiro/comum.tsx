"use client";

import { House, Utensils, Shapes, BookOpen, PartyPopper, TrendingUp, Bus, Tag, LoaderCircle, type LucideIcon } from "lucide-react";
import type { CategoriaId } from "@/domain/CategoriaGasto";
import { Esqueleto } from "@/components/ui/basicos";

export const ICONE_CATEGORIA: Record<CategoriaId, LucideIcon> = {
  moradia: House,
  alimentacao: Utensils,
  outros: Shapes,
};

/** Ícones das subcategorias sugeridas de "Outros gastos"; as criadas pelo aluno usam Tag. */
const ICONE_SUBCATEGORIA: Record<string, LucideIcon> = {
  "Estudos / Material": BookOpen,
  Lazer: PartyPopper,
  Investimento: TrendingUp,
  "Viagem / Transporte": Bus,
};

export function IconeSubcategoria({ nome, className = "size-4" }: { nome: string; className?: string }) {
  const Icone = ICONE_SUBCATEGORIA[nome] ?? Tag;
  return <Icone className={className} aria-hidden />;
}

/** "Alimentação" ou "Outros · Lazer". */
export function rotuloGasto(categoriaCurta: string, subcategoria?: string): string {
  return subcategoria ? `${categoriaCurta} · ${subcategoria}` : categoriaCurta;
}

export function IconeCategoria({ id, className = "size-5" }: { id: CategoriaId; className?: string }) {
  const Icone = ICONE_CATEGORIA[id];
  return <Icone className={className} aria-hidden />;
}

/** Estado "carregando" enquanto o app sincroniza com o Portal Acadêmico / SAE. */
export function Sincronizando() {
  return (
    <div className="space-y-4 px-4 pt-4" aria-busy="true">
      <p className="flex items-center justify-center gap-2 text-[13px] text-rotulo-2" role="status">
        <LoaderCircle className="size-4 animate-spin" aria-hidden />
        Sincronizando com o Portal Acadêmico / SAE…
      </p>
      <Esqueleto className="h-5 w-40" />
      <div className="space-y-1.5">
        <Esqueleto className="h-10 w-full" />
        <Esqueleto className="h-11 w-full" />
        <Esqueleto className="h-11 w-full" />
        <Esqueleto className="h-11 w-full" />
        <Esqueleto className="h-11 w-full" />
      </div>
      <Esqueleto className="h-14 w-full" />
      <Esqueleto className="h-12 w-full" />
    </div>
  );
}
