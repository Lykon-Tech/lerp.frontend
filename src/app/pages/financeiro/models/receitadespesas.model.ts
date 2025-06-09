export interface ReceitaDespesa{
    grupoContaId : string;
    grupoContaNome : string;
    subcontaId : string;
    subcontaNome : string;
    mes: number;
    valor: number;
    tipo? : string;
}