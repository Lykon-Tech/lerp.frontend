import { Subconta } from "./subconta.model";

export interface Tag {
  id?: string;          
  nome?: string;
  ativo?: boolean;
  subconta? : Subconta;
}
