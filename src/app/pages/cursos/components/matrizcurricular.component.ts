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
import { MatrizCurricular } from '../models/matrizcurricular.model';
import { MatrizCurricularService } from '../services/matrizcurricular.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Disciplina } from '../models/disciplina.model';
import { DisciplinaService } from '../services/disciplina.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatrizCurricularSaida } from '../models/matrizcurricular.saida.model';

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
        ConfirmDialogModule,
        MultiSelectModule
    ],
    templateUrl: `./matrizcurricular.component.html`,
    providers: [MessageService, MatrizCurricularService, ConfirmationService]
})
export class MatrizesCurriculares implements OnInit {
    matrizCurricularDialog: boolean = false;

    matrizCurriculars = signal<MatrizCurricular[]>([]);

    disciplinas = signal<Disciplina[]>([]);

    exportColumns!: ExportColumn[];

    matrizCurricular!: MatrizCurricular;

    disciplinas_multi_select: any[] = [];

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private matrizCurricularService: MatrizCurricularService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private disciplinaService : DisciplinaService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.matrizCurricularService.getMatrizCurriculars().then((data) => {
            this.matrizCurriculars.set(data);
        });

        this.disciplinaService.getdisciplinas(true).then((data)=>{
            this.disciplinas.set(data);
            this.disciplinas_multi_select = this.disciplinas().map(disciplina => ({
                label: disciplina.nome,
                value: disciplina,
                nome: disciplina.nome
            }));
        });

        this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
        ];

        this.cols = [
            { field: 'nome', header: 'Nome', customExportHeader: 'Nome' },
            { field: 'disciplinas', header: 'Disciplinas' },
            { field: 'ativo', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.matrizCurricular = {ativo:true};
        this.submitted = false;
        this.matrizCurricularDialog = true;
    }

    editmatrizCurricular(matrizCurricular: MatrizCurricular) {
        this.matrizCurricular = { ...matrizCurricular };
        this.matrizCurricularDialog = true;
    }

    hideDialog() {
        this.matrizCurricularDialog = false;
        this.submitted = false;
    }

    async deletematrizCurricular(matrizCurricular: MatrizCurricular) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + matrizCurricular.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (matrizCurricular.id != null) {
                    try {
                        await this.matrizCurricularService.deleteMatrizCurricular(matrizCurricular.id);

                        const novaLista = this.matrizCurriculars().filter(b => b.id !== matrizCurricular.id);
                        this.matrizCurriculars.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Matriz curricular deletada',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar a matriz curricular: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.matrizCurriculars().length; i++) {
            if (this.matrizCurriculars()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async savematrizCurricular() {
        this.submitted = true;
        let _matrizCurriculars = this.matrizCurriculars();

        if (this.matrizCurricular.nome?.trim() && this.matrizCurricular.disciplinas != undefined && this.matrizCurricular.ativo != undefined) {
            try {
            if (this.matrizCurricular.id) {
                const updatedmatrizCurricular = await this.matrizCurricularService.updateMatrizCurricular(this.converterMatrizComObjetosParaIds(this.matrizCurricular));
                const index = this.findIndexById(updatedmatrizCurricular.id!);
                const updatedmatrizCurriculars = [..._matrizCurriculars];
                updatedmatrizCurriculars[index] = updatedmatrizCurricular;
                this.matrizCurriculars.set(updatedmatrizCurriculars);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Matriz curricular atualizada',
                life: 3000
                });
            } else {
                const createdmatrizCurricular = await this.matrizCurricularService.createMatrizCurricular(this.converterMatrizComObjetosParaIds(this.matrizCurricular));
                this.matrizCurriculars.set([..._matrizCurriculars, createdmatrizCurricular]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Matriz curricular criada',
                life: 3000
                });
            }

            this.matrizCurricularDialog = false;
            this.matrizCurricular = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar matriz curricular: ' + error,
                    life: 3000
                });
            }
        }
    }

    converterMatrizComObjetosParaIds(matriz: MatrizCurricular): MatrizCurricularSaida {
        return {
            id: matriz.id,
            nome: matriz.nome,
            ativo: matriz.ativo,
            disciplinasIds: matriz.disciplinas
                ?.map(d => d.id)
                .filter((id): id is string => !!id) ?? []
        };
    }


}
