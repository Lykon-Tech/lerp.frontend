import { Subconta } from './subconta.model';
import { Conta } from './conta.model';
import { TipoDocumento } from './tipodocumento.model';
import { Agrupamento } from './agrupamento.model';

export interface Movimento {
    id?: string; 
    subconta?: Subconta;
    conta? : Conta;
    tipoDocumento?: TipoDocumento;
    agrupamentos? : Agrupamento[],
    valor?: number;
    dataLancamento?: Date;
    historico?: string;
    observacao?: string;
    numeroDocumento?: string;
    numeroMovimento?: string;
    importadoOfx?: boolean;
}