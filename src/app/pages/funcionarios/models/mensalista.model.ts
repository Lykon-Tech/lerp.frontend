import { TipoPagamento } from "./tipopagamento.model";

export interface Mensalista extends TipoPagamento{
    valorSalario? : number;
    percentualInss? : number;
}