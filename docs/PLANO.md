# Plano — App Inatel · Planejador Financeiro & Bolsa (React)

Aluno: Rafael Correa Barbosa — GES 745 · Disciplina S05 Interação Homem-Máquina (Prof. Raphael Pereira)
Prazo no Moodle: ~17 dias a partir de 10/11/2026 (≈ 27/11). **Só 1 tentativa de envio** — enviar apenas a versão final.

---

## 0. O que a disciplina exige (fontes lidas)

- Moodle, tarefa "Projeto Final" + anexo "Exemplo de Formato de Entrega.pdf" (5 páginas, nesta ordem):
  1. Capa: nome, matrícula, justificativa breve da funcionalidade com base na persona, link do projeto (CodePen/GitHub Pages), tela(s) do projeto num celular.
  2. User Story · 3. Análise da Tarefa · 4. Fluxo de Informação (Diagrama de Classes) · 5. Wireframe.
- Avisos da capa: (a) experiência **completa**, simulando a tarefa de ponta a ponta; (b) **simulação de input, processamento e feedback** = diferencial; (c) **grid, cores, imagens, animações e interações** também são avaliados.
- Avaliação é **só sobre a interface publicada** (código sozinho não vale). Entrega: PDF + link.
- Professor autorizou fazer a documentação como página React (sua escolha).
- Stack ensinada (Notion "Fundamentos de React"): **Vite + React + Tailwind CSS + React Router DOM + Lucide React**. Componente do professor usa JSON de dados e azul `#126ae2`.
- Seus artefatos já prontos: User Story + HTA, Diagrama de Classes (7 classes), Wireframe (10 telas: 1–4 existentes, 5–10 novas).
- 9 capturas do app real (Perfis, Login, Cursos, Avisos, Horários, Notas, Frequência, Menu x3).

## 1. Decisões de base

| Decisão | Recomendação | Motivo |
|---|---|---|
| Framework | **Vite + React + TS** (substituir o scaffold Next.js atual) | É o que a disciplina ensinou; build estático simples para GitHub Pages |
| Roteamento | `HashRouter` | GitHub Pages não faz fallback de rotas; links profundos funcionam |
| Estilo | Tailwind 4 + tokens CSS do Inatel | Padrão da disciplina; consistência |
| Ícones | Lucide React | Padrão da disciplina; casa com os ícones das abas do app |
| Dados | JSON em `src/data/*.json` + `localStorage` para o que o aluno cria | Mesmo padrão do componente do professor; cumpre a promessa de privacidade (gastos só no aparelho) |
| Dinheiro | Inteiros em **centavos** | Evita erro de ponto flutuante (critério "sem erros de cálculo") |
| Publicação | GitHub Pages via GitHub Actions | Link estável para o PDF |
| Persona na demo | Lucas Andrade (do User Story) | Coerência documentação ↔ protótipo |

## 2. ESTRUTURA DE PÁGINAS (primeiro)

### 2.1 Site (rotas)

```
/#/                         Entrada: protótipo (celular) + painel "Roteiro da tarefa"
/#/doc                      Índice da documentação (ordem do PDF)
/#/doc/capa                 1. Capa: justificativa, persona, link, mockup
/#/doc/user-story           2. User Story + persona
/#/doc/analise-da-tarefa    3. HTA (diagrama SVG) + planos + Tabela 2 + critérios ISO 9241
/#/doc/diagrama-de-classes  4. Diagrama de classes (SVG) + mapa classe→código
/#/doc/wireframe            5. 10 telas do wireframe ↔ telas finais lado a lado
/#/doc/imprimir             Versão para exportar PDF (CSS de impressão, 5 páginas A4)
```

### 2.2 Dentro do celular (app Inatel)

```
EXISTENTES (mock fiel às capturas; só navegação/visual)
  /perfis                   Tela 1  Perfis Salvos
  /login                    Tela 2  Autenticação (curso + matrícula + senha)
  /login/cursos             (captura 3) lista de cursos CEX…GEE
  /avisos   (início)        Tela 3  Avisos + busca + "Não há Informações."
  /horarios                 grade 07:00–20:20 x S T Q Q S S
  /notas                    tabelas por disciplina (Avaliação | Nota)
  /frequencia               cards por disciplina (Aulas, Limite, Faltas, meses)
  /menu                     Tela 4  Menu com a NOVA seção SUPORTE FINANCEIRO (selo NOVO)

NOVAS (100% funcionais)
  /financeiro               Tela 5  Resumo da mensalidade   [aba Resumo]
  /financeiro/bolsa         Tela 6  Detalhes da bolsa
  /financeiro/planejar/renda  Tela 7  Passo 1/2 — Renda do mês
  /financeiro/planejar/tetos  Tela 8  Passo 2/2 — Tetos por categoria
  /financeiro/orcamento     Tela 9  Painel do orçamento     [aba Orçamento]
  /financeiro/lancar        Tela 10 Lançar gasto (teclado numérico)
  Estados extras: vazio (sem orçamento), carregando (sincronizando), estouro de teto,
                  renda insuficiente, histórico de despesas, confirmação de limpar dados
```

