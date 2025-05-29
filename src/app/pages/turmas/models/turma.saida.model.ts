export interface TurmaSaida {
  id?: string;          
  nome?: string;
  ativo?: boolean;
  dataInicio? : Date;
  dataFim? : Date;
  maximoAlunos? : number;
  minimoAlunos? : number;
  metaAlunos? : number;
  cursoId? : string;
  situacaoTurmaId? : string;
  professorId? : string;
  turnoId? : string;
  salaId? : string;
}
