import { Bolsa } from "../../financeiro/models/bolsa.model";
import { Funcionario } from "../../funcionarios/models/funcionario.model";
import { MatrizCurricular } from "./matrizcurricular.model";
import { TipoCurso } from "./tipocurso.model";

export interface Curso {
  id?: string;          
  nome?: string;
  ativo?: boolean;
  valor? : number;
  coordenador?: Funcionario;
  numeroAulas? : number;
  cargaHoraria? : number;
  matrizCurricular? : MatrizCurricular;
  tipoCurso? : TipoCurso;
  bolsas? : Bolsa[]
}