### 2.3 Layout responsivo

- Mobile (<500px): app em tela cheia (`100dvh`, safe-area), barra azul no topo, 5 abas fixas embaixo.
- Desktop: celular 390×844 centralizado + painel "Roteiro da tarefa" ao lado.
- Testar 320 · 360 · 390 · 412 · 430 · 768 · 1280 e paisagem.

## 3. Identidade visual (extraída das capturas)

- Fundo preto; barra superior azul Inatel (≈ `#0066C0`, a confirmar por amostragem de pixels); títulos de seção em azul; cabeçalho de tabela azul; cartões cinza-escuro; separadores finos; chevrons `>` à direita; busca arredondada cinza.
- Tipografia do sistema (`-apple-system, system-ui`); títulos centrados na barra; "Voltar" com chevron à esquerda.
- Aba ativa em azul-sistema; ícones Lucide: Mail, Clock, BarChart3, CalendarDays, Menu.
- Logo "Inatel" recortada da captura 1 (material seu) → `public/`.
- Tokens em `src/styles/tokens.css`: cores, raios, espaçamentos, alvos de toque ≥ 44px.
- Cores de estado do orçamento: ok (verde) < 70% · atenção (âmbar) 70–99% · estouro (vermelho) ≥ 100%, sempre com texto/ícone além da cor.

## 4. Núcleo funcional (o que vale nota de complexidade)

**Domínio (TS puro, testado) — espelha o diagrama de classes:**
`Aluno`, `SuporteFinanceiro`, `Mensalidade`, `Bolsa`, `OrcamentoMensal`, `CategoriaGasto`, `Despesa` com os mesmos atributos/métodos do diagrama (derivados `/` = getters).

**Regras de negócio:**
1. `desconto = bruto × percentual` · `parcelaLiquida = bruto − desconto`.
2. Bolsa Finatel 20–100%: cota não reembolsável 50% / reembolsável 50%; Fundacred/CredIES 50% reembolsável; FIES conciliável. (Conferir com inatel.br/sae e /suabolsa antes de fixar.)
3. `saldoLivre = renda − parcelaLiquida`. Se ≤ 0: bloqueia a divisão e explica.
4. Tetos: três percentuais somando 100%; "Usar divisão sugerida" (ex.: 50/30/20); sliders reequilibram automaticamente; "Salvar" só habilita com 100%.
5. `valorTeto = saldoLivre × %` · `comprometimento = totalGasto / valorTeto` · `saldoRestante = saldoLivre − Σ despesas`.
6. Renovação SAE: contagem regressiva com níveis (>30d neutro, ≤30d âmbar, ≤7d vermelho).

**Input → processamento → feedback (diferencial citado na capa):**
- Renda com máscara de moeda, chips de fonte (Auxílio, Estágio, Bolsa IC) somáveis, cálculo do saldo ao vivo.
- Teclado numérico próprio, categoria em 1 toque, validação (valor zero, acima do saldo → aviso, não bloqueio).
- Feedback: sincronização com skeleton + "atualizado hoje", barras animadas, contador animado do saldo, toasts com "Desfazer", haptic visual no botão, estados vazio/erro/estouro.
- Persistência em `localStorage` (com try/catch) + selo "Seus gastos ficam salvos só neste celular" + botão "Apagar meus dados".

**Tarefa simulada de ponta a ponta (rubrica):**
- Painel "Roteiro": passos 1.1 → 1.2 → 2.1 → 2.2 → 3.1 → 3.2 (códigos da HTA) que marcam sozinhos conforme o usuário avança; botão "Reiniciar demo" (limpa o `localStorage` da demo) e "Preencher exemplo".
- No celular: botão flutuante abre o roteiro numa bottom sheet.

## 5. Documentação como páginas React

