import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoContrato } from '../models/tipocontrato.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class TipoContratoService extends BaseService<TipoContrato,TipoContrato>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/tipo_contrato');
    }
}
