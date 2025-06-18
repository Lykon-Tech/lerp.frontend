import { Cargo } from "../../funcionarios/models/cargo.model";

export interface DadosUsuario{
    token: string;
    nome: string;
    cargo: Cargo;
    modulo: string;
}