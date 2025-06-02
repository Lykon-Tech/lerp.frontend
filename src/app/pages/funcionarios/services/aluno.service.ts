import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../bases/services/base.service';
import { Aluno } from '../models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunoService extends BaseService<Aluno, Aluno>{
   
    constructor(http: HttpClient) {
        super(http, 'usuario/aluno');
    }
    
}
