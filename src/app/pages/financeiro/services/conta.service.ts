import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Conta } from '../models/conta.model';
import { BaseService } from '../../bases/services/base.service';
import { firstValueFrom } from 'rxjs';
import { ContaSaida } from '../models/conta.saida.model';

@Injectable({
  providedIn: 'root'
})
export class ContaService extends BaseService<Conta,ContaSaida>{
   
    constructor(http: HttpClient) {
        super(http, 'financeiro/conta');
    }

    
    findByAgenciaNumeroConta(agencia: string, numeroConta :string): Promise<Conta> {
        return firstValueFrom(
            this.http.get<Conta>(`${this.baseUrl}/find_by_agencia_numero`, {
                params: {agencia, numeroConta }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }
}
