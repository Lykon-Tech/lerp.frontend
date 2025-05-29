import { Curso } from "../../cursos/models/curso.model";
import { Funcionario } from "../../funcionarios/models/funcionario.model";
import { Sala } from "./sala.model";
import { SituacaoTurma } from "./situacaoturma.model";
import { Turno } from "./turno.model";

export interface Turma {
  id?: string;          
  nome?: string;
  ativo?: boolean;
  dataInicio? : Date;
  dataFim? : Date;
  maximoAlunos? : number;
  minimoAlunos? : number;
  metaAlunos? : number;
  curso? : Curso;
  situacaoTurma? : SituacaoTurma;
  professor? : Funcionario;
  turno? : Turno;
  sala? : Sala;
}
