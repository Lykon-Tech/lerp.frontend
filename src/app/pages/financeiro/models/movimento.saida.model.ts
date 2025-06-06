export interface MovimentoSaida {
    id?: string; 
    subcontaId: string;
    contaId: string;
    tipoDocumentoId: string;
    valor: number;
    dataLancamento: Date;
    historico?: string;
    observacao?: string;
    numeroDocumento?: string;
    numeroMovimento?: string;
    importadoOfx: boolean;
}