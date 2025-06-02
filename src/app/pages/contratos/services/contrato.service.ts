import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contrato } from '../models/contrato.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ContratoService extends BaseService<Contrato,Contrato>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/contrato');
    }
}
