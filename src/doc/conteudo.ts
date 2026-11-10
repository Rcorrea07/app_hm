/**
 * Conteúdo da documentação (as 5 páginas do modelo de entrega).
 * Textos vindos dos artefatos já entregues (User Story & HTA, Diagrama de Classes,
 * Wireframe), atualizados para bater com o protótipo final.
 */

export const ENTREGA = {
  aluno: "Rafael Correa Barbosa",
  matricula: "GES 745",
  disciplina: "S05 — Interação Homem-Máquina (Ergonomia e Usabilidade)",
  professor: "Prof. Raphael C. M. Pereira",
  eixo: "Suporte Financeiro",
  funcionalidade: "Planejador Financeiro & Bolsa",
  app: "App Inatel Acadêmico",
};

export const PAGINAS_DOC = [
  { n: 1, slug: "capa", titulo: "Capa" },
  { n: 2, slug: "user-story", titulo: "User Story" },
  { n: 3, slug: "analise-da-tarefa", titulo: "Análise da Tarefa" },
  { n: 4, slug: "diagrama-de-classes", titulo: "Fluxo de Informação" },
  { n: 5, slug: "wireframe", titulo: "Wireframe" },
] as const;

/* ---------------- Capa ---------------- */

export const JUSTIFICATIVA =
  "Lucas Andrade, 20 anos, bolsista parcial no 4º período de Engenharia de Software, mora em república e diz: " +
  "“Preciso saber quanto sobra no mês depois de pagar a parcela da faculdade e a república.” Hoje o App Inatel " +
  "mostra notas e horários, mas não liga o desconto da bolsa ao custo de vida. O Planejador Financeiro & Bolsa " +
  "traz a mensalidade líquida já calculada a partir dos dados da SAE e divide o saldo que sobra entre Moradia, " +
  "Alimentação e Estudos, com os gastos guardados só no celular do aluno.";

export const SIMULACAO = [
  { etapa: "Input", texto: "Renda por fonte com máscara de moeda, tetos por controle deslizante e teclado numérico próprio com categoria em 1 toque." },
  { etapa: "Processamento", texto: "Desconto da bolsa, parcela líquida, saldo livre, tetos que somam 100% ao centavo e comprometimento por categoria (código testado)." },
  { etapa: "Feedback", texto: "Sincronização com o Portal/SAE, valores animados, barras com estado (ok, atenção, estouro), alertas, confirmação e “Desfazer”." },
];

/* ---------------- User Story ---------------- */

export const CONTEXTO =
  "Grande parte dos estudantes de graduação do Inatel custeia seus estudos por meio de programas geridos pela " +
  "Seção de Assistência Estudantil (SAE) e pela Finatel: Bolsa Socioeconômica Finatel (de 20% a 100%, dividida em " +
  "50% não reembolsável e 50% reembolsável), Bolsa Beneficente, Bolsa Mérito, crédito estudantil Fundacred " +
  "(CredIES Inatel, 50% reembolsável) e FIES (conciliável com a Bolsa Finatel). Para evitar um controle genérico " +
  "tipo “bloco de notas”, a funcionalidade integra automaticamente os dados da bolsa do aluno (calculando a " +
  "parcela líquida real do mês) a um planejador de custo de vida local no aparelho, com categorias típicas da " +
  "rotina universitária.";

export const PERSONA: Array<[string, string]> = [
  [
    "Identificação e citação",
    "Lucas Andrade, 20 anos, 4º período (P4) de Engenharia de Software, bolsista parcial (Finatel/Fundacred). “Preciso saber quanto sobra no mês depois de pagar a parcela da faculdade e a república.”",
  ],
  [
    "Características-chave",
    "Mora em república em Santa Rita do Sapucaí; bolsa parcial administrada via SAE/Fundacred; recebe auxílio mensal da família somado a uma bolsa de iniciação científica.",
  ],
  [
    "Objetivos-chave",
    "Ver o valor líquido exato da mensalidade já com a bolsa e distribuir o saldo restante entre moradia, alimentação e estudos sem estourar o mês.",
  ],
  [
    "Dores principais",
    "Dificuldade em prever o impacto de créditos e reajustes na parcela líquida; falta de uma visão que una a mensalidade do Inatel aos gastos fixos de estudante.",
  ],
  [
    "O que nunca devemos fazer",
    "Entregar uma tela vazia tipo “bloco de notas” que exija cálculos manuais da bolsa, ou expor gastos pessoais fora do armazenamento local do celular.",
  ],
];

export const USER_STORY =
  "Como Lucas Andrade, estudante bolsista que mora fora de casa, quero visualizar minha mensalidade líquida " +
  "integrada a um planejador de gastos estudantis no App Inatel, para que eu consiga organizar meu custo de vida " +
  "mensal com base no desconto da minha bolsa sem comprometer meu orçamento.";

