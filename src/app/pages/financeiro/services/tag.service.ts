import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TagModel } from '../models/tag.model';
import { BaseService } from '../../bases/services/base.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService extends BaseService<TagModel,TagModel>{
   
    constructor(http: HttpClient) {
        super(http, 'financeiro/tag');
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
}
