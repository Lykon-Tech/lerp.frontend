import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Conta } from '../models/conta.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

    private baseUrl = 'https://52.91.21.188:8080/financeiro/conta';

    constructor(private http: HttpClient) {}

    getContas(ativo?: boolean): Promise<Conta[]> {
        let params = new HttpParams();
        
        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<Conta[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).then(contas => contas ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    getConta(id: string): Promise<Conta> {
        return firstValueFrom(
            this.http.get<Conta>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
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


    createConta(conta: Conta): Promise<Conta> {
        return firstValueFrom(this.http.post<Conta>(this.baseUrl, conta))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updateConta(conta: Conta): Promise<Conta> {
        return firstValueFrom(this.http.put<Conta>(`${this.baseUrl}/${conta.id}`, conta))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deleteConta(id: string): Promise<string> {
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
