import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Turma } from '../models/turma.model';
import { BaseService } from '../../bases/services/base.service';
import { TransfAluno } from '../models/transfaluno.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurmaService extends BaseService<Turma,Turma>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/turma');
    }

    findAllbyCurso(cursoId : string): Promise<Turma[]> {
        let params = new HttpParams();
        params = params.set('cursoId', cursoId);
        return firstValueFrom(
            this.http.get<Turma[]>(`${this.baseUrl}/find_all_by_curso`, { params })
        ).then(e => e ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
    }
}
