import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modalidade } from '../models/modalidade.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ModalidadeService extends BaseService<Modalidade,Modalidade>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/modalidade');
    }
}
