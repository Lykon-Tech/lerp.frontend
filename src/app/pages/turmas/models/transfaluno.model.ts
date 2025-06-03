import { AlunoResumido } from "../../funcionarios/models/aluno.resumido.model";

export interface TransfAluno{

    nome? : string;
    turmaId? : string;
    alunos : AlunoResumido[];
}