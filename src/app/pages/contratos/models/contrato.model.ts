import { Bolsa } from "../../financeiro/models/bolsa.model";
import { Aluno } from "../../funcionarios/models/aluno.model";
import { Funcionario } from "../../funcionarios/models/funcionario.model";
import { Turma } from "../../turmas/models/turma.model";
import { SituacaoContrato } from "./situacaocontrato.model";
import { TipoContrato } from "./tipocontrato.model";

export interface Contrato {
  id?: string;          
  aluno?: Aluno;
  ativo?: boolean;
  dataInicio? : Date;
  dataFim? : Date;
  observacao? : string;
  turma? : Turma;
  vendedor? : Funcionario;
  bolsa? : Bolsa;
  situacaoContrato? : SituacaoContrato;
  tipoContrato? : TipoContrato;

}
