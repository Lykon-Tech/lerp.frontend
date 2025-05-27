import { Banco } from "./banco.model";

export interface Conta {
  id?: string;          
  banco?: Banco;
  ativo?: boolean;
  agencia?: string;
  numeroConta?: string;
}
