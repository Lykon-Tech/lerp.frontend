import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoDocumento } from '../models/tipodocumento.model';
import { BaseService } from '../../bases/services/base.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService extends BaseService<TipoDocumento,TipoDocumento>{
   
    constructor(http: HttpClient) {
        super(http, 'financeiro/tipo_documento');
    }

    findOfx(): Promise<TipoDocumento> {
        return firstValueFrom(
            this.http.get<TipoDocumento>(`${this.baseUrl}/find_ofx`)
        ).catch(error => {
            return Promise.reject(this.extractErrorMessage(error));
        });
    }
}
