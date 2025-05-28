import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SituacaoContrato } from '../models/situacaocontrato.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class SituacaoContratoService extends BaseService<SituacaoContrato,SituacaoContrato>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/situacao_contrato');
    }
}
