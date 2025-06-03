import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Movimento } from '../models/movimento.model';
import { BaseService } from '../../bases/services/base.service';
import { firstValueFrom } from 'rxjs';
import { MovimentoSaida } from '../models/movimento.saida.model';
import { FiltroMovimento } from '../models/filtromovimento.model';
import { ReceitasDespesasRelatorios } from '../models/receitasdespesasrelatorios.model';

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}


@Injectable({
  providedIn: 'root'
})

export class MovimentoService extends BaseService<Movimento, MovimentoSaida>{
   
    constructor(http: HttpClient) {
        super(http, 'financeiro/movimento');
    }

    getMovimentos(page: number, size: number, ativo?: boolean): Promise<Page<Movimento>> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size);

        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<Page<Movimento>>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    
    createmovimentos(movimentos :MovimentoSaida[]){
        return firstValueFrom(this.http.post<Movimento>(this.baseUrl+"/cadastrar_lista", movimentos))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    
    getMovimentosFiltro(filtroMovimentoDTO: FiltroMovimento): Promise<Movimento[]> {
        return firstValueFrom(
            this.http.post<Movimento[]>(`${this.baseUrl}/find_all_by_filtro`, filtroMovimentoDTO)
        ).catch(error => Promise.reject(this.extractErrorMessage(error)));
    }


    getReceitasDespesas(filtro : FiltroMovimento): Promise<ReceitasDespesasRelatorios> {
        return firstValueFrom(
            this.http.post<ReceitasDespesasRelatorios>(`${this.baseUrl}/receitas_despesas/find_all_by_filtro`, filtro)
        ).catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    findByNumeroDocumento(numeroDocumento : string): Promise<string> {
        return firstValueFrom(
            this.http.post<string>(`${this.baseUrl}/find_id_by_numero_documento`, numeroDocumento)
        ).catch(error => Promise.reject(this.extractErrorMessage(error)));
    }
    
}
