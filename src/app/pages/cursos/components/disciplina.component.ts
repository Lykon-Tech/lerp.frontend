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
import { Disciplina } from '../models/disciplina.model';
import { DisciplinaService } from '../services/disciplina.service';
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
    templateUrl: `./disciplina.component.html`,
    providers: [MessageService, DisciplinaService, ConfirmationService]
})
export class Disciplinas implements OnInit {
    disciplinaDialog: boolean = false;

    disciplinas = signal<Disciplina[]>([]);

    exportColumns!: ExportColumn[];

    disciplina!: Disciplina;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private disciplinaService: DisciplinaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.disciplinaService.getdisciplinas().then((data) => {
            this.disciplinas.set(data);
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
        this.disciplina = {ativo:true};
        this.submitted = false;
        this.disciplinaDialog = true;
    }

    editdisciplina(disciplina: Disciplina) {
        this.disciplina = { ...disciplina };
        this.disciplinaDialog = true;
    }

    hideDialog() {
        this.disciplinaDialog = false;
        this.submitted = false;
    }

    async deletedisciplina(disciplina: Disciplina) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + disciplina.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (disciplina.id != null) {
                    try {
                        await this.disciplinaService.deletedisciplina(disciplina.id);

                        const novaLista = this.disciplinas().filter(b => b.id !== disciplina.id);
                        this.disciplinas.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Disciplina deletada',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar a disciplina: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.disciplinas().length; i++) {
            if (this.disciplinas()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async savedisciplina() {
        this.submitted = true;
        let _disciplinas = this.disciplinas();

        if (this.disciplina.nome?.trim() && this.disciplina.ativo != undefined) {
            try {
            if (this.disciplina.id) {
                const updateddisciplina = await this.disciplinaService.updatedisciplina(this.disciplina);
                const index = this.findIndexById(updateddisciplina.id!);
                const updateddisciplinas = [..._disciplinas];
                updateddisciplinas[index] = updateddisciplina;
                this.disciplinas.set(updateddisciplinas);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Disciplina atualizada',
                life: 3000
                });
            } else {
                const createddisciplina = await this.disciplinaService.createdisciplina(this.disciplina);
                this.disciplinas.set([..._disciplinas, createddisciplina]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Disciplina criada',
                life: 3000
                });
            }

            this.disciplinaDialog = false;
            this.disciplina = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar disciplina: ' + error,
                    life: 3000
                });
            }
        }
    }

}
