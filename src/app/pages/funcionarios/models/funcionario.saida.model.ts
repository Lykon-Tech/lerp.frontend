import { Horista } from "./horista.model";
import { Mensalista } from "./mensalista.model";
import { Pix } from "./pix.model";

export interface FuncionarioSaida {
  id?: number;
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
  cargoid? : string;
  contaId? : string;
  pix? : Pix;
  mensalista? : Mensalista;
  horista? : Horista; 
}
