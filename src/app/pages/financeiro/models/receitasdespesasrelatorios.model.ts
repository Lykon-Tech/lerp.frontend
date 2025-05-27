import { ReceitaDespesa } from "./receitadespesas.model";
import { ReceitasDespesasBase } from "./receitasdespesasbase.model";

export interface ReceitasDespesasRelatorios{
    receitas? : ReceitasDespesasBase;
    despesas? : ReceitasDespesasBase;
    receitasDespesasMensal? : ReceitaDespesa[];
}