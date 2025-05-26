import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatrizCurricular } from '../models/matrizcurricular.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MatrizCurricularService {

    private baseUrl = 'https://52.91.21.188:8080/curso/matriz_curricular';

    constructor(private http: HttpClient) {}

    getMatrizCurriculars(ativo?: boolean): Promise<MatrizCurricular[]> {
        let params = new HttpParams();
        
        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<MatrizCurricular[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).then(matrizCurriculars => matrizCurriculars ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    getMatrizCurricular(id: string): Promise<MatrizCurricular> {
        return firstValueFrom(
            this.http.get<MatrizCurricular>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }


    createMatrizCurricular(matrizCurricular: MatrizCurricular): Promise<MatrizCurricular> {
        return firstValueFrom(this.http.post<MatrizCurricular>(this.baseUrl, matrizCurricular))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updateMatrizCurricular(matrizCurricular: MatrizCurricular): Promise<MatrizCurricular> {
        return firstValueFrom(this.http.put<MatrizCurricular>(`${this.baseUrl}/${matrizCurricular.id}`, matrizCurricular))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deleteMatrizCurricular(id: string): Promise<string> {
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
