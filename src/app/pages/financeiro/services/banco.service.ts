import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Banco } from '../models/banco.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

    private baseUrl = 'http://localhost:8080/financeiro/banco';

    constructor(private http: HttpClient) {}

    getBancos(ativo?: boolean): Promise<Banco[]> {
        let params = new HttpParams();
        
        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<Banco[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).then(bancos => bancos ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    getBanco(id: string): Promise<Banco> {
        return firstValueFrom(
            this.http.get<Banco>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }


    createBanco(banco: Banco): Promise<Banco> {
        return firstValueFrom(this.http.post<Banco>(this.baseUrl, banco))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updateBanco(banco: Banco): Promise<Banco> {
        return firstValueFrom(this.http.put<Banco>(`${this.baseUrl}/${banco.id}`, banco))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deleteBanco(id: string): Promise<string> {
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
