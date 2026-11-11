"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Botao, Grupo, Linha } from "@/components/ui/basicos";
import { Folha } from "@/components/ui/Folha";
import { useFinanceiro } from "@/store/Financeiro";
import { useSessao } from "@/store/Sessao";

/** Apaga os dados da demonstração e volta para a Tela 1 (Perfis Salvos). */
function useReiniciarDemo() {
  const router = useRouter();
  const fin = useFinanceiro();
  const sessao = useSessao();
  return () => {
    fin.apagarDados();
    sessao.limpar();
    try {
      localStorage.removeItem("inatel-roteiro:v1"); // resto de versões antigas
    } catch {
      /* sem armazenamento */
    }
    router.push("/app/perfis");
  };
}

function Confirmacao({ aberta, onFechar }: { aberta: boolean; onFechar: () => void }) {
  const reiniciar = useReiniciarDemo();
  return (
    <Folha aberta={aberta} onFechar={onFechar} titulo="Voltar ao começo da demo?">
      <p className="pb-4 text-center text-[15px] text-rotulo-2">
        A renda, os tetos, os gastos e as subcategorias criadas serão apagados, e o app volta para Perfis Salvos.
      </p>
      <div className="space-y-2">
        <Botao
          onClick={() => {
            onFechar();
            reiniciar();
          }}
        >
          Voltar ao começo
        </Botao>
        <Botao variante="secundario" onClick={onFechar}>
          Cancelar
        </Botao>
      </div>
    </Folha>
  );
}

/** Item do Menu (celular e computador). */
export function ItemReiniciarDemo() {
  const [aberta, setAberta] = useState(false);
  return (
    <>
      <Grupo>
        <Linha
          titulo="Voltar ao começo da demo"
          subtitulo="Apaga os dados do protótipo e volta para Perfis Salvos"
          chevron={false}
          esquerda={<RotateCcw className="size-5 shrink-0 text-ativo" aria-hidden />}
          onClick={() => setAberta(true)}
        />
      </Grupo>
      <Confirmacao aberta={aberta} onFechar={() => setAberta(false)} />
    </>
  );
}

/** Botão da barra superior (computador). */
export function BotaoReiniciarDemo() {
  const [aberta, setAberta] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setAberta(true)}
        className="flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] text-white/90 hover:bg-white/15"
      >
        <RotateCcw className="size-4" aria-hidden /> Voltar ao começo
      </button>
      <Confirmacao aberta={aberta} onFechar={() => setAberta(false)} />
    </>
  );
}
