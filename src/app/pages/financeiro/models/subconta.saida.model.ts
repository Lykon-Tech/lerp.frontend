import { TagModel } from "./tag.model";

export interface SubcontaSaida {
  id?: string;  
  nome? : string;        
  grupoContaId?: string;
  ativo?: boolean;
  tipo?: string;
  tags? : TagModel[];
}
