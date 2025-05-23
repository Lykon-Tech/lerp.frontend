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
import { Banco } from '../models/banco.model';
import { BancoService } from '../services/banco.service';
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
            [value]="bancos()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['nome', 'numeroBanco', 'exigeOfx', 'caixa', 'ativo']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando de {first} até {last} de {totalRecords} bancos"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gerenciar Bancos</h5>
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
                    <th pSortableColumn="numeroBanco" style="min-width:10rem">
                        Número
                        <p-sortIcon field="numeroBanco" />
                    </th>
                    <th pSortableColumn="exigeOfx" style="min-width: 12rem">
                        Exige OFX
                        <p-sortIcon field="exigeOfx" />
                    </th>
                    <th pSortableColumn="caixa" style="min-width: 12rem">
                        Caixa
                        <p-sortIcon field="caixa" />
                    </th>
                    <th pSortableColumn="ativo" style="min-width: 12rem">
                        Ativo
                        <p-sortIcon field="ativo" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-banco>
                <tr>
                    <td style="min-width: 16rem">{{ banco.nome }}</td>
                    <td>{{ banco.numeroBanco }}</td>
                    <td>
                        <i
                            class="pi"
                            [ngClass]="{
                            'pi-check text-green-600': banco.exigeOfx,
                            'pi-times text-red-600': !banco.exigeOfx
                            }"
                            aria-label="exige OFX">
                        </i>
                    </td>
                    <td>
                        <i
                            class="pi"
                            [ngClass]="{
                            'pi-check text-green-600': banco.caixa,
                            'pi-times text-red-600': !banco.caixa
                            }"
                            aria-label="caixa">
                        </i>
                    </td>
                    <td>
                        <p-tag [value]="banco.ativo ? 'ATIVO' : 'INATIVO' " [severity]="getSeverity(banco.ativo)" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editBanco(banco)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteBanco(banco)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="bancoDialog" [style]="{ width: '450px' }" header="Detalhes do Banco" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Nome</label>
                        <input name="name" type="text" pInputText id="nome" [(ngModel)]="banco.nome" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !banco.nome">Nome é obrigatório.</small>
                    </div>
                    <div>
                        <label for="nr_banco" class="block font-bold mb-3">Número do banco</label>
                        <input name="nr_banco" id="numero_banco" type="number" pInputText [(ngModel)]="banco.numeroBanco" required fluid/>
                        <small class="text-red-500" *ngIf="submitted && (banco.numeroBanco == null)">Número é obrigatório.</small>
                    </div>

                    <div>
                        <label for="status" class="block font-bold mb-3">Status</label>
                        <p-select 
                            name="status" 
                            [(ngModel)]="banco.ativo" 
                            inputId="ativo" 
                            [options]="statuses" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Selecione um status" 
                            fluid 
                        />
                        <small class="text-red-500" *ngIf="submitted && banco.ativo == undefined">Status é obrigatório.</small>
                    </div>

                    <div>
                        <span class="block font-bold mb-4">Opções</span>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-checkbox id="exige_ofx" name="exige_ofx" binary="true" [(ngModel)]="banco.exigeOfx"></p-checkbox>
                                <label for="exige_ofx">Exige OFX</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-checkbox id="caixa" name="caixa" binary="true" [(ngModel)]="banco.caixa"></p-checkbox>
                                <label for="caixa">Caixa</label>
                            </div>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveBanco()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, BancoService, ConfirmationService]
})
export class Bancos implements OnInit {
    bancoDialog: boolean = false;

    bancos = signal<Banco[]>([]);

    exportColumns!: ExportColumn[];

    banco!: Banco;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private bancoService: BancoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.bancoService.getBancos().then((data) => {
            this.bancos.set(data);
        });

        this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
        ];

        this.cols = [
            { field: 'nome', header: 'Nome', customExportHeader: 'Nome' },
            { field: 'numero_banco', header: 'Número' },
            { field: 'exige_ofx', header: 'Exige OFX' },
            { field: 'caixa', header: 'Caixa' },
            { field: 'ativo', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.banco = {};
        this.submitted = false;
        this.bancoDialog = true;
    }

    editBanco(banco: Banco) {
        this.banco = { ...banco };
        this.bancoDialog = true;
    }

    hideDialog() {
        this.bancoDialog = false;
        this.submitted = false;
    }

    async deleteBanco(banco: Banco) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + banco.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (banco.id != null) {
                    try {
                        await this.bancoService.deleteBanco(banco.id);

                        const novaLista = this.bancos().filter(b => b.id !== banco.id);
                        this.bancos.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Banco deletado',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar o banco: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.bancos().length; i++) {
            if (this.bancos()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async saveBanco() {
        this.submitted = true;
        let _bancos = this.bancos();

        if (this.banco.nome?.trim() && this.banco.numeroBanco != 0 && this.banco.numeroBanco != null && this.banco.ativo != undefined) {
            try {
            if (this.banco.id) {
                const updatedBanco = await this.bancoService.updateBanco(this.banco);
                const index = this.findIndexById(updatedBanco.id!);
                const updatedBancos = [..._bancos];
                updatedBancos[index] = updatedBanco;
                this.bancos.set(updatedBancos);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Banco atualizado',
                life: 3000
                });
            } else {
                const createdBanco = await this.bancoService.createBanco(this.banco);
                this.bancos.set([..._bancos, createdBanco]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Banco criado',
                life: 3000
                });
            }

            this.bancoDialog = false;
            this.banco = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar banco: ' + error,
                    life: 3000
                });
            }
        }
    }

}
