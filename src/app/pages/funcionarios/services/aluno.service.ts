import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from '../../bases/services/base.service';
import { Aluno } from '../models/aluno.model';
import { TransfAluno } from '../../turmas/models/transfaluno.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlunoService extends BaseService<Aluno, Aluno>{
   
  constructor(http: HttpClient) {
      super(http, 'usuario/aluno');
  }

  findByTurma(turmaId : string): Promise<TransfAluno> {
    let params = new HttpParams();
    params = params.set('turmaId', turmaId);
    return firstValueFrom(
        this.http.get<TransfAluno>(`${this.baseUrl}/find_by_turma`, { params })
    ).then(e => e ?? [])
    .catch(error => Promise.reject(this.extractErrorMessage(error)));
  }
  
  
  updateTurmaAlunos(transferencias : TransfAluno[]) : Promise<TransfAluno[]>{
    return firstValueFrom(this.http.put<TransfAluno[]>(`${this.baseUrl+"/transferencia"}`,transferencias))
      .catch(error => {
          return Promise.reject(this.extractErrorMessage(error));
      });
  }
    
}
