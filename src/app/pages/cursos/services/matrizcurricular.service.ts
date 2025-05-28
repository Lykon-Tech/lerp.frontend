import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatrizCurricular } from '../models/matrizcurricular.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class MatrizCurricularService extends BaseService<MatrizCurricular,MatrizCurricular>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/matriz_curricular');
    }
}
