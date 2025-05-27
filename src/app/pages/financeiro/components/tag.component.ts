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
import { TagSaida } from '../models/tag.saida.model';
import { TagModel } from '../models/tag.model';
import { TagService } from '../services/tag.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Subconta } from '../models/subconta.model';
import { SubcontaService } from '../services/subconta.service';

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
    templateUrl : './tag.component.html',
    providers: [MessageService, TagService, ConfirmationService]
})
export class Tags implements OnInit {
    tagDialog: boolean = false;

    tags = signal<TagModel[]>([]);

    subcontas = signal<Subconta[]>([]);

    exportColumns!: ExportColumn[];

    tag!: TagModel;

    submitted: boolean = false;

    statuses!: any[];

    subcontas_select!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private tagService: TagService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private subcontaService : SubcontaService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.tagService.gettags().then((data) => {
            this.tags.set(data);
        });

        this.subcontaService.getSubcontas(true).then((data)=>{
            this.subcontas.set(data);
            this.subcontas_select = this.subcontas().map(subconta => ({
                label: subconta.nome,
                value: subconta
            }));
        });

        this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
            
        ];

        this.cols = [
            { field: 'nome', header: 'nome', customExportHeader: 'nome' },
            { field: 'subconta', header: 'subconta' },
            { field: 'ativo', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'tagins');
    }

    openNew() {
        this.tag = {ativo:true};
        this.submitted = false;
        this.tagDialog = true;
    }

    edittag(tag: TagModel) {
        this.tag = {
            id: tag.id,
            nome: tag.nome,
            ativo: tag.ativo,
            subconta: this.subcontas().find(b => b.id === tag.subconta?.id)
        };
        this.tagDialog = true;
    }

    hideDialog() {
        this.tagDialog = false;
        this.submitted = false;
    }

    async deletetag(tag: TagModel) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar a tag ' + tag.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (tag.id != null) {
                    try {
                        await this.tagService.deletetag(tag.id);

                        const novaLista = this.tags().filter(b => b.id !== tag.id);
                        this.tags.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Tag deletada',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar a tag: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.tags().length; i++) {
            if (this.tags()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async savetag() {
        this.submitted = true;
        let _subcontas = this.tags();

        if (this.tag.nome?.trim() && this.tag.subconta != undefined && this.tag.ativo != undefined) {
            try {
            if (this.tag.id) {
                const updatedsubconta = await this.tagService.updatetag(this.convertertagParatagSaida(this.tag));
                const index = this.findIndexById(updatedsubconta.id!);
                const updatedsubcontas = [..._subcontas];
                updatedsubcontas[index] = updatedsubconta;
                this.tags.set(updatedsubcontas);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Tag atualizada',
                life: 3000
                });
            } else {
                const createdsubconta = await this.tagService.createtag(this.convertertagParatagSaida(this.tag));
                this.tags.set([..._subcontas, createdsubconta]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Tag criada',
                life: 3000
                });
            }

            this.tagDialog = false;
            this.tag = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar tag: ' + error,
                    life: 3000
                });
            }
        }
    }

    convertertagParatagSaida(tag: TagModel): TagSaida {
        return {
            id: tag.id,
            nome: tag.nome,
            subcontaId: tag.subconta?.id, 
            ativo: tag.ativo,
        };
    }

}
