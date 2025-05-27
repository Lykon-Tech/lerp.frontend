import { GrupoConta } from "./grupoconta.model";

export interface Subconta {
  id?: string;  
  nome? : string;        
  grupoConta?: GrupoConta;
  ativo?: boolean;
  tipo?: string;
}
