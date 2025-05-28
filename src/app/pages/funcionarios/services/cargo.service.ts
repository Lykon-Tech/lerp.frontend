import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cargo } from '../models/cargo.model';
import { BaseService } from '../../bases/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class CargoService extends BaseService<Cargo,Cargo>{
   
    constructor(http: HttpClient) {
        super(http, 'usuario/cargo');
    }
}
