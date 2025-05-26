import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoCurso } from '../models/tipocurso.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoCursoService {

    private baseUrl = 'https://api.lykon.com.br/curso/tipo_curso';

    constructor(private http: HttpClient) {}

    getTipoCursos(ativo?: boolean): Promise<TipoCurso[]> {
        let params = new HttpParams();
        
        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<TipoCurso[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).then(tipoCursos => tipoCursos ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    getTipoCurso(id: string): Promise<TipoCurso> {
        return firstValueFrom(
            this.http.get<TipoCurso>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }


    createTipoCurso(tipoCurso: TipoCurso): Promise<TipoCurso> {
        return firstValueFrom(this.http.post<TipoCurso>(this.baseUrl, tipoCurso))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updateTipoCurso(tipoCurso: TipoCurso): Promise<TipoCurso> {
        return firstValueFrom(this.http.put<TipoCurso>(`${this.baseUrl}/${tipoCurso.id}`, tipoCurso))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deleteTipoCurso(id: string): Promise<string> {
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
