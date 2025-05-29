import { Cargo } from "./cargo.model";

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
  isMensalista : boolean;
  valorSalario? : number;
  percentualInss? : number;
  valorHora? : number;
  chavePix? : string;
  tipoChavePix? : string;
  agencia?: string;
  numeroConta?: string;
}
