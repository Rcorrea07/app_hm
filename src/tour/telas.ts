/**
 * Anotações de cada tela, iguais às do Wireframe (número, tipo, subtarefa da HTA,
 * classes e métodos). Aparecem no painel ao lado do celular.
 */
export interface InfoTela {
  numero?: number;
  nome: string;
  tipo: "existente" | "alterada" | "nova";
  hta?: string;
  classes?: string[];
}

const TELAS: Array<[string, InfoTela]> = [
  ["/app/perfis", { numero: 1, nome: "Perfis Salvos", tipo: "existente" }],
  ["/app/login/cursos", { nome: "Lista de cursos", tipo: "existente" }],
  ["/app/login", { numero: 2, nome: "Autenticação", tipo: "existente", classes: ["Aluno.autenticar()"] }],
  ["/app/avisos", { numero: 3, nome: "Avisos (início)", tipo: "existente" }],
  [
    "/app/menu",
    {
      numero: 4,
      nome: "Menu",
      tipo: "alterada",
      hta: "1.1 Acessar o Suporte Financeiro no App Inatel",
      classes: ["Aluno acessa SuporteFinanceiro"],
    },
  ],
  [
    "/app/financeiro/bolsa",
    {
      numero: 6,
      nome: "Detalhes da Bolsa",
      tipo: "nova",
      hta: "1.2 Discriminar as cotas da bolsa e o prazo de renovação na SAE",
      classes: ["Bolsa.calcularDesconto()", "Bolsa.verificarRenovacao()"],
    },
  ],
  [
    "/app/financeiro/planejar/renda",
    {
      numero: 7,
      nome: "Informar Renda",
      tipo: "nova",
      hta: "2.1 Informar renda / auxílio mensal (abatendo a parcela líquida)",
      classes: ["OrcamentoMensal.informarRenda()", "OrcamentoMensal.calcularSaldoLivre(Mensalidade)"],
    },
  ],
  [
    "/app/financeiro/planejar/tetos",
    {
      numero: 8,
      nome: "Definir Tetos",
      tipo: "nova",
      hta: "2.2 Definir tetos por categoria",
      classes: ["OrcamentoMensal.sugerirTetos()", "CategoriaGasto.definirTeto()"],
    },
  ],
  [
    "/app/financeiro/orcamento",
    {
      numero: 9,
      nome: "Painel do Orçamento",
      tipo: "nova",
      hta: "3.2 Consultar saldo livre e comprometimento",
      classes: ["OrcamentoMensal.calcularSaldoRestante()", "CategoriaGasto.calcularComprometimento()"],
    },
  ],
  [
    "/app/financeiro/lancar",
    {
      numero: 10,
      nome: "Lançar Gasto",
      tipo: "nova",
      hta: "3.1 Registrar despesa rápida em categoria pré-definida",
      classes: ["CategoriaGasto.registrarDespesa()", "Despesa.salvarLocal()"],
    },
  ],
  [
    "/app/financeiro",
    {
      numero: 5,
      nome: "Resumo da Mensalidade",
      tipo: "nova",
      hta: "1.2 Visualizar a mensalidade líquida",
      classes: [
        "SuporteFinanceiro.sincronizarPortal()",
        "Mensalidade.calcularParcelaLiquida()",
        "Bolsa.verificarRenovacao()",
      ],
    },
  ],
];

export function infoDaTela(pathname: string): InfoTela | null {
  const exata = TELAS.find(([rota]) => rota === pathname);
  if (exata) return exata[1];
  return TELAS.find(([rota]) => pathname.startsWith(rota))?.[1] ?? null;
}
