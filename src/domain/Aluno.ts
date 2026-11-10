export interface AlunoDados {
  nome: string;
  matricula: string;
  periodo: number;
  curso: string;
  email: string;
}

/** Classe Aluno do diagrama. No protótipo a autenticação é simulada. */
export class Aluno {
  readonly nome: string;
  readonly matricula: string;
  readonly periodo: number;
  readonly curso: string;
  readonly email: string;

  constructor(dados: AlunoDados) {
    this.nome = dados.nome;
    this.matricula = dados.matricula;
    this.periodo = dados.periodo;
    this.curso = dados.curso;
    this.email = dados.email;
  }

  /** Aceita qualquer senha não vazia com a matrícula certa (simulação). */
  autenticar(matricula: string, senha: string): boolean {
    return matricula.trim() === this.matricula && senha.trim().length > 0;
  }
}
