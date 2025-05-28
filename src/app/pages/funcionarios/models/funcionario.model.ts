import { Conta } from "../../financeiro/models/conta.model";
import { Cargo } from "./cargo.model";
import { Horista } from "./horista.model";
import { Mensalista } from "./mensalista.model";
import { Pix } from "./pix.model";

export interface Funcionario {
  id?: string;
  nome?: string;
  email?: string;
  cpf?: string;
  rg?: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  ativo?: boolean;
  cargo? : Cargo;
  conta? : Conta;
  pix? : Pix;
  mensalista? : Mensalista;
  horista? : Horista; 
}
