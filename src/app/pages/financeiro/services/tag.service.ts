import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../models/tag.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TagService {

    private baseUrl = 'http://localhost:8080/financeiro/tag';

    constructor(private http: HttpClient) {}

    gettags(ativo?: boolean): Promise<Tag[]> {
            let params = new HttpParams();
            
            if (ativo !== undefined) {
                params = params.set('ativo', ativo.toString());
            }

            return firstValueFrom(
                this.http.get<Tag[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
            ).then(tags => tags ?? [])
            .catch(error => Promise.reject(this.extractErrorMessage(error)));
        }

    gettag(id: string): Promise<Tag> {
        return firstValueFrom(
            this.http.get<Tag>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }

    createtag(tag: Tag): Promise<Tag> {
        return firstValueFrom(this.http.post<Tag>(this.baseUrl, tag))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updatetag(tag: Tag): Promise<Tag> {
        return firstValueFrom(this.http.put<Tag>(`${this.baseUrl}/${tag.id}`, tag))
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
