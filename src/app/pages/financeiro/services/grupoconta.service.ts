import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GrupoConta } from '../models/grupoconta.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class GrupoContaService extends BaseService<GrupoConta, GrupoConta>{
   
    constructor(http: HttpClient) {
        super(http, 'financeiro/grupo_conta');
    }
}
