export interface ContratoSaida {
  id?: string;          
  alunoId?: string;
  ativo?: boolean;
  dataInicio? : Date;
  dataFim? : Date;
  observacao? : string;
  turmaId? : string;
  vendedorId? : string;
  bolsaId? : string;
  situacaoContratoId? : string;
  tipoContratoId? : string;

}
