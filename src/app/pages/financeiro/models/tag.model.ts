import { Subconta } from "./subconta.model";

export interface TagModel {
  id?: string;          
  nome?: string;
  ativo?: boolean;
  subconta? : Subconta;
}
