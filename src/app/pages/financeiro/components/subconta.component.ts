import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SubcontaSaida } from '../models/subconta.saida.model';
import { Subconta } from '../models/subconta.model';
import { subcontaService } from '../services/subconta.service';
import { CheckboxModule } from 'primeng/checkbox';
import { GrupoConta } from '../models/grupoconta.model';
import { GrupoContaService } from '../services/grupoconta.service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        CheckboxModule,
        ConfirmDialogModule
    ],
    template: `
        <p-toast></p-toast>
        <p-toolbar>
            <ng-template #end>
                <p-button label="Novo" icon="pi pi-plus" severity="secondary"(onClick)="openNew()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="subcontas()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['agencia', 'numerosubconta', 'ativo']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando de {first} até {last} de {totalRecords} Subcontas"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gerenciar Subcontas</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Pesquisar..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th pSortableColumn="nome" style="min-width:16rem">
                        Nome
                        <p-sortIcon field="nome" />
                    </th>
                    <th pSortableColumn="grupo_conta" style="min-width:10rem">
                        Grupo de conta
                        <p-sortIcon field="agencia" />
                    </th>
                    <th pSortableColumn="tipo" style="min-width:10rem">
                        Tipo
                        <p-sortIcon field="tipo" />
                    </th>
                    <th pSortableColumn="ativo" style="min-width: 12rem">
                        Ativo
                        <p-sortIcon field="ativo" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-subconta>
                <tr>
                    <td style="min-width: 16rem">{{ subconta.nome}}</td>
                    <td>{{ subconta.grupoConta.nome}}</td>
                    <td>{{ subconta.tipo}}</td>
                    <td>
                        <p-tag [value]="subconta.ativo ? 'ATIVO' : 'INATIVO' " [severity]="getSeverity(subconta.ativo)" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editSubconta(subconta)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deletesubconta(subconta)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="subcontaDialog" [style]="{ width: '450px' }" header="Detalhes da subconta" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Nome</label>
                        <input name="name" type="text" pInputText id="nome" [(ngModel)]="subconta.nome" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !subconta.nome">Nome é obrigatório.</small>
                    </div>
                    <div>
                        <label for="grupo_conta" class="block font-bold mb-3">Grupo de conta</label>
                        <p-select 
                            name="grupo_conta" 
                            [(ngModel)]="subconta.grupoConta" 
                            inputId="grupo_conta" 
                            [options]="grupo_contas_select" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Selecione um grupo de conta"
                            fluid 
                            [appendTo]="'body'"
                        />
                        <small class="text-red-500" *ngIf="submitted && subconta.grupoConta == undefined">Grupo de conta é obrigatório.</small>
                    </div>

                    <div>
                        <span class="block font-bold mb-4">Tipo</span>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="tipo1" name="tipo" value="ENTRADA" [(ngModel)]="subconta.tipo" />
                                <label for="tipo1">Entrada</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="tipo2" name="tipo" value="SAIDA" [(ngModel)]="subconta.tipo" />
                                <label for="tipo2">Saída</label>
                            </div>
                        </div>
                        <small class="text-red-500" *ngIf="submitted && subconta.tipo == undefined">Tipo é obrigatório.</small>
                    </div>

                    <div>
                        <label for="status" class="block font-bold mb-3">Status</label>
                        <p-select 
                            name="status" 
                            [(ngModel)]="subconta.ativo" 
                            inputId="ativo" 
                            [options]="statuses" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Selecione um status" 
                            fluid 
                            [appendTo]="'body'"
                        />
                        <small class="text-red-500" *ngIf="submitted && subconta.ativo == undefined">Status é obrigatório.</small>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="savesubconta()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, subcontaService, ConfirmationService]
})
export class subcontas implements OnInit {
    subcontaDialog: boolean = false;

    subcontas = signal<Subconta[]>([]);

    gruposContas = signal<GrupoConta[]>([]);

    exportColumns!: ExportColumn[];

    subconta!: Subconta;

    submitted: boolean = false;

    statuses!: any[];

    grupo_contas_select!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private subcontaService: subcontaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private grupoContaService : GrupoContaService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.subcontaService.getSubcontas().then((data) => {
            this.subcontas.set(data);
        });

        this.grupoContaService.getGrupoContas(true).then((data)=>{
            this.gruposContas.set(data);
            this.grupo_contas_select = this.gruposContas().map(grupoConta => ({
                label: grupoConta.nome,
                value: grupoConta
            }));
        });

        this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
            
        ];

        this.cols = [
            { field: 'nome', header: 'nome', customExportHeader: 'Nome' },
            { field: 'grupo_conta', header: 'Grupo de conta' },
            { field: 'tipo', header: 'Tipo' },
            { field: 'ativo', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'subcontains');
    }

    openNew() {
        this.subconta = {};
        this.submitted = false;
        this.subcontaDialog = true;
    }

    editSubconta(subconta: Subconta) {
        this.subconta = {
            id: subconta.id,
            nome: subconta.nome,
            grupoConta: this.gruposContas().find(b => b.id === subconta.grupoConta?.id),
            tipo: subconta.tipo,
            ativo: subconta.ativo
        };
        this.subcontaDialog = true;
    }

    hideDialog() {
        this.subcontaDialog = false;
        this.submitted = false;
    }

    async deletesubconta(subconta: Subconta) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar a subconta ' + subconta.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (subconta.id != null) {
                    try {
                        await this.subcontaService.deleteSubconta(subconta.id);

                        const novaLista = this.subcontas().filter(b => b.id !== subconta.id);
                        this.subcontas.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Subconta deletada',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar a subconta: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.subcontas().length; i++) {
            if (this.subcontas()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async savesubconta() {
        this.submitted = true;
        let _subcontas = this.subcontas();

        if (this.subconta.nome?.trim() && this.subconta.tipo != undefined && this.subconta.grupoConta != undefined && this.subconta.ativo != undefined) {
            try {
            if (this.subconta.id) {
                const updatedSubconta = await this.subcontaService.updateSubconta(this.convertersubcontaParasubcontaSaida(this.subconta));
                const index = this.findIndexById(updatedSubconta.id!);
                const updatedSubcontas = [..._subcontas];
                updatedSubcontas[index] = updatedSubconta;
                this.subcontas.set(updatedSubcontas);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'subconta atualizada',
                life: 3000
                });
            } else {
                const createdsubconta = await this.subcontaService.createSubconta(this.convertersubcontaParasubcontaSaida(this.subconta));
                this.subcontas.set([..._subcontas, createdsubconta]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'subconta criada',
                life: 3000
                });
            }

            this.subcontaDialog = false;
            this.subconta = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar subconta: ' + error,
                    life: 3000
                });
            }
        }
    }

    convertersubcontaParasubcontaSaida(subconta: Subconta): SubcontaSaida {
        return {
            id: subconta.id,
            nome:subconta.nome,
            grupoContaId: subconta.grupoConta?.id, 
            ativo: subconta.ativo,
            tipo: subconta.tipo
        };
    }

}
