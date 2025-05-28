import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Banco } from '../models/banco.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class BancoService extends BaseService<Banco,Banco>{
   
    constructor(http: HttpClient) {
        super(http, 'financeiro/banco');
    }
}
