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


    findSubcontaPadrao(entrada : boolean): Promise<Subconta> {
        return firstValueFrom(
            this.http.get<Subconta>(`${this.baseUrl}/find_by_padrao`, {
                params: {entrada}
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }

    findByTagName(tagNome : string): Promise<Subconta> {
        return firstValueFrom(
            this.http.get<Subconta>(`${this.baseUrl}/find_by_tag_name`, {
                params: {tagNome}
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }

    
    findAllByTagName(tagNomes : string[]): Promise<Subconta[]> {
        return firstValueFrom(
            this.http.post<Subconta[]>(`${this.baseUrl}/find_all_by_tag_name`, tagNomes)
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }

}
