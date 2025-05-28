import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bolsa } from '../models/bolsa.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class BolsaService extends BaseService<Bolsa,Bolsa>{
   
    constructor(http: HttpClient) {
        super(http, 'financeiro/bolsa');
    }
}
