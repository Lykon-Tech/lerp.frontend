import { Subconta } from './subconta.model';
import { TipoDocumento } from './tipodocumento.model';

export interface Movimento {
    id?: string; 
    subconta?: Subconta;
    tipoDocumento?: TipoDocumento;
    valor?: number;
    dataLancamento?: Date;
    historico?: string;
    observacao?: string;
    numeroDocumento?: string;
    numeroMovimento?: string;
    importadoOfx?: boolean;
}