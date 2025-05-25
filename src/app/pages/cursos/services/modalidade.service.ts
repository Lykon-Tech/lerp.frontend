import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modalidade } from '../models/modalidade.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModalidadeService {

    private baseUrl = 'http://localhost:8080/curso/modalidade';

    constructor(private http: HttpClient) {}

    getModalidades(ativo?: boolean): Promise<Modalidade[]> {
        let params = new HttpParams();
        
        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<Modalidade[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).then(modalidades => modalidades ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    getModalidade(id: string): Promise<Modalidade> {
        return firstValueFrom(
            this.http.get<Modalidade>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }


    createModalidade(modalidade: Modalidade): Promise<Modalidade> {
        return firstValueFrom(this.http.post<Modalidade>(this.baseUrl, modalidade))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updateModalidade(modalidade: Modalidade): Promise<Modalidade> {
        return firstValueFrom(this.http.put<Modalidade>(`${this.baseUrl}/${modalidade.id}`, modalidade))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deleteModalidade(id: string): Promise<string> {
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
