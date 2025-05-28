export interface CursoSaida {
  id?: string;          
  nome?: string;
  ativo?: boolean;
  valor? : number;
  coordenadorId?: string;
  numeroAulas? : number;
  cargaHoraria? : number;
  matrizCurricularId? : string;
  tipoCursoId? : string;
  bolsasIds? : string[];
}
