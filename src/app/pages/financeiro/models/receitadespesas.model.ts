import { GrupoConta } from "./grupoconta.model";

export interface ReceitaDespesa{
    mes: string;
    valor: number;
    grupoConta : GrupoConta; 
    tipo? : string;
}