import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subconta } from '../models/subconta.model';
import { BaseService } from '../../bases/services/base.service';
import { firstValueFrom } from 'rxjs';
import { SubcontaSaida } from '../models/subconta.saida.model';

@Injectable({
  providedIn: 'root'
})
export class SubcontaService extends BaseService<Subconta,SubcontaSaida>{
   
    constructor(http: HttpClient) {
        super(http, 'financeiro/subconta');
    }

}
