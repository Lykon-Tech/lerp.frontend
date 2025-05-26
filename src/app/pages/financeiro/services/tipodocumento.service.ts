import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoDocumento } from '../models/tipodocumento.model';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

    private baseUrl = 'https://api.lykon.com.br/financeiro/tipo_documento';

    constructor(private http: HttpClient) {}

    getTipoDocumentos(ativo?: boolean): Promise<TipoDocumento[]> {
        let params = new HttpParams();
        
        if (ativo !== undefined) {
            params = params.set('ativo', ativo.toString());
        }

        return firstValueFrom(
            this.http.get<TipoDocumento[]>(`${this.baseUrl}/find_all_by_empresa`, { params })
        ).then(tipoDocumentos => tipoDocumentos ?? [])
        .catch(error => Promise.reject(this.extractErrorMessage(error)));
    }

    getTipoDocumento(id: string): Promise<TipoDocumento> {
        return firstValueFrom(
            this.http.get<TipoDocumento>(`${this.baseUrl}/find_by_id`, {
                params: { id }
            })
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }

    findOfx(): Promise<TipoDocumento> {
        return firstValueFrom(
            this.http.get<TipoDocumento>(`${this.baseUrl}/find_ofx`)
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }


    createTipoDocumento(tipoDocumento: TipoDocumento): Promise<TipoDocumento> {
        return firstValueFrom(this.http.post<TipoDocumento>(this.baseUrl, tipoDocumento))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    updateTipoDocumento(tipoDocumento: TipoDocumento): Promise<TipoDocumento> {
        return firstValueFrom(this.http.put<TipoDocumento>(`${this.baseUrl}/${tipoDocumento.id}`, tipoDocumento))
            .catch(error => {
                return Promise.reject(this.extractErrorMessage(error));
            });
    }

    deleteTipoDocumento(id: string): Promise<string> {
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
