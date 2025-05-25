export interface FiltroMovimento {
  dataInicio?: Date;
  dataFim?: Date;
  numeroMovimento?: string;
  numeroDocumento?: string;
  importadoOfx?: boolean;
  subcontaId?: string;
}
