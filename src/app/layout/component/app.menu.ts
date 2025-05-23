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
            {
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
            },
            {
                label: 'Financeiro',
                items: [
                    { label: 'Movimentação Financeira', icon: 'pi pi-dollar', routerLink: ['/pages/movimentos'] },
                    { label: 'Bancos', icon: 'pi pi-wallet', routerLink: ['/pages/bancos'] },
                    { label: 'Contas', icon: 'pi pi-credit-card', routerLink: ['/pages/contas'] },
                    { label: 'Subcontas', icon: 'pi pi-credit-card', routerLink: ['/pages/subcontas'] },
                    { label: 'Grupo de Contas', icon: 'pi pi-th-large', routerLink: ['/pages/grupos_contas'] },
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
            },
            {
                label: 'UI Components',
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    }
                ]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/primefaces/sakai-ng',
                        target: '_blank'
                    }
                ]
            }
        ];
    }
}
