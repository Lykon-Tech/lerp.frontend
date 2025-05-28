import { TipoPagamento } from "./tipopagamento.model";

export interface Horista extends TipoPagamento{
    valorHora? : number;
}