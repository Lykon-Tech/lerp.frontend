import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bolsa } from '../models/bolsa.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BolsaService {

    private baseUrl = 'http://localhost:8080/financeiro/bolsa';

    constructor(private http: HttpClient) {}

    getBolsas(ativo?: boolean): Promise<Bolsa[]> {
        let params = new HttpParams();
        
        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<Bolsa[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).then(bolsas => bolsas ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    getBolsa(id: string): Promise<Bolsa> {
        return firstValueFrom(
            this.http.get<Bolsa>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }
    
    createBolsa(bolsa: Bolsa): Promise<Bolsa> {
        return firstValueFrom(this.http.post<Bolsa>(this.baseUrl, bolsa))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updateBolsa(bolsa: Bolsa): Promise<Bolsa> {
        return firstValueFrom(this.http.put<Bolsa>(`${this.baseUrl}/${bolsa.id}`, bolsa))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deleteBolsa(id: string): Promise<string> {
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
