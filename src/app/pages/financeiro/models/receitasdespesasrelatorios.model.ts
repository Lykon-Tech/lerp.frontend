import { ReceitaDespesa } from "./receitadespesas.model";
import { ReceitasDespesasBase } from "./receitasdespesasbase.model";

export interface ReceitasDespesasRelatorios{
    receita? : ReceitasDespesasBase;
    despesa? : ReceitasDespesasBase;
    receitasDespesasMensal? : ReceitaDespesa[];
}