- **User Story / Análise da tarefa / Classes / Wireframe**: reescritos como componentes, com os mesmos textos já entregues, corrigindo o nome do arquivo (`mercado_de_trabalho` é resto de outro template).
- **HTA**: diagrama SVG gerado de um JSON (Meta 0 → 1,2,3 → 1.1…3.2, planos 0 e "repetir 3").
- **Classes**: SVG com as 7 classes e relações; bloco "classe → arquivo no código".
- **Wireframe**: telas 1–10 do PDF ao lado das telas finais (provas de fidelidade).
- **PDF final**: `/doc/imprimir` com CSS `@media print`, 5 páginas na ordem do modelo; capa com link e mockup. Exportar via Chrome (Salvar como PDF) ou Playwright.
- Qualquer funcionalidade a mais que eu implementar (ex.: fontes de renda múltiplas, tipo de financiamento) **entra também no diagrama e no wireframe**, para manter consistência.

## 6. Estrutura de código

```
app_hm/
  index.html · vite.config.ts (base '/app_hm/') · .github/workflows/pages.yml
  src/
    main.tsx · App.tsx (HashRouter)
    styles/ tokens.css · globals.css
    data/ perfis.json · cursos.json · horarios.json · notas.json · frequencia.json
          menu.json · bolsas.json · mensalidade.json
    domain/ Aluno.ts · SuporteFinanceiro.ts · Mensalidade.ts · Bolsa.ts
            OrcamentoMensal.ts · CategoriaGasto.ts · Despesa.ts · money.ts · *.test.ts
    store/ useFinanceiro.ts (estado + localStorage)
    components/ PhoneFrame · StatusBar · NavBar · TabBar · ListRow · DataTable
                Card · ProgressBar · Toast · BottomSheet · Keypad · MoneyInput
                CategoryPill · Skeleton · Badge
    screens/existing/ ...      screens/financeiro/ ...      screens/doc/ ...
    tour/ Roteiro.tsx · steps.ts
  public/ logo-inatel.png
```

## 7. Fases (≈ 17 dias, com folga)

| Fase | Dias | Entrega | Pronto quando |
|---|---|---|---|
| 0 Base | 1 | Vite+Tailwind+Router, tokens, **deploy no Pages já no dia 1** | URL pública abre |
| 1 Estrutura | 2–3 | Todas as rotas como telas-esqueleto, PhoneFrame, TabBar, navegação 1→10 | Dá pra navegar o fluxo inteiro |
| 2 Mock real | 3–5 | Telas 1–4 + Horários/Notas/Frequência fiéis às capturas | Comparação lado a lado com os prints |
| 3 Módulo novo | 5–9 | Domínio + testes + telas 5–10 + estados extras | Cálculos batem em testes; fluxo completo funciona |
| 4 Polimento | 9–11 | Animações, toasts, roteiro guiado, acessibilidade | Auditoria da rubrica ≥ 9/10 em tudo |
| 5 Documentação | 11–14 | Páginas `/doc/*` + PDF de 5 páginas | PDF segue a ordem do modelo |
| 6 QA + envio | 14–16 | Testes em 7 larguras, celular real, revisão final | Link testado em outro aparelho; 1 envio no Moodle |

## 8. Auditoria da rubrica (como chegar a 100)

| Critério | Como atender | Evidência |
|---|---|---|
| Qualidade da apresentação | PDF na ordem do modelo, padronizado | `/doc/imprimir` |
| Análise da tarefa | HTA com notação Annett & Duncan, planos 0 e repetição | diagrama SVG + Tabela 2 |
| Fluxo de informações | Código espelha o diagrama; relações coerentes | mapa classe→arquivo + testes |
| Wireframe | 10 telas com navegação numerada | lado a lado com telas finais |
| Identidade Inatel | Tokens extraídos das capturas | app ao lado do print real |
| Responsivo | 7 larguras, `dvh`, safe-area, alvos 44px | capturas de teste |
| Tarefa ponta a ponta | Roteiro guiado com códigos HTA | painel Roteiro |
| Input/processamento/feedback | Máscara, validação, cálculos, toasts, estados | telas 7–10 |
| Complexidade | Regras de bolsa, 3 categorias, histórico, desfazer, persistência | domínio testado |

## 9. Riscos

- Moodle exige **1 envio único**: não enviar antes da auditoria final.
- Regras exatas de bolsa (cotas, datas) vêm do seu User Story; confirmar no site da SAE antes de fixar.
- Dados do app real são de uma conta pessoal: nas telas mock usar valores fictícios/persona.
- Mudar o escopo depois de Notas/Horários prontos custa caro: congelar a lista de telas no fim da Fase 1.

## 10. Como vamos trabalhar

Eu construo e testo no meu ambiente (npm/Vitest/capturas), publico uma prévia para você ver, e gravo os arquivos na pasta `app_hm`. Você roda `npm install && npm run dev` localmente e faz o `git push` para o GitHub Pages. Não consigo rodar comandos nem fazer push no seu computador.
