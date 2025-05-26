import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subconta } from '../models/subconta.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubcontaService {

    private baseUrl = 'https://52.91.21.188:8080/financeiro/subconta';

    constructor(private http: HttpClient) {}

    getSubcontas(ativo?: boolean): Promise<Subconta[]> {
            let params = new HttpParams();
            
            if (ativo !== undefined) {
                params = params.set('ativo', ativo.toString());
            }

            return firstValueFrom(
                this.http.get<Subconta[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
            ).then(subcontas => subcontas ?? [])
            .catch(error => Promise.reject(this.extractErrorMessage(error)));
        }

    getSubconta(id: string): Promise<Subconta> {
        return firstValueFrom(
            this.http.get<Subconta>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }

    createSubconta(subconta: Subconta): Promise<Subconta> {
        return firstValueFrom(this.http.post<Subconta>(this.baseUrl, subconta))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updateSubconta(subconta: Subconta): Promise<Subconta> {
        return firstValueFrom(this.http.put<Subconta>(`${this.baseUrl}/${subconta.id}`, subconta))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deleteSubconta(id: string): Promise<string> {
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
