"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { Tela } from "@/components/ui/Tela";
import { CURSOS, LUCAS } from "@/data/aluno";
import { useSessao } from "@/store/Sessao";

const campo =
  "h-12 w-full rounded-lg border border-borda bg-transparent px-4 text-center text-[17px] text-rotulo placeholder:text-rotulo-3 focus:border-ativo focus:outline-none";

/** Tela 2 · Autenticação (captura 02). Login simulado: Aluno.autenticar(). */
export function Login() {
  const router = useRouter();
  const sessao = useSessao();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);
  const curso = CURSOS.find((c) => c.sigla === sessao.curso);

  function autenticar(e: FormEvent) {
    e.preventDefault();
    if (!curso) return setErro("Escolha o seu curso.");
    if (!sessao.matricula.trim()) return setErro("Informe a matrícula.");
    if (!senha.trim()) return setErro("Informe a senha.");
    // Protótipo: qualquer matrícula/senha não vazia entra como o Lucas.
    const ok = LUCAS.autenticar(LUCAS.matricula, senha);
    if (!ok) return setErro("Não foi possível autenticar.");
    setErro("");
    setEntrando(true);
    setTimeout(() => router.push("/app/avisos"), 700);
  }

  return (
    <Tela voltar={{ rotulo: "Inatel Acadêmico", href: "/app/perfis" }} largura="estreita">
      <form onSubmit={autenticar} noValidate className="flex flex-1 flex-col justify-center gap-3.5 px-5 pb-24 pt-10">
        <p className="mb-5 text-center text-[17px]">Entre com as suas credenciais</p>
        <Link href="/app/login/cursos" className={`${campo} flex items-center justify-center ${curso ? "" : "text-rotulo-3"}`}>
          {curso ? curso.nome : "Curso"}
        </Link>
        <label className="block">
          <span className="sr-only">Matrícula</span>
          <input
            inputMode="numeric"
            value={sessao.matricula}
            onChange={(e) => sessao.setMatricula(e.target.value.replace(/\D/g, ""))}
            placeholder="Matrícula"
            className={campo}
          />
        </label>
        <label className="block">
          <span className="sr-only">Senha</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            autoComplete="off"
            className={campo}
          />
        </label>
        <p aria-live="assertive" className="min-h-5 text-center text-[14px] text-estouro">
          {erro}
        </p>
        <button
          type="submit"
          disabled={entrando}
          className="toque flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/30 bg-inatel text-[17px] text-white active:bg-inatel-press"
        >
          {entrando && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
          {entrando ? "Autenticando…" : "Autenticar"}
        </button>
        <p className="text-center text-[12px] text-rotulo-3">Protótipo: qualquer senha funciona.</p>
      </form>
    </Tela>
  );
}
