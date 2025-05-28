import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Curso } from '../models/curso.model';
import { BaseService } from '../../bases/services/base.service';
import { CursoSaida } from '../models/curso.saida.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService extends BaseService<Curso,CursoSaida>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/curso');
    }
}
