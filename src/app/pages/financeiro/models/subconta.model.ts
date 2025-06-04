import { GrupoConta } from "./grupoconta.model";
import { TagModel } from "./tag.model";

export interface Subconta {
  id?: string;  
  nome? : string;        
  grupoConta?: GrupoConta;
  ativo?: boolean;
  tipo?: string;
  tags?: TagModel[];
}
