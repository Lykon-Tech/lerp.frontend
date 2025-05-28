import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../bases/services/base.service';
import { Funcionario } from '../models/funcionario.model';
import { FuncionarioSaida } from '../models/funcionario.saida.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService extends BaseService<Funcionario,FuncionarioSaida>{
   
    constructor(http: HttpClient) {
        super(http, 'usuario/funcionario');
    }

    findCoordenadores(): Promise<Funcionario[]> {
        return firstValueFrom(
            this.http.get<Funcionario[]>(`${this.baseUrl}/coordenador`)
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }
    
}
