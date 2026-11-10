# App Inatel · Planejador Financeiro & Bolsa

Protótipo do **App Inatel Acadêmico** com uma funcionalidade nova, o **Planejador Financeiro & Bolsa**.
É o projeto final de S05 — Interação Homem-Máquina (Inatel). Aluno: Rafael Correa Barbosa (GES 745).

As telas 1–4 (Perfis, Login, Avisos, Menu) imitam o app real e servem só de contexto.
As telas 5–10 (eixo Suporte Financeiro) funcionam de verdade:

| Tela | O que faz | HTA |
|---|---|---|
| 5 Resumo | Mensalidade líquida já com o desconto da bolsa | 1.2 |
| 6 Detalhes da Bolsa | Cotas reembolsável / não reembolsável e prazo de renovação na SAE | 1.2 |
| 7 Informar Renda | Renda por fonte e saldo livre calculado na hora | 2.1 |
| 8 Definir Tetos | Moradia, Alimentação e Estudos somando 100% (sugestão 50/30/20) | 2.2 |
| 9 Painel do Orçamento | Saldo restante, barras por categoria, histórico com desfazer | 3.2 |
| 10 Lançar Gasto | Teclado numérico + categoria em 1 toque, aviso antes de estourar o teto | 3.1 |

Não há backend. Os gastos ficam só no `localStorage` do aparelho, como pede o User Story.
O layout se adapta: no celular aparecem as abas inferiores, e no computador aparecem uma barra superior, um menu lateral e o roteiro da tarefa.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # regras de negócio (Vitest)
npm run e2e        # fluxo completo no navegador (Playwright)
```

## Estrutura

- `src/domain/`: as 7 classes do diagrama de classes, em TypeScript puro e testadas. Valores em centavos.
- `src/store/`: estado das telas e persistência local.
- `src/screens/`: telas existentes (mock) e telas do Suporte Financeiro.
- `src/components/`: casca responsiva e componentes no visual do app.
- `src/tour/`: roteiro da tarefa, que marca os passos da HTA conforme o uso.
