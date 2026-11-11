"use client";

import { useEffect, useId, type ReactNode } from "react";

/** Bottom sheet dentro do celular (substitui diálogos do navegador). */
export function Folha({
  aberta,
  onFechar,
  titulo,
  children,
}: {
  aberta: boolean;
  onFechar: () => void;
  titulo: string;
  children: ReactNode;
}) {
  const id = useId();

  useEffect(() => {
    if (!aberta) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [aberta, onFechar]);

  if (!aberta) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end desk:items-center desk:justify-center">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onFechar}
        className="absolute inset-0 animate-surge bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className="relative w-full animate-sobe rounded-t-2xl bg-superficie text-rotulo px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 shadow-2xl desk:max-w-md desk:rounded-2xl desk:p-6"
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-sobre/25 desk:hidden" aria-hidden />
        <h2 id={id} className="mb-2 text-center text-[17px] font-semibold">
          {titulo}
        </h2>
        {children}
      </div>
    </div>
  );
}