export const LEITURA: Array<[string, string]> = [
  ["Como [persona]", "Estudante bolsista (Finatel/Fundacred/FIES) que gerencia um orçamento mensal restrito."],
  ["Quero [intenção]", "Unir a consulta da parcela líquida da faculdade ao controle estruturado de gastos pessoais."],
  ["Para que [benefício]", "Ter previsibilidade financeira no semestre e evitar endividamento ou perda de prazos da bolsa."],
];

export const CRITERIOS_ACEITE = [
  "A mensalidade líquida aparece já calculada (bruto − desconto da bolsa), sem digitação.",
  "Com a renda informada, o saldo livre pós-mensalidade é calculado na hora; renda insuficiente bloqueia o avanço com explicação.",
  "Os tetos de Moradia, Alimentação e Estudos sempre somam 100% e têm divisão sugerida (50/30/20).",
  "Um gasto é registrado com valor + 1 toque na categoria e atualiza a barra e o saldo restante.",
  "Os gastos ficam só no armazenamento local do celular e podem ser apagados pelo aluno.",
];

/* ---------------- Análise da Tarefa (HTA) ---------------- */

export const HTA = {
  meta: { id: "0", titulo: "Planejar orçamento mensal integrado à bolsa no App Inatel", plano: "Plano 0: 1 > 2 > 3 (repetir 3 ao longo do mês)" },
  sub: [
    {
      id: "1",
      titulo: "Conferir bolsa e parcela",
      plano: "Plano 1: 1.1 > 1.2",
      ops: [
        { id: "1.1", titulo: "Acessar Suporte Financeiro no App Inatel" },
        { id: "1.2", titulo: "Visualizar mensalidade líquida (Finatel / Fundacred / FIES)" },
      ],
    },
    {
      id: "2",
      titulo: "Estruturar orçamento local",
      plano: "Plano 2: 2.1 > 2.2",
      ops: [
        { id: "2.1", titulo: "Informar renda / auxílio mensal (abatendo a parcela líquida)" },
        { id: "2.2", titulo: "Definir tetos por categoria (Moradia, Alimentação, Estudos)" },
      ],
    },
    {
      id: "3",
      titulo: "Lançar gasto e ver saldo",
      plano: "Plano 3: 3.1 > 3.2",
      ops: [
        { id: "3.1", titulo: "Registrar despesa rápida em categoria pré-definida" },
        { id: "3.2", titulo: "Consultar barra de saldo livre e comprometimento" },
      ],
    },
  ],
};

export const PLANOS: Array<[string, string]> = [
  [
    "Plano 0 (1 > 2 > 3)",
    "No início do mês, acessar o módulo para conferir a parcela líquida (1), definir a renda e os tetos (2) e, ao longo do mês, registrar despesas conferindo o saldo livre (3).",
  ],
  [
    "Iteração mensal (repetir 3)",
    "Sempre que houver uma despesa relevante em Moradia, Alimentação ou Estudos, executar só o subobjetivo 3 para atualizar o saldo.",
  ],
];

export const TABELA_2: Array<{ objetivo: string; plano: string; input: string; feedback: string; problema: string; recomendacao: string; tela: string }> = [
  {
    objetivo: "1. Conferir bolsa e parcela (1.1, 1.2)",
    plano: "Abrir Suporte Financeiro (1.1) e ver o resumo da mensalidade líquida (1.2).",
    input: "Dados do Portal Acadêmico/SAE: valor bruto, % da bolsa, cotas, prazo de renovação.",
    feedback: "Tabela com bruto, desconto, parcela líquida e vencimento; selo “atualizado hoje”.",
    problema: "Dúvida sobre o que é reembolsável e perda do prazo de renovação.",
    recomendacao: "Discriminar as cotas (Tela 6) e alertar a renovação com cor e contagem de dias.",
    tela: "Telas 4, 5 e 6",
  },
  {
    objetivo: "2. Estruturar orçamento local (2.1, 2.2)",
    plano: "Informar a renda (2.1) e distribuir tetos nas categorias (2.2).",
    input: "Renda por fonte (auxílio, estágio, bolsa IC) e percentuais por categoria.",
    feedback: "Saldo livre calculado na hora; tetos em R$ que somam 100%; aviso se a renda não cobre a parcela.",
    problema: "Abandono se exigir preenchimento extenso como planilha.",
    recomendacao: "Categorias prontas, divisão sugerida 50/30/20 e controles que se reequilibram.",
    tela: "Telas 7 e 8",
  },
  {
    objetivo: "3. Lançar gasto e ver saldo (3.1, 3.2)",
    plano: "Registrar o valor em uma categoria (3.1) e consultar o comprometimento (3.2).",
    input: "Valor no teclado numérico e 1 toque na categoria.",
    feedback: "Barra da categoria animada (ok/atenção/estouro), saldo restante, toast com “Desfazer”.",
    problema: "Receio de privacidade e erro de digitação.",
    recomendacao: "Guardar só no celular, avisar antes de estourar o teto e permitir desfazer.",
    tela: "Telas 9 e 10",
  },
];

