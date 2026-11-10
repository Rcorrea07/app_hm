export interface ItemMenu {
  titulo: string;
  subtitulo: string;
  href?: string;
}

export interface SecaoMenu {
  titulo: string;
  itens: ItemMenu[];
  novo?: boolean;
}

/** Seções antes do Suporte Financeiro (iguais às capturas 08–10). */
export const MENU_ANTES: SecaoMenu[] = [
  {
    titulo: "Aproveitamento Escolar",
    itens: [
      { titulo: "Notas", subtitulo: "Apresenta as Notas do Semestre" },
      { titulo: "Frequência", subtitulo: "Apresenta a Frequência do Semestre" },
      { titulo: "Material Didático", subtitulo: "Apresenta o Material de Aula Publicado pelo Docente" },
      { titulo: "Plano de Ensino", subtitulo: "Apresenta o Plano de Ensino das Disciplinas" },
      { titulo: "Histórico Escolar", subtitulo: "Apresenta o Histórico Escolar do Aluno" },
      { titulo: "Coeficiente Acadêmico", subtitulo: "Apresenta os Coeficientes de todos os Semestres." },
    ],
  },
  {
    titulo: "Atividades Complementares",
    itens: [
      { titulo: "Avaliações", subtitulo: "Apresenta as Avaliações de A.C." },
      { titulo: "Frequência", subtitulo: "Apresenta a Frequência do Semestre em A.C." },
      { titulo: "Atividades Eletivas", subtitulo: "Apresenta as Atividades Eletivas do Aluno." },
      { titulo: "Atividades Obrigatórias", subtitulo: "Apresenta as Atividades Obrigatórias do Semestre em A.C." },
    ],
  },
  {
    titulo: "Calendários e Horários",
    itens: [
      { titulo: "Calendário Acadêmico", subtitulo: "Consulta ao Calendário Acadêmico do Semestre." },
      { titulo: "Eventos Inatel", subtitulo: "Consulta aos Eventos Inatel do Semestre." },
      { titulo: "Provas", subtitulo: "Consulta ao Calendário de Provas" },
      { titulo: "Reposições", subtitulo: "Consulta ao Calendário de Reposições de Aula" },
      { titulo: "Horários de Aula", subtitulo: "Consulta os Horários de Aula do Aluno no Semestre" },
      { titulo: "Cronograma de Aula", subtitulo: "Apresenta o calendário de aulas de turmas com cronograma" },
      { titulo: "Horários Atendimento Monitores", subtitulo: "Apresenta os Horários de Atendimento dos Monitores" },
    ],
  },
  {
    titulo: "Tesouraria",
    itens: [
      { titulo: "Consulta Lançamentos Tesouraria", subtitulo: "Apresenta Lançamentos de Tesouraria do Aluno no Semestre." },
    ],
  },
];

export const MENU_DEPOIS: SecaoMenu[] = [
  {
    titulo: "Outras Opções",
    itens: [
      { titulo: "Consulta de Pedidos", subtitulo: "Apresenta todos os Pedidos do Aluno no Semestre." },
      { titulo: "Avaliação de Docentes", subtitulo: "Apresenta os Docentes a serem Avaliados no Semestre." },
      { titulo: "Pesquisa Institucional", subtitulo: "Apresenta Pesquisa Institucional." },
      { titulo: "Central de Cópias", subtitulo: "Gera uma Ordem de Serviço para a Central de Cópias." },
      { titulo: "Requerimentos", subtitulo: "Apresenta os requerimentos on-line" },
      { titulo: "Configurações", subtitulo: "Apresenta as Configurações do Aplicativo." },
    ],
  },
];
