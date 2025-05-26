import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Disciplina } from '../models/disciplina.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {

    private baseUrl = 'http://52.91.21.188:8080/curso/disciplina';

    constructor(private http: HttpClient) {}

    getdisciplinas(ativo?: boolean): Promise<Disciplina[]> {
        let params = new HttpParams();
        
        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<Disciplina[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).then(disciplinas => disciplinas ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    getdisciplina(id: string): Promise<Disciplina> {
        return firstValueFrom(
            this.http.get<Disciplina>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }


    createdisciplina(disciplina: Disciplina): Promise<Disciplina> {
        return firstValueFrom(this.http.post<Disciplina>(this.baseUrl, disciplina))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updatedisciplina(disciplina: Disciplina): Promise<Disciplina> {
        return firstValueFrom(this.http.put<Disciplina>(`${this.baseUrl}/${disciplina.id}`, disciplina))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deletedisciplina(id: string): Promise<string> {
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
