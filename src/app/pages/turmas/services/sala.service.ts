import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sala } from '../models/sala.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class SalaService extends BaseService<Sala,Sala>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/sala');
    }
}
