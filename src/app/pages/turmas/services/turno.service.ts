import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Turno } from '../models/turno.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService extends BaseService<Turno,Turno>{
   
    constructor(http: HttpClient) {
        super(http, 'curso/turno');
    }
}
