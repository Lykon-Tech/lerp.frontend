import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movimento } from '../models/movimento.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { MovimentoSaida } from '../models/movimento.saida.model';
import { FiltroMovimento } from '../models/filtromovimento.model';
import { ReceitaDespesa } from '../models/receitadespesas.model';
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


export class MovimentoService {
    

    private baseUrl = 'http://localhost:8080/financeiro/movimento';

    constructor(private http: HttpClient) {}

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

    getMovimentosFiltro(filtro : FiltroMovimento): Promise<Movimento[]> {
        return firstValueFrom(
           this.http.post<Movimento[]>(`${this.baseUrl}/find_all_by_filtro`, filtro)
        ).catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    getReceitasDespesas(filtro : FiltroMovimento): Promise<ReceitasDespesasRelatorios> {
        return firstValueFrom(
           this.http.post<ReceitasDespesasRelatorios>(`${this.baseUrl}/receitas_despesas/find_all_by_filtro`, filtro)
        ).catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    getMovimento(id: string): Promise<Movimento> {
        return firstValueFrom(
            this.http.get<Movimento>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }

    createmovimentos(movimentos :MovimentoSaida[]){
        return firstValueFrom(this.http.post<Movimento>(this.baseUrl+"/cadastrar_lista", movimentos))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }


    createMovimento(movimento: MovimentoSaida): Promise<Movimento> {
        return firstValueFrom(this.http.post<Movimento>(this.baseUrl, movimento))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updateMovimento(movimento: MovimentoSaida): Promise<Movimento> {
        return firstValueFrom(this.http.put<Movimento>(`${this.baseUrl}/${movimento.id}`, movimento))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deleteMovimento(id: string): Promise<string> {
        return firstValueFrom(
            this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }


    private extractErrorMessage(error: any): string {
        if (typeof error === 'string') {
            return error;
        }

        if (error?.error && typeof error.error === 'object' && error.error.message) {
            return error.error.message;
        }

        if (error?.error && typeof error.error === 'string') {
            return error.error;
        }

        return 'Erro inesperado na comunicação com o servidor.';
    }
}
