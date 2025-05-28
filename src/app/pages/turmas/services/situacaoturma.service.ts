import { SituacaoTurma } from '../models/situacaoturma.model';
import { BaseService } from '../../bases/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class SituacaoTurmaService extends BaseService<SituacaoTurma,SituacaoTurma>{

    constructor(http: HttpClient) {
        super(http, 'curso/situacao_turma');
    }

}
