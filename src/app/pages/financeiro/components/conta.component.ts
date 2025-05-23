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
import { ContaSaida } from '../models/conta.saida.model';
import { Conta } from '../models/conta.model';
import { ContaService } from '../services/conta.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Banco } from '../models/banco.model';
import { BancoService } from '../services/banco.service';

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
            [value]="contas()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['agencia', 'numeroConta', 'ativo']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando de {first} até {last} de {totalRecords} Contas"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gerenciar Contas</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Pesquisar..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th pSortableColumn="banco" style="min-width:16rem">
                        Banco
                        <p-sortIcon field="banco" />
                    </th>
                    <th pSortableColumn="agencia" style="min-width:10rem">
                        Agência
                        <p-sortIcon field="agencia" />
                    </th>
                    <th pSortableColumn="numero_conta" style="min-width: 12rem">
                        Número da conta
                        <p-sortIcon field="numero_conta" />
                    </th>
                    <th pSortableColumn="ativo" style="min-width: 12rem">
                        Ativo
                        <p-sortIcon field="ativo" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-conta>
                <tr>
                    <td style="min-width: 16rem">{{ conta.banco.nome + " - " + conta.banco.numeroBanco }}</td>
                    <td>{{ conta.agencia}}</td>
                    <td>{{ conta.numeroConta}}</td>
                    <td>
                        <p-tag [value]="conta.ativo ? 'ATIVO' : 'INATIVO' " [severity]="getSeverity(conta.ativo)" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editConta(conta)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteConta(conta)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="contaDialog" [style]="{ width: '450px' }" header="Detalhes da Conta" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="bancos" class="block font-bold mb-3">Banco</label>
                        <p-select 
                            name="bancos" 
                            [(ngModel)]="conta.banco" 
                            inputId="banco" 
                            [options]="bancos_select" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Selecione um banco"
                            fluid 
                            [appendTo]="'body'"
                        />
                        <small class="text-red-500" *ngIf="submitted && conta.banco == undefined">Banco é obrigatório.</small>
                    </div>
                    <div>
                        <label for="agencia" class="block font-bold mb-3">Agência</label>
                        <input name="agencia" id="agencia" type="number" pInputText [(ngModel)]="conta.agencia" required fluid/>
                        <small class="text-red-500" *ngIf="submitted && conta.agencia == undefined">Agência é obrigatória.</small>
                    </div>

                    <div>
                        <label for="numero_conta" class="block font-bold mb-3">Número da conta</label>
                        <input name="numero_conta" id="numero_conta" type="number" pInputText [(ngModel)]="conta.numeroConta" required fluid/>
                        <small class="text-red-500" *ngIf="submitted && conta.numeroConta == undefined">Número da conta é obrigatório.</small>
                    </div>

                    <div>
                        <label for="status" class="block font-bold mb-3">Status</label>
                        <p-select 
                            name="status" 
                            [(ngModel)]="conta.ativo" 
                            inputId="ativo" 
                            [options]="statuses" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Selecione um status" 
                            fluid 
                            [appendTo]="'body'"
                        />
                        <small class="text-red-500" *ngIf="submitted && conta.ativo == undefined">Status é obrigatório.</small>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveConta()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ContaService, ConfirmationService]
})
export class Contas implements OnInit {
    contaDialog: boolean = false;

    contas = signal<Conta[]>([]);

    bancos = signal<Banco[]>([]);

    exportColumns!: ExportColumn[];

    conta!: Conta;

    submitted: boolean = false;

    statuses!: any[];

    bancos_select!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private contaService: ContaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private bancoService : BancoService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.contaService.getContas().then((data) => {
            this.contas.set(data);
        });

        this.bancoService.getBancos(true).then((data)=>{
            this.bancos.set(data);
            this.bancos_select = this.bancos().map(banco => ({
                label: banco.nome,
                value: banco
            }));
        });

        this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
            
        ];

        this.cols = [
            { field: 'banco', header: 'Banco', customExportHeader: 'Banco' },
            { field: 'agencia', header: 'Agência' },
            { field: 'numero_conta', header: 'Número da conta' },
            { field: 'ativo', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.conta = {};
        this.submitted = false;
        this.contaDialog = true;
    }

    editConta(conta: Conta) {
        this.conta = {
            id: conta.id,
            banco: this.bancos().find(b => b.id === conta.banco?.id),
            agencia: conta.agencia,
            numeroConta: conta.numeroConta,
            ativo: conta.ativo
        };
        this.contaDialog = true;
    }

    hideDialog() {
        this.contaDialog = false;
        this.submitted = false;
    }

    async deleteConta(conta: Conta) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar a conta de agência: ' + conta.agencia + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (conta.id != null) {
                    try {
                        await this.contaService.deleteConta(conta.id);

                        const novaLista = this.contas().filter(b => b.id !== conta.id);
                        this.contas.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Conta deletada',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar a conta: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.contas().length; i++) {
            if (this.contas()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async saveConta() {
        this.submitted = true;
        let _bancos = this.contas();

        if (this.conta.agencia != 0 && this.conta.numeroConta != 0 && this.conta.banco != undefined && this.conta.ativo != undefined) {
            try {
            if (this.conta.id) {
                const updatedBanco = await this.contaService.updateConta(this.converterContaParaContaSaida(this.conta));
                const index = this.findIndexById(updatedBanco.id!);
                const updatedBancos = [..._bancos];
                updatedBancos[index] = updatedBanco;
                this.contas.set(updatedBancos);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta atualizada',
                life: 3000
                });
            } else {
                const createdBanco = await this.contaService.createConta(this.converterContaParaContaSaida(this.conta));
                this.contas.set([..._bancos, createdBanco]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Conta criada',
                life: 3000
                });
            }

            this.contaDialog = false;
            this.conta = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar Conta: ' + error,
                    life: 3000
                });
            }
        }
    }

    converterContaParaContaSaida(conta: Conta): ContaSaida {
        return {
            id: conta.id,
            bancoId: conta.banco?.id, 
            ativo: conta.ativo,
            agencia: conta.agencia,
            numeroConta: conta.numeroConta
        };
    }

}
