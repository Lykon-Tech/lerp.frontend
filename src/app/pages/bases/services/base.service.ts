import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export abstract class BaseService<E, S>{


    protected baseUrl : string;

    constructor(protected http: HttpClient, path : string) {
        this.baseUrl = 'http://localhost:8080/' + path;;
    }

    findAll(ativo?: boolean): Promise<E[]> {
        let params = new HttpParams();
        
        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<E[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).then(e => e ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    findById(id: string): Promise<E> {
        return firstValueFrom(
            this.http.get<E>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }


    create(S : S): Promise<E> {
        return firstValueFrom(this.http.post<E>(this.baseUrl, S))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    update(S : S, id : string): Promise<E> {
        return firstValueFrom(this.http.put<E>(`${this.baseUrl}/${id}`, S))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    delete(id: string): Promise<string> {
        return firstValueFrom(
            this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }


    protected extractErrorMessage(error: any): string {
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