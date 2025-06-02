import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Turma } from '../models/turma.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class TurmaService extends BaseService<Turma,Turma>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/turma');
    }
}
