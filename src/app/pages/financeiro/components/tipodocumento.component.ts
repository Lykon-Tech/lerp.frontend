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
import { TipoDocumento } from '../models/tipodocumento.model';
import { TipoDocumentoService } from '../services/tipodocumento.service';
import { CheckboxModule } from 'primeng/checkbox';

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
            [value]="tipoDocumentos()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['nome', 'ativo']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando de {first} até {last} de {totalRecords} Tipo de documentos"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gerenciar Tipo de Documentos</h5>
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
                    <th pSortableColumn="ativo" style="min-width: 12rem">
                        Ativo
                        <p-sortIcon field="ativo" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-TipoDocumento>
                <tr>
                    <td style="min-width: 16rem">{{ TipoDocumento.nome }}</td>
                    <td>
                        <p-tag [value]="TipoDocumento.ativo ? 'ATIVO' : 'INATIVO' " [severity]="getSeverity(TipoDocumento.ativo)" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editTipoDocumento(TipoDocumento)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteTipoDocumento(TipoDocumento)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="tipoDocumentoDialog" [style]="{ width: '450px' }" header="Detalhes do Tipo de Documento" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Nome</label>
                        <input name="name" type="text" pInputText id="nome" [(ngModel)]="tipoDocumento.nome" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !tipoDocumento.nome">Nome é obrigatório.</small>
                    </div>
                    <div>
                        <label for="status" class="block font-bold mb-3">Status</label>
                        <p-select 
                            name="status" 
                            [(ngModel)]="tipoDocumento.ativo" 
                            inputId="ativo" 
                            [options]="statuses" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Selecione um status" 
                            fluid 
                            [appendTo]="'body'"
                        />
                        <small class="text-red-500" *ngIf="submitted && tipoDocumento.ativo == undefined">Status é obrigatório.</small>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveTipoDocumento()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, TipoDocumentoService, ConfirmationService]
})
export class TipoDocumentos implements OnInit {
    tipoDocumentoDialog: boolean = false;

    tipoDocumentos = signal<TipoDocumento[]>([]);

    exportColumns!: ExportColumn[];

    tipoDocumento!: TipoDocumento;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private tipoDocumentoService: TipoDocumentoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.tipoDocumentoService.getTipoDocumentos().then((data) => {
            this.tipoDocumentos.set(data);
        });

        this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
        ];

        this.cols = [
            { field: 'nome', header: 'Nome', customExportHeader: 'Nome' },
            { field: 'ativo', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.tipoDocumento = {};
        this.submitted = false;
        this.tipoDocumentoDialog = true;
    }

    editTipoDocumento(TipoDocumento: TipoDocumento) {
        this.tipoDocumento = { ...TipoDocumento };
        this.tipoDocumentoDialog = true;
    }

    hideDialog() {
        this.tipoDocumentoDialog = false;
        this.submitted = false;
    }

    async deleteTipoDocumento(tipoDocumento: TipoDocumento) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + tipoDocumento.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (tipoDocumento.id != null) {
                    try {
                        await this.tipoDocumentoService.deleteTipoDocumento(tipoDocumento.id);

                        const novaLista = this.tipoDocumentos().filter(b => b.id !== tipoDocumento.id);
                        this.tipoDocumentos.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Tipo de documento deletado',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar o Tipo de documento: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.tipoDocumentos().length; i++) {
            if (this.tipoDocumentos()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async saveTipoDocumento() {
        this.submitted = true;
        let _TipoDocumentos = this.tipoDocumentos();

        if (this.tipoDocumento.nome?.trim() && this.tipoDocumento.ativo != undefined) {
            try {
            if (this.tipoDocumento.id) {
                const updatedTipoDocumento = await this.tipoDocumentoService.updateTipoDocumento(this.tipoDocumento);
                const index = this.findIndexById(updatedTipoDocumento.id!);
                const updatedTipoDocumentos = [..._TipoDocumentos];
                updatedTipoDocumentos[index] = updatedTipoDocumento;
                this.tipoDocumentos.set(updatedTipoDocumentos);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Tipo de documento atualizado',
                life: 3000
                });
            } else {
                const createdTipoDocumento = await this.tipoDocumentoService.createTipoDocumento(this.tipoDocumento);
                this.tipoDocumentos.set([..._TipoDocumentos, createdTipoDocumento]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Tipo de documento criado',
                life: 3000
                });
            }

            this.tipoDocumentoDialog = false;
            this.tipoDocumento = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar tipo de documento: ' + error,
                    life: 3000
                });
            }
        }
    }

}
