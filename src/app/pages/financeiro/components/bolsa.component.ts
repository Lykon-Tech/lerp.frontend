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
    templateUrl: `./bolsa.component.html`,
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
        this.bolsa = {ativo:true};
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