export const ISO_9241: Array<[string, string]> = [
  ["Eficácia", "O aluno vê a mensalidade líquida correta e monta o orçamento sem erros de cálculo (regras testadas, valores em centavos)."],
  ["Eficiência", "O desconto já vem preenchido; um gasto leva 3 toques (valor, categoria, registrar), sem digitação livre."],
  ["Satisfação", "Sensação de controle com barras e estados claros, e privacidade garantida pelo armazenamento local."],
];

/* ---------------- Diagrama de Classes ---------------- */

export interface ClasseUML {
  id: string;
  nome: string;
  x: number;
  y: number;
  w: number;
  atributos: string[];
  metodos: string[];
  arquivo: string;
}

/** ★ = membro acrescentado no protótipo final. */
export const CLASSES: ClasseUML[] = [
  {
    id: "aluno",
    nome: "Aluno",
    x: 10, y: 20, w: 232,
    atributos: ["- nome: string", "- matricula: string", "- periodo: number"],
    metodos: ["+ autenticar(matricula, senha): boolean"],
    arquivo: "src/domain/Aluno.ts",
  },
  {
    id: "suporte",
    nome: "SuporteFinanceiro",
    x: 300, y: 20, w: 215,
    atributos: ["- telaAtiva: string"],
    metodos: ["+ abrirResumo(): void", "+ abrirOrcamento(): void", "+ sincronizarPortal(): Mensalidade"],
    arquivo: "src/domain/SuporteFinanceiro.ts",
  },
  {
    id: "mensalidade",
    nome: "Mensalidade",
    x: 575, y: 20, w: 240,
    atributos: [
      "- mesReferencia: string",
      "- valorBruto: number",
      "- dataVencimento: string",
      "/ descontoAplicado: number",
      "/ parcelaLiquida: number",
    ],
    metodos: ["+ calcularParcelaLiquida(): number", "+ exibirResumo(): ResumoMensalidade"],
    arquivo: "src/domain/Mensalidade.ts",
  },
  {
    id: "bolsa",
    nome: "Bolsa",
    x: 880, y: 20, w: 252,
    atributos: [
      "- tipo: string",
      "- percentual: number",
      "- cotaNaoReembolsavel: number",
      "- cotaReembolsavel: number",
      "- dataRenovacao: string",
    ],
    metodos: [
      "+ calcularDesconto(valorBruto): number",
      "+ verificarRenovacao(hoje): boolean",
      "+ diasParaRenovacao(hoje): number ★",
    ],
    arquivo: "src/domain/Bolsa.ts",
  },
  {
    id: "orcamento",
    nome: "OrcamentoMensal",
    x: 120, y: 330, w: 290,
    atributos: ["- mesReferencia: string", "- rendaMensal: number", "/ saldoLivre: number", "/ saldoRestante: number"],
    metodos: [
      "+ informarRenda(valor: number): void",
      "+ calcularSaldoLivre(m: Mensalidade): number",
      "+ sugerirTetos(): void",
      "+ calcularSaldoRestante(): number",
      "+ removerDespesa(id: string): Despesa ★",
      "+ salvarLocal(): boolean",
    ],
    arquivo: "src/domain/OrcamentoMensal.ts",
  },
  {
    id: "categoria",
    nome: "CategoriaGasto",
    x: 520, y: 330, w: 285,
    atributos: ["- nome: string", "- percentualTeto: number", "/ valorTeto: number", "/ totalGasto: number"],
    metodos: [
      "+ definirTeto(percentual: number): void",
      "+ registrarDespesa(valor: number): Despesa",
      "+ calcularComprometimento(): number",
      "+ excessoSeRegistrar(valor): number ★",
    ],
    arquivo: "src/domain/CategoriaGasto.ts",
  },
  {
    id: "despesa",
    nome: "Despesa",
    x: 905, y: 330, w: 210,
    atributos: ["- id: string ★", "- valor: number", "- data: string"],
    metodos: ["+ salvarLocal(): boolean"],
    arquivo: "src/domain/Despesa.ts",
  },
];

export type TipoRelacao = "associacao" | "dependencia" | "agregacao" | "composicao";

