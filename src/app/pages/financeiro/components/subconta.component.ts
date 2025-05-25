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
import { SubcontaService } from '../services/subconta.service';
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
    templateUrl : './subconta.component.html',
    providers: [MessageService, SubcontaService, ConfirmationService]
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

    tipoTravado : boolean = false;

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private subcontaService: SubcontaService,
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
        this.subconta = {ativo:true, tipo:'ENTRADA'};
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

    aoSelecionar(event: any) {
        if (event.value.recebimentoVendas) {
            this.subconta.tipo = 'ENTRADA';
            this.tipoTravado = true;
        } else {
            this.tipoTravado = false; 
        }
    }



}
