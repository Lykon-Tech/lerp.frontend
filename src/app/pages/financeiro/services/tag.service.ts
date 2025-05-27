import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TagModel } from '../models/tag.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TagService {

    private baseUrl = 'http://localhost:8080/financeiro/tag';

    constructor(private http: HttpClient) {}

    gettags(ativo?: boolean): Promise<TagModel[]> {
            let params = new HttpParams();
            
            if (ativo !== undefined) {
                params = params.set('ativo', ativo.toString());
            }

            return firstValueFrom(
                this.http.get<TagModel[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
            ).then(tags => tags ?? [])
            .catch(error => Promise.reject(this.extractErrorMessage(error)));
        }

    gettag(id: string): Promise<TagModel> {
        return firstValueFrom(
            this.http.get<TagModel>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }

    findByName(nome: string): Promise<TagModel> {
        return firstValueFrom(
            this.http.get<TagModel>(`${this.baseUrl}/find_by_name`, {
                params: { nome }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }

    createtag(tag: TagModel): Promise<TagModel> {
        return firstValueFrom(this.http.post<TagModel>(this.baseUrl, tag))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updatetag(tag: TagModel): Promise<TagModel> {
        return firstValueFrom(this.http.put<TagModel>(`${this.baseUrl}/${tag.id}`, tag))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deletetag(id: string): Promise<string> {
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
