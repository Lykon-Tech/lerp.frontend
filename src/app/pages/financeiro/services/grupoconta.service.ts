import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GrupoConta } from '../models/grupoconta.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class GrupoContaService {

    private baseUrl = 'http://localhost:8080/financeiro/grupo_conta';

    constructor(private http: HttpClient) {}

    getGrupoContas(ativo?: boolean): Promise<GrupoConta[]> {
            let params = new HttpParams();
            
            if (ativo !== undefined) {
                params = params.set('ativo', ativo.toString());
            }

            return firstValueFrom(
                this.http.get<GrupoConta[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
            ).then(gruposContas => gruposContas ?? [])
            .catch(error => Promise.reject(this.extractErrorMessage(error)));
        }

    getGrupoConta(id: string): Promise<GrupoConta> {
        return firstValueFrom(
            this.http.get<GrupoConta>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }

    createGrupoConta(grupoConta: GrupoConta): Promise<GrupoConta> {
        return firstValueFrom(this.http.post<GrupoConta>(this.baseUrl, grupoConta))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updateGrupoConta(grupoConta: GrupoConta): Promise<GrupoConta> {
        return firstValueFrom(this.http.put<GrupoConta>(`${this.baseUrl}/${grupoConta.id}`, grupoConta))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deleteGrupoConta(id: string): Promise<string> {
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
