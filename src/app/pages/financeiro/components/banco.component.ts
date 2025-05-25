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
import { Banco } from '../models/banco.model';
import { BancoService } from '../services/banco.service';
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
    templateUrl: `./banco.component.html`,
    providers: [MessageService, BancoService, ConfirmationService]
})
export class Bancos implements OnInit {
    bancoDialog: boolean = false;

    bancos = signal<Banco[]>([]);

    exportColumns!: ExportColumn[];

    banco!: Banco;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private bancoService: BancoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.bancoService.getBancos().then((data) => {
            this.bancos.set(data);
        });

        this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
        ];

        this.cols = [
            { field: 'nome', header: 'Nome', customExportHeader: 'Nome' },
            { field: 'numero_banco', header: 'Número' },
            { field: 'exige_ofx', header: 'Exige OFX' },
            { field: 'caixa', header: 'Caixa' },
            { field: 'ativo', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.banco = {ativo:true};
        this.submitted = false;
        this.bancoDialog = true;
    }

    editBanco(banco: Banco) {
        this.banco = { ...banco };
        this.bancoDialog = true;
    }

    hideDialog() {
        this.bancoDialog = false;
        this.submitted = false;
    }

    async deleteBanco(banco: Banco) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + banco.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (banco.id != null) {
                    try {
                        await this.bancoService.deleteBanco(banco.id);

                        const novaLista = this.bancos().filter(b => b.id !== banco.id);
                        this.bancos.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Banco deletado',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar o banco: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.bancos().length; i++) {
            if (this.bancos()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async saveBanco() {
        this.submitted = true;
        let _bancos = this.bancos();

        if (this.banco.nome?.trim() && this.banco.numeroBanco != 0 && this.banco.numeroBanco != null && this.banco.ativo != undefined) {
            try {
            if (this.banco.id) {
                const updatedBanco = await this.bancoService.updateBanco(this.banco);
                const index = this.findIndexById(updatedBanco.id!);
                const updatedBancos = [..._bancos];
                updatedBancos[index] = updatedBanco;
                this.bancos.set(updatedBancos);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Banco atualizado',
                life: 3000
                });
            } else {
                const createdBanco = await this.bancoService.createBanco(this.banco);
                this.bancos.set([..._bancos, createdBanco]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Banco criado',
                life: 3000
                });
            }

            this.bancoDialog = false;
            this.banco = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar banco: ' + error,
                    life: 3000
                });
            }
        }
    }

}
