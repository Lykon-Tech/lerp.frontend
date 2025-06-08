import { AgrupamentoSaida } from "./agrupamento.saida.model";

export interface MovimentoSaida {
    id?: string; 
    subcontaId: string;
    contaId: string;
    tipoDocumentoId: string;
    agrupamentos: AgrupamentoSaida[];
    valor: number;
    dataLancamento: Date;
    historico?: string;
    observacao?: string;
    numeroDocumento?: string;
    numeroMovimento?: string;
    importadoOfx: boolean;
}