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
import { TipoCurso } from '../models/tipocurso.model';
import { TipoCursoService } from '../services/tipocurso.service';
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
    templateUrl: `./tipocurso.component.html`,
    providers: [MessageService, TipoCursoService, ConfirmationService]
})
export class TipoCursos implements OnInit {
    tipoCursoDialog: boolean = false;

    tipoCursos = signal<TipoCurso[]>([]);

    exportColumns!: ExportColumn[];

    tipoCurso!: TipoCurso;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private tipoCursoService: TipoCursoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.tipoCursoService.getTipoCursos().then((data) => {
            this.tipoCursos.set(data);
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
        this.tipoCurso = {ativo:true};
        this.submitted = false;
        this.tipoCursoDialog = true;
    }

    edittipoCurso(tipoCurso: TipoCurso) {
        this.tipoCurso = { ...tipoCurso };
        this.tipoCursoDialog = true;
    }

    hideDialog() {
        this.tipoCursoDialog = false;
        this.submitted = false;
    }

    async deletetipoCurso(tipoCurso: TipoCurso) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + tipoCurso.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (tipoCurso.id != null) {
                    try {
                        await this.tipoCursoService.deleteTipoCurso(tipoCurso.id);

                        const novaLista = this.tipoCursos().filter(b => b.id !== tipoCurso.id);
                        this.tipoCursos.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Tipo de curso deletado',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar o tipo de curso: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.tipoCursos().length; i++) {
            if (this.tipoCursos()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async savetipoCurso() {
        this.submitted = true;
        let _tipoCursos = this.tipoCursos();

        if (this.tipoCurso.nome?.trim() && this.tipoCurso.ativo != undefined) {
            try {
            if (this.tipoCurso.id) {
                const updatedtipoCurso = await this.tipoCursoService.updateTipoCurso(this.tipoCurso);
                const index = this.findIndexById(updatedtipoCurso.id!);
                const updatedtipoCursos = [..._tipoCursos];
                updatedtipoCursos[index] = updatedtipoCurso;
                this.tipoCursos.set(updatedtipoCursos);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Tipo de curso atualizado',
                life: 3000
                });
            } else {
                const createdtipoCurso = await this.tipoCursoService.createTipoCurso(this.tipoCurso);
                this.tipoCursos.set([..._tipoCursos, createdtipoCurso]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Tipo de curso criado',
                life: 3000
                });
            }

            this.tipoCursoDialog = false;
            this.tipoCurso = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar tipo de curso: ' + error,
                    life: 3000
                });
            }
        }
    }

}