export interface RelacaoUML {
  de: string;
  para: string;
  tipo: TipoRelacao;
  rotulo: string;
  multDe: string;
  multPara: string;
}

/** "de" é o lado do losango (todo) na agregação/composição. */
export const RELACOES: RelacaoUML[] = [
  { de: "aluno", para: "suporte", tipo: "associacao", rotulo: "acessa", multDe: "1..1", multPara: "1..1" },
  { de: "suporte", para: "mensalidade", tipo: "associacao", rotulo: "exibe", multDe: "1..1", multPara: "0..*" },
  { de: "mensalidade", para: "bolsa", tipo: "agregacao", rotulo: "aplica", multDe: "0..*", multPara: "0..*" },
  { de: "suporte", para: "orcamento", tipo: "composicao", rotulo: "gerencia", multDe: "1..1", multPara: "0..*" },
  { de: "orcamento", para: "categoria", tipo: "composicao", rotulo: "contém", multDe: "1..1", multPara: "3" },
  { de: "categoria", para: "despesa", tipo: "composicao", rotulo: "registra", multDe: "1..1", multPara: "0..*" },
  { de: "orcamento", para: "mensalidade", tipo: "dependencia", rotulo: "usa a parcela líquida", multDe: "", multPara: "" },
];

/* ---------------- Wireframe ---------------- */

export const TELAS_WIREFRAME: Array<{
  n: number;
  nome: string;
  tipo: "existente" | "alterada" | "nova";
  hta?: string;
  classes?: string;
  navegacao: string;
  rota: string;
}> = [
  { n: 1, nome: "Perfis Salvos", tipo: "existente", navegacao: "Perfil salvo → Tela 2", rota: "/app/perfis" },
  { n: 2, nome: "Autenticação", tipo: "existente", classes: "Aluno.autenticar()", navegacao: "Autenticar → Tela 3", rota: "/app/login" },
  { n: 3, nome: "Avisos (início)", tipo: "existente", navegacao: "Aba Menu → Tela 4", rota: "/app/avisos" },
  {
    n: 4, nome: "Menu", tipo: "alterada", hta: "1.1", classes: "Aluno acessa SuporteFinanceiro",
    navegacao: "Planejador Financeiro & Bolsa (NOVO) → Tela 5", rota: "/app/menu",
  },
  {
    n: 5, nome: "Resumo da Mensalidade", tipo: "nova", hta: "1.2",
    classes: "SuporteFinanceiro.abrirResumo(); Mensalidade.calcularParcelaLiquida(); Bolsa.verificarRenovacao()",
    navegacao: "Bolsa → 6 · Planejar orçamento → 7 · Aba Orçamento → 9", rota: "/app/financeiro",
  },
  {
    n: 6, nome: "Detalhes da Bolsa", tipo: "nova", hta: "1.2",
    classes: "Bolsa: percentual, cotas, dataRenovacao", navegacao: "Voltar → 5", rota: "/app/financeiro/bolsa",
  },
  {
    n: 7, nome: "Informar Renda", tipo: "nova", hta: "2.1",
    classes: "OrcamentoMensal.informarRenda(); calcularSaldoLivre(Mensalidade)", navegacao: "Continuar → 8",
    rota: "/app/financeiro/planejar/renda",
  },
  {
    n: 8, nome: "Definir Tetos", tipo: "nova", hta: "2.2",
    classes: "OrcamentoMensal.sugerirTetos(); CategoriaGasto.definirTeto()", navegacao: "Salvar orçamento → 9",
    rota: "/app/financeiro/planejar/tetos",
  },
  {
    n: 9, nome: "Painel do Orçamento", tipo: "nova", hta: "3.2",
    classes: "OrcamentoMensal.calcularSaldoRestante(); CategoriaGasto.calcularComprometimento()",
    navegacao: "+ Lançar gasto → 10 · Aba Resumo → 5", rota: "/app/financeiro/orcamento",
  },
  {
    n: 10, nome: "Lançar Gasto", tipo: "nova", hta: "3.1",
    classes: "CategoriaGasto.registrarDespesa(); Despesa.salvarLocal()", navegacao: "Registrar ou Cancelar → 9",
    rota: "/app/financeiro/lancar",
  },
];

export const ESTADOS_EXTRAS = [
  "Sincronizando com o Portal/SAE (skeleton) nas telas 5–10",
  "Renda insuficiente: alerta e Continuar bloqueado (Tela 7)",
  "Orçamento vazio com chamada para planejar (Tela 9)",
  "Aviso antes de passar do teto, com confirmação (Tela 10)",
  "Histórico de gastos com remover + Desfazer (Tela 9)",
  "Apagar meus dados com confirmação (Tela 9)",
];
