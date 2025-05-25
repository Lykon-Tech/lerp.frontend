import { Disciplina } from "./disciplina.model";

export interface MatrizCurricular {
  id?: string;          
  nome?: string;
  ativo?: boolean;
  disciplinas?: Disciplina[];
}
