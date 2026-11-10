# CLAUDE.md — App Inatel · Planejador Financeiro & Bolsa

Projeto final da disciplina S05 Interação Homem-Máquina (Inatel, Prof. Raphael Pereira). Aluno: Rafael Correa Barbosa — GES 745.
`docs/PLANO.md` tem o plano original (contexto, rubrica). Este arquivo descreve o estado atual do código e manda quando os dois divergirem.

## Objetivo
Construir em React um protótipo do App Inatel Acadêmico (mock fiel às telas reais) com UMA funcionalidade nova realmente funcional: **Planejador Financeiro & Bolsa** (Suporte Financeiro). Publicar na Vercel. **A documentação (5 páginas do PDF) fica em outro projeto**, não aqui. A versão antiga com `/doc` está guardada na branch `arquivo/documentacao-react`.

## Regras de entrega (Moodle, tarefa "Projeto Final")
- PDF de 5 páginas, nesta ordem: 1 Capa (nome, matrícula, justificativa pela persona, link, tela no celular) · 2 User Story · 3 Análise da Tarefa (HTA) · 4 Fluxo de Informação (Diagrama de Classes) · 5 Wireframe.
- A avaliação é só sobre a **interface publicada** (CodePen ou GitHub Pages). Só código não vale.
- Exigido: experiência completa de ponta a ponta; simulação de input, processamento e feedback (diferencial); qualidade de grid, cores, imagens, animações e interações.
- **Só 1 tentativa de envio.** Prazo ≈ 27/11/2026. Não enviar antes da auditoria final.
- Rubrica: apresentação do PDF · análise da tarefa · fluxo de informações · wireframe · identidade Inatel · responsivo · tarefa ponta a ponta · input/processamento/feedback · complexidade.

## Stack
Next.js 16 (App Router, Cache Components ligado) + React 19 + TypeScript + Tailwind CSS 4 + Lucide React. Vitest (domínio) e Playwright (E2E e capturas). Deploy na Vercel, repo `github.com/Rcorrea07/app_hm`.
- Next 16 tem APIs novas: consulte `node_modules/next/dist/docs/` antes de usar algo do framework.
- Com Cache Components, `new Date()` e `localStorage` não podem rodar no render: só em `useEffect` ou em handlers (senão o build quebra no prerender).

## Comandos
`npm run dev` · `npm run build` · `npm test` (Vitest) · `npm run e2e` (Playwright; sobe build na porta 3123) · `npm run capturas` (PNGs das telas 1–10 em `capturas/` para a documentação; precisa do app rodando em :3123).

## Estrutura
- `src/domain/`: as 7 classes do diagrama (Aluno, SuporteFinanceiro, Mensalidade, Bolsa, OrcamentoMensal, CategoriaGasto, Despesa) + `money`, `datas`, `tetos`, `teclado`, `armazenamentoLocal`. Um `*.test.ts` por módulo.
- `src/store/`: `Financeiro.tsx` (estado do módulo + persistência), `Sessao.tsx` (login simulado).
- `src/screens/existentes/` (telas 1–4, mock) e `src/screens/financeiro/` (telas 5–10, funcionais). `src/app/app/**/page.tsx` só importam a tela.
- `src/components/shell/AppShell.tsx`: casca responsiva. `src/tour/`: roteiro da tarefa (passos da HTA) e anotações de cada tela.

## Responsividade (obrigatória no celular E no computador)
Variantes por container definidas em `globals.css`: `desk:` (app ≥ 1024px: barra superior + menu lateral, sem abas), `largo:` (≥ 1280px: roteiro fixo à direita), `amplo:` (conteúdo ≥ 736px: colunas). Use essas variantes, não `lg:`/`md:` de viewport, dentro do app. Não há modo "ver no celular": a rubrica só pede que o app se adapte.

## Contexto de design (fontes em `docs/contexto/`)
- `capturas-app-real/`: 10 prints do app real (tema escuro, barra azul `#0166C0` amostrada, 5 abas: Avisos, Horários, Notas, Frequência, Menu). Reproduzir o visual; dados do mock devem ser fictícios/da persona.
- `entregas-anteriores/`: User Story + HTA, Diagrama de Classes (7 classes), Wireframe (10 telas: 1–4 existentes, 5–10 novas). O código e o diagrama devem ser coerentes.
- Persona: Lucas Andrade, 20, P4 Eng. de Software, bolsista parcial (Finatel/Fundacred). "Preciso saber quanto sobra no mês depois de pagar a parcela da faculdade e a república."
- Privacidade: gastos pessoais só em `localStorage`.

## Regras de negócio (conferir com inatel.br/sae e /suabolsa)
desconto = bruto × %; parcelaLiquida = bruto − desconto; Finatel 20–100% (50% não reembolsável / 50% reembolsável); saldoLivre = renda − parcelaLiquida; tetos somam 100% (sugestão 50/30/20); comprometimento = gasto/teto; saldoRestante = saldoLivre − Σ despesas. Dinheiro em centavos (inteiros). Estados: <70% ok, 70–99% atenção, ≥100% estouro.

## Convenções
- Fluxo de telas e numeração (1–10) seguem o wireframe; mudou o escopo → atualizar diagrama e wireframe.
- Domínio em TS puro com testes (Vitest), espelhando as classes do diagrama.
- Mobile-first (100dvh, safe-area, alvos ≥ 44px); testar 320/360/390/412/430/768/1280.
- Idioma da UI e dos textos: português do Brasil.

## Decisões tomadas (10/11/2026)
- Manter Next.js e hospedar na Vercel. Confirmar com o professor se link Vercel vale (o modelo cita CodePen/GitHub Pages).
- Persona na demo: Lucas Andrade (dados fictícios). Aluno real só na capa/documentação.
- Extras do protótipo entram no diagrama e no wireframe da documentação (no outro projeto).
- Sem backend: tudo é estático. Login é só visual (não precisa persistir). Os gastos ficam em `localStorage` por privacidade.
- `next dev` acessado pelo IP da rede (celular) bloqueia os scripts de dev por padrão (`allowedDevOrigins`); para testar no celular, use o deploy da Vercel.
- Horários, Notas e Frequência **não** fazem parte do protótipo: as abas aparecem, mas só mostram "Indisponível no protótipo". Só Perfis, Login, Avisos, Menu e o Suporte Financeiro existem.
