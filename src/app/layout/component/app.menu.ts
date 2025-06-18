import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../pages/auth/services/auth.service';
import { Cargo } from '../../pages/funcionarios/models/cargo.model';

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
    cargo! : Cargo;

    constructor(private authService: AuthService){}
    ngOnInit() {
        const modulo = this.authService.getModulo();

        if(modulo == null || this.authService.getCargo() == null){
            this.authService.logout();
            return;
        }

        this.cargo = this.authService.getCargo() ?? {permissao:"", professor:false, atendente: false, coordenador:false};

        if (['GESTOR', 'FINANCEIRO', 'SUPERVISOR'].includes(this.cargo.permissao)) {
            this.model = [           
                {
                    label: 'Home',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/'] }
                    ]
                }
            ];
        }
        if(modulo==='EDUCACIONAL' && ['GESTOR','SUPERVISOR', 'VENDEDOR'].includes(this.cargo.permissao)){
            this.model.push( {
                label: 'Educacional',
                items: [
                    { label: 'Alunos', icon: 'pi pi-users', routerLink: ['/pages/alunos'] },
                    {
                        label: 'Turmas',
                        items: [
                            { label: 'Turmas', icon: 'pi pi-users', routerLink: ['/pages/turmas'] },
                            { label: 'Transferência entre turmas', icon: 'pi pi-refresh', routerLink: ['/pages/transferencia_alunos'] },
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
            });
        }

       if (['GESTOR', 'FINANCEIRO', 'OPERADOR FINANCEIRO', 'SUPERVISOR'].includes(this.cargo.permissao)) {
            const financeiroBaseItems: MenuItem[] = [];
            if (this.cargo.permissao === 'OPERADOR FINANCEIRO') {
                financeiroBaseItems.push(
                { label: 'Movimentação Financeira', icon: 'pi pi-dollar', routerLink: ['/pages/movimentos'] }
                );
            } else {
                financeiroBaseItems.push(
                { label: 'Movimentação Financeira', icon: 'pi pi-dollar', routerLink: ['/pages/movimentos'] },
                { label: 'Fluxo de caixa', icon: 'pi pi-chart-line', routerLink: ['/pages/fluxo_caixa'] },
                { label: 'DRE', icon: 'pi pi-sliders-h', routerLink: ['/pages/dre'] },
                { label: 'Bancos', icon: 'pi pi-wallet', routerLink: ['/pages/bancos'] },
                { label: 'Conta bancária', icon: 'pi pi-credit-card', routerLink: ['/pages/contas'] },
                { label: 'Grupo de Contas', icon: 'pi pi-th-large', routerLink: ['/pages/grupos_contas'] },
                { label: 'Subcontas', icon: 'pi pi-credit-card', routerLink: ['/pages/subcontas'] },
                { label: 'Tipos de Documentos', icon: 'pi pi-file', routerLink: ['/pages/tipos_documentos'] }
                );
            }

            if(modulo == 'EDUCACIONAL'){
                financeiroBaseItems.push( { label: 'Bolsas', icon: 'pi pi-percentage', routerLink: ['/pages/bolsas'] });
            }

            this.model.push({
                label: 'Financeiro',
                items: financeiroBaseItems
            });
        }

        if(this.cargo.permissao === 'GESTOR'){
            this.model.push(
                {
                    label: 'Usuários',
                    items: [
                        { label: 'Funcionários', icon: 'pi pi-id-card', routerLink: ['/pages/funcionarios'] },
                        { label: 'Cargos', icon: 'pi pi-sitemap', routerLink: ['/pages/cargos'] }
                    ]
                }
            );
        }

    }


}
