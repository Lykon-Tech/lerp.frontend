import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/'] }
                ]
            },
            /*{
                label: 'Educacional',
                items: [
                    { label: 'Alunos', icon: 'pi pi-users', routerLink: ['/pages/alunos'] },
                    {
                        label: 'Turmas',
                        items: [
                            { label: 'Turmas', icon: 'pi pi-users', routerLink: ['/pages/turmas'] },
                            { label: 'Turnos', icon: 'pi pi-clock', routerLink: ['/pages/turnos'] },
                            { label: 'Situação de turma', icon: 'pi pi-info-circle', routerLink: ['/pages/situacoes_turmas'] },
                        ]
                    },
                    {
                        label: 'Cursos',
                        items: [
                            { label: 'Cursos', icon: 'pi pi-book', routerLink: ['/pages/cursos'] },
                            { label: 'Matrizes curriculares', icon: 'pi pi-th-large', routerLink: ['/pages/matrizes_curriculares'] },
                            { label: 'Disciplinas', icon: 'pi pi-th-large', routerLink: ['/pages/disciplinas'] },
                            { label: 'Modalidades', icon: 'pi pi-sliders-h', routerLink: ['/pages/modalidades'] },
                            { label: 'Tipo de curso', icon: 'pi pi-tags', routerLink: ['/pages/tipos_cursos'] },
                        ]
                    },
                    {
                        label: 'Contratos',
                        items: [
                            { label: 'Contratos', icon: 'pi pi-file', routerLink: ['/pages/contratos'] },
                            { label: 'Situação de contrato', icon: 'pi pi-file-excel', routerLink: ['/pages/situacoes_contratos'] },
                            { label: 'Tipo de contrato', icon: 'pi pi-briefcase', routerLink: ['/pages/tipos_contratos'] }
                        ]
                    },
                    { label: 'Salas', icon: 'pi pi-building', routerLink: ['/pages/salas'] }
                ]
            },*/
            {
                label: 'Financeiro',
                items: [
                    { label: 'Movimentação Financeira', icon: 'pi pi-dollar', routerLink: ['/pages/movimentos'] },
                    { label: 'Bancos', icon: 'pi pi-wallet', routerLink: ['/pages/bancos'] },
                    { label: 'Contas', icon: 'pi pi-credit-card', routerLink: ['/pages/contas'] },
                    { label: 'Subcontas', icon: 'pi pi-credit-card', routerLink: ['/pages/subcontas'] },
                    { label: 'Grupo de Contas', icon: 'pi pi-th-large', routerLink: ['/pages/grupos_contas'] },
                    { label: 'Tags', icon: 'pi pi-percentage', routerLink: ['/pages/tags'] },
                    { label: 'Bolsas', icon: 'pi pi-percentage', routerLink: ['/pages/bolsas'] },
                    { label: 'Tipos de Documentos', icon: 'pi pi-percentage', routerLink: ['/pages/tipos_documentos'] }
                ]
            },
            {
                label: 'Usuários',
                items: [
                    { label: 'Funcionários', icon: 'pi pi-id-card', routerLink: ['/pages/movimentos'] },
                    { label: 'Cargos', icon: 'pi pi-sitemap', routerLink: ['/pages/movimentos'] }
                ]
            }
        ]
    }
}
