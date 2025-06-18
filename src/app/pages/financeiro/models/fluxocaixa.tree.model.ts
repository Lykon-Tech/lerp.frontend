export interface FluxoCaixaTreeNode {
  grupoConta?: string;
  subconta?: string;
  tipo?: string;
  faixaDRE? : string;
  isTotal?: boolean;
  isHeader?: boolean;
  name?: string;
  janeiro?: number;
  fevereiro?: number;
  marco?: number;
  abril?: number;
  maio?: number;
  junho?: number;
  julho?: number;
  agosto?: number;
  setembro?: number;
  outubro?: number;
  novembro?: number;
  dezembro?: number;
  ano: number;
  
  [key: string]: string | number | boolean | undefined; 
}