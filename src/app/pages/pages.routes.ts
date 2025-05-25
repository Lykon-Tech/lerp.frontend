import { Routes } from '@angular/router';
import { Bancos } from './financeiro/components/banco.component';
import { Empty } from './empty/empty';
import { Bolsas } from './financeiro/components/bolsa.component';
import { GrupoContas } from './financeiro/components/grupocontas.component';
import { Contas } from './financeiro/components/conta.component';
import { subcontas } from './financeiro/components/subconta.component';
import { TipoDocumentos } from './financeiro/components/tipodocumento.component';
import { TipoCursos } from './cursos/components/tipocurso.component';
import { Modalidades } from './cursos/components/modalidade.component';
import { Disciplinas } from './cursos/components/disciplina.component';
import { Tags } from './financeiro/components/tag.component';
import { MatrizesCurriculares } from './cursos/components/matrizcurricular.component';
import { Movimentos } from './financeiro/components/movimento.component';

export default [
    { path: 'movimentos', component: Movimentos },
    { path: 'bancos', component: Bancos },
    { path: 'bolsas', component: Bolsas },
    { path: 'grupos_contas', component: GrupoContas },
    { path: 'contas', component: Contas },
    { path: 'subcontas', component: subcontas },
    { path: 'tags', component: Tags },
    { path: 'tipos_documentos', component: TipoDocumentos },
    { path: 'tipos_cursos', component: TipoCursos },
    { path: 'modalidades', component: Modalidades },
    { path: 'disciplinas', component: Disciplinas },
    { path: 'matrizes_curriculares', component: MatrizesCurriculares },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
