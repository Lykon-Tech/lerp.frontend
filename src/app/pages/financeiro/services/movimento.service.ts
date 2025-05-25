import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movimento } from '../models/movimento.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { MovimentoSaida } from '../models/movimento.saida.model';

@Injectable({
  providedIn: 'root'
})
export class MovimentoService {

    private baseUrl = 'http://localhost:8080/financeiro/movimento';

    constructor(private http: HttpClient) {}

    getMovimentos(ativo?: boolean): Promise<Movimento[]> {
        let params = new HttpParams();
        
        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<Movimento[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).then(movimentos => movimentos ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
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
