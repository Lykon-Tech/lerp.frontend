import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoCurso } from '../models/tipocurso.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class TipoCursoService extends BaseService<TipoCurso,TipoCurso>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/tipo_curso');
    }
}
