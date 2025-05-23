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
import { GrupoConta } from '../models/grupoconta.model';
import { GrupoContaService } from '../services/grupoconta.service';
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
            [value]="grupoContas()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['nome', 'recebimentoVendas', 'ativo']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando de {first} até {last} de {totalRecords} Grupo de Contas"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gerenciar Grupo de Contas</h5>
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
                    <th pSortableColumn="recebimento_vendas" style="min-width: 12rem">
                        Recebimento de vendas
                        <p-sortIcon field="recebimento_vendas" />
                    </th>
                    <th pSortableColumn="ativo" style="min-width: 12rem">
                        Ativo
                        <p-sortIcon field="ativo" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-grupoConta>
                <tr>
                    <td style="min-width: 16rem">{{ grupoConta.nome }}</td>
                    <td>
                        <i
                            class="pi"
                            [ngClass]="{
                            'pi-check text-green-600': grupoConta.recebimentoVendas,
                            'pi-times text-red-600': !grupoConta.recebimentoVendas
                            }"
                            aria-label="aut_sup">
                        </i>
                    </td>
                    <td>
                        <p-tag [value]="grupoConta.ativo ? 'ATIVO' : 'INATIVO' " [severity]="getSeverity(grupoConta.ativo)" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editGrupoConta(grupoConta)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteGrupoConta(grupoConta)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="grupoContaDialog" [style]="{ width: '450px' }" header="Detalhes do Grupo de Conta" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Nome</label>
                        <input name="name" type="text" pInputText id="nome" [(ngModel)]="grupoConta.nome" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !grupoConta.nome">Nome é obrigatório.</small>
                    </div>

                    <div>
                        <label for="status" class="block font-bold mb-3">Status</label>
                        <p-select 
                            name="status" 
                            [(ngModel)]="grupoConta.ativo" 
                            inputId="ativo" 
                            [options]="statuses" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Selecione um status" 
                            fluid 
                            [appendTo]="'body'"
                        />
                         <small class="text-red-500" *ngIf="submitted && grupoConta.ativo">Status é obrigatório.</small>
                    </div>

                    <div>
                        <span class="block font-bold mb-4">Opções</span>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-checkbox id="recebimento_vendas" name="recebimento_vendas" binary="true" [(ngModel)]="grupoConta.recebimentoVendas"></p-checkbox>
                                <label for="recebimento_vendas">Recebimento de vendas</label>
                            </div>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveGrupoConta()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, GrupoContaService, ConfirmationService]
})
export class GrupoContas implements OnInit {
    grupoContaDialog: boolean = false;

    grupoContas = signal<GrupoConta[]>([]);

    exportColumns!: ExportColumn[];

    grupoConta!: GrupoConta;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private grupoContaService: GrupoContaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.grupoContaService.getGrupoContas().then((data) => {
            this.grupoContas.set(data);
        });

            this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
        ];

        this.cols = [
            { field: 'nome', header: 'Nome', customExportHeader: 'Nome' },
            { field: 'recebimento_vendas', header: 'REcebimento de Vendas' },
            { field: 'ativo', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.grupoConta = {};
        this.submitted = false;
        this.grupoContaDialog = true;
    }

    editGrupoConta(GrupoConta: GrupoConta) {
        this.grupoConta = { ...GrupoConta };
        this.grupoContaDialog = true;
    }

    hideDialog() {
        this.grupoContaDialog = false;
        this.submitted = false;
    }

   async deleteGrupoConta(grupoConta: GrupoConta) {
           this.confirmationService.confirm({
               message: 'Você tem certeza que deseja deletar ' + grupoConta.nome + '?',
               header: 'Confirmar',
               icon: 'pi pi-exclamation-triangle',
               accept: async () => {
                   if (grupoConta.id != null) {
                       try {
                           await this.grupoContaService.deleteGrupoConta(grupoConta.id);
   
                           const novaLista = this.grupoContas().filter(b => b.id !== grupoConta.id);
                           this.grupoContas.set([...novaLista]);
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
                               detail: 'Falha ao deletar o grupo de conta: ' + err,
                               life: 3000
                           });
                       }
                   }
               }
           });
       }
   
       findIndexById(id: string): number {
           let index = -1;
           for (let i = 0; i < this.grupoContas().length; i++) {
               if (this.grupoContas()[i].id === id) {
                   index = i;
                   break;
               }
           }
   
           return index;
       }
   
       getSeverity(ativo: boolean) {
           return ativo ? 'success' : 'danger';
       }
   
       async saveGrupoConta() {
           this.submitted = true;
           let _grupos_contas = this.grupoContas();
   
           if (this.grupoConta.nome?.trim() && this.grupoConta.ativo != undefined) {
               try {
               if (this.grupoConta.id) {
                   const updatedGrupoConta = await this.grupoContaService.updateGrupoConta(this.grupoConta);
                   const index = this.findIndexById(updatedGrupoConta.id!);
                   const updatedGruposContas = [..._grupos_contas];
                   updatedGruposContas[index] = updatedGrupoConta;
                   this.grupoContas.set(updatedGruposContas);
   
                   this.messageService.add({
                   severity: 'success',
                   summary: 'Sucesso',
                   detail: 'Grupo de conta atualizado',
                   life: 3000
                   });
               } else {
                   const createdGrupoConta = await this.grupoContaService.createGrupoConta(this.grupoConta);
                   this.grupoContas.set([..._grupos_contas, createdGrupoConta]);
                   
   
                   this.messageService.add({
                       severity: 'success',
                       summary: 'Sucesso',
                       detail: 'Grupo de conta criado',
                   life: 3000
                   });
               }
   
               this.grupoContaDialog = false;
               this.grupoConta = {};
               } catch (error) {
                   this.messageService.add({
                       severity: 'error',
                       summary: 'Erro',
                       detail: 'Falha ao salvar Grupo de conta: ' + error,
                       life: 3000
                   });
               }
           }
       }

}
