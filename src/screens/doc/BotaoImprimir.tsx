"use client";

import { Printer } from "lucide-react";

export function BotaoImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex h-10 items-center gap-2 rounded-lg bg-[#0166c0] px-4 font-semibold text-white"
    >
      <Printer className="size-4" aria-hidden /> Imprimir / PDF
    </button>
  );
}
