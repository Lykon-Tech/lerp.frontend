import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Bancos } from './financeiro/components/banco.component';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Bolsas } from './financeiro/components/bolsa.component';
import { GrupoContas } from './financeiro/components/grupocontas.component';
import { Contas } from './financeiro/components/conta.component';
import { subcontas } from './financeiro/components/subconta.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'bancos', component: Bancos },
    { path: 'bolsas', component: Bolsas },
    { path: 'grupos_contas', component: GrupoContas },
    { path: 'contas', component: Contas },
    { path: 'subcontas', component: subcontas },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
