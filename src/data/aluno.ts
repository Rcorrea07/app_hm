import { Aluno } from "@/domain/Aluno";

/** Persona do User Story. Dados fictícios. */
export const LUCAS = new Aluno({
  nome: "Lucas Andrade",
  matricula: "512",
  periodo: 4,
  curso: "GES",
  email: "lucas.andrade@ges.inatel.br",
});

export const CURSOS = [
  { sigla: "CEX", nome: "Curso - Atividades Extras" },
  { sigla: "GAE", nome: "Curso Aluno Especial" },
  { sigla: "TAI", nome: "Curso Superior de Tecnologia em Automação Industrial" },
  { sigla: "TGT", nome: "Curso Superior de Tecnologia em Gestão de Telecomunicações" },
  { sigla: "GEB", nome: "Engenharia Biomédica" },
  { sigla: "GEC", nome: "Engenharia de Computação" },
  { sigla: "GEA", nome: "Engenharia de Controle e Automação" },
  { sigla: "GEP", nome: "Engenharia de Produção" },
  { sigla: "GES", nome: "Engenharia de Software" },
  { sigla: "GET", nome: "Engenharia de Telecomunicações" },
  { sigla: "GEL", nome: "Engenharia Elétrica" },
  { sigla: "GEE", nome: "Engenharia Elétrica (modalidade em eletrônica)" },
] as const;
