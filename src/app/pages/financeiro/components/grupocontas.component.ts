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
    templateUrl: './grupocontas.component.html',
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
        this.grupoConta = {ativo:true};
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
