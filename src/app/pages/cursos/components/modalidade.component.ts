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
import { Modalidade } from '../models/modalidade.model';
import { ModalidadeService } from '../services/modalidade.service';
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
    templateUrl: `./modalidade.component.html`,
    providers: [MessageService, ModalidadeService, ConfirmationService]
})
export class Modalidades implements OnInit {
    modalidadeDialog: boolean = false;

    modalidades = signal<Modalidade[]>([]);

    exportColumns!: ExportColumn[];

    modalidade!: Modalidade;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private modalidadeService: ModalidadeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.modalidadeService.getModalidades().then((data) => {
            this.modalidades.set(data);
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
        this.modalidade = {ativo:true};
        this.submitted = false;
        this.modalidadeDialog = true;
    }

    editModalidade(modalidade: Modalidade) {
        this.modalidade = { ...modalidade };
        this.modalidadeDialog = true;
    }

    hideDialog() {
        this.modalidadeDialog = false;
        this.submitted = false;
    }

    async deleteModalidade(modalidade: Modalidade) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + modalidade.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (modalidade.id != null) {
                    try {
                        await this.modalidadeService.deleteModalidade(modalidade.id);

                        const novaLista = this.modalidades().filter(b => b.id !== modalidade.id);
                        this.modalidades.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Modalidade deletada',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar a Modalidade: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.modalidades().length; i++) {
            if (this.modalidades()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async savemodalidade() {
        this.submitted = true;
        let _modalidades = this.modalidades();

        if (this.modalidade.nome?.trim() && this.modalidade.ativo != undefined) {
            try {
            if (this.modalidade.id) {
                const updatedmodalidade = await this.modalidadeService.updateModalidade(this.modalidade);
                const index = this.findIndexById(updatedmodalidade.id!);
                const updatedmodalidades = [..._modalidades];
                updatedmodalidades[index] = updatedmodalidade;
                this.modalidades.set(updatedmodalidades);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Modalidade atualizada',
                life: 3000
                });
            } else {
                const createdmodalidade = await this.modalidadeService.createModalidade(this.modalidade);
                this.modalidades.set([..._modalidades, createdmodalidade]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Modalidade criada',
                life: 3000
                });
            }

            this.modalidadeDialog = false;
            this.modalidade = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar modalidade: ' + error,
                    life: 3000
                });
            }
        }
    }

}
