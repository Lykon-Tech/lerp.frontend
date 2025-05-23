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
import { Bolsa } from '../models/bolsa.model';
import { BolsaService } from '../services/bolsa.service';
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
            [value]="bolsas()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['nome', 'percentualDesconto', 'necessitaAutSuperior', 'ativo']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando de {first} até {last} de {totalRecords} Bolsas"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gerenciar Bolsas</h5>
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
                    <th pSortableColumn="percentualDesconto" style="min-width:10rem">
                        Percentual de desconto
                        <p-sortIcon field="percentualDesconto" />
                    </th>
                    <th pSortableColumn="necessitaAutSuperior" style="min-width: 12rem">
                        Necessita autorização sup.
                        <p-sortIcon field="necessitaAutSuperior" />
                    </th>
                    <th pSortableColumn="ativo" style="min-width: 12rem">
                        Ativo
                        <p-sortIcon field="ativo" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-bolsa>
                <tr>
                    <td style="min-width: 16rem">{{ bolsa.nome }}</td>
                    <td>{{ bolsa.percentualDesconto + '%'}}</td>
                    <td>
                        <i
                            class="pi"
                            [ngClass]="{
                            'pi-check text-green-600': bolsa.necessitaAutSuperior,
                            'pi-times text-red-600': !bolsa.necessitaAutSuperior
                            }"
                            aria-label="aut_sup">
                        </i>
                    </td>
                    <td>
                        <p-tag [value]="bolsa.ativo ? 'ATIVO' : 'INATIVO' " [severity]="getSeverity(bolsa.ativo)" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editBolsa(bolsa)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteBolsa(bolsa)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="BolsaDialog" [style]="{ width: '450px' }" header="Detalhes do Bolsa" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Nome</label>
                        <input name="name" type="text" pInputText id="nome" [(ngModel)]="bolsa.nome" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !bolsa.nome">Nome é obrigatório.</small>
                    </div>
                    <div>
                        <label for="perc_desconto" class="block font-bold mb-3">Percentual de desconto</label>
                        <input name="perc_desconto" id="perc_desconto" type="number" pInputText [(ngModel)]="bolsa.percentualDesconto" required fluid/>
                        <small class="text-red-500" *ngIf="submitted && !bolsa.percentualDesconto">Percentual de desconto é obrigatório.</small>
                    </div>

                    <div>
                        <label for="status" class="block font-bold mb-3">Status</label>
                        <p-select 
                            name="status" 
                            [(ngModel)]="bolsa.ativo" 
                            inputId="ativo" 
                            [options]="statuses" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Selecione um status" 
                            fluid 
                        />
                        <small class="text-red-500" *ngIf="submitted && bolsa.ativo == undefined">Status é obrigatório.</small>
                    </div>

                    <div>
                        <span class="block font-bold mb-4">Opções</span>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-checkbox id="aut_sup" name="aut_sup" binary="true" [(ngModel)]="bolsa.necessitaAutSuperior"></p-checkbox>
                                <label for="aut_sup">Necessita autorização de superior</label>
                            </div>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveBolsa()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, BolsaService, ConfirmationService]
})
export class Bolsas implements OnInit {
    BolsaDialog: boolean = false;

    bolsas = signal<Bolsa[]>([]);

    exportColumns!: ExportColumn[];

    bolsa!: Bolsa;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private bolsaService: BolsaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.bolsaService.getBolsas().then((data) => {
            this.bolsas.set(data);
        });

        this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
        ];

        this.cols = [
            { field: 'nome', header: 'Nome', customExportHeader: 'Nome' },
            { field: 'perc_desconto', header: '% Desconto' },
            { field: 'aut_sup', header: 'Necessita autorização sup.' },
            { field: 'ativo', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.bolsa = {};
        this.submitted = false;
        this.BolsaDialog = true;
    }

    editBolsa(Bolsa: Bolsa) {
        this.bolsa = { ...Bolsa };
        this.BolsaDialog = true;
    }

    hideDialog() {
        this.BolsaDialog = false;
        this.submitted = false;
    }

    async deleteBolsa(bolsa: Bolsa) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + bolsa.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (bolsa.id != null) {
                    try {
                        await this.bolsaService.deleteBolsa(bolsa.id);

                        const novaLista = this.bolsas().filter(b => b.id !== bolsa.id);
                        this.bolsas.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Bolsa deletado',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar o Bolsa: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.bolsas().length; i++) {
            if (this.bolsas()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async saveBolsa() {
        this.submitted = true;
        let _bolsas = this.bolsas();

        if (this.bolsa.nome?.trim() && this.bolsa.percentualDesconto != 0 && this.bolsa.percentualDesconto != null && this.bolsa.ativo != undefined) {
            try {
            if (this.bolsa.id) {
                const updatedBolsa = await this.bolsaService.updateBolsa(this.bolsa);
                const index = this.findIndexById(updatedBolsa.id!);
                const updatedBolsas = [..._bolsas];
                updatedBolsas[index] = updatedBolsa;
                this.bolsas.set(updatedBolsas);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Bolsa atualizada',
                life: 3000
                });
            } else {
                const createdBolsa = await this.bolsaService.createBolsa(this.bolsa);
                this.bolsas.set([..._bolsas, createdBolsa]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Bolsa criada',
                life: 3000
                });
            }

            this.BolsaDialog = false;
            this.bolsa = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar bolsa: ' + error,
                    life: 3000
                });
            }
        }
    }
    
}
