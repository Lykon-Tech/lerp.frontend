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
import { ContaSaida } from '../models/conta.saida.model';
import { Conta } from '../models/conta.model';
import { ContaService } from '../services/conta.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Banco } from '../models/banco.model';
import { BancoService } from '../services/banco.service';

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
    templateUrl: './conta.component.html',
    providers: [MessageService, ContaService, ConfirmationService]
})
export class Contas implements OnInit {
    contaDialog: boolean = false;

    contas = signal<Conta[]>([]);

    bancos = signal<Banco[]>([]);

    exportColumns!: ExportColumn[];

    conta!: Conta;

    submitted: boolean = false;

    statuses!: any[];

    bancos_select!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    constructor(
        private contaService: ContaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private bancoService : BancoService
        
    ) {}

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.contaService.getContas().then((data) => {
            this.contas.set(data);
        });

        this.bancoService.getBancos(true).then((data)=>{
            this.bancos.set(data);
            this.bancos_select = this.bancos().map(banco => ({
                label: banco.nome,
                value: banco
            }));
        });

        this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
            
        ];

        this.cols = [
            { field: 'banco', header: 'Banco', customExportHeader: 'Banco' },
            { field: 'agencia', header: 'Agência' },
            { field: 'numero_conta', header: 'Número da conta' },
            { field: 'ativo', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.conta = {ativo:true};
        this.submitted = false;
        this.contaDialog = true;
    }

    editConta(conta: Conta) {
        this.conta = {
            id: conta.id,
            banco: this.bancos().find(b => b.id === conta.banco?.id),
            agencia: conta.agencia,
            numeroConta: conta.numeroConta,
            ativo: conta.ativo
        };
        this.contaDialog = true;
    }

    hideDialog() {
        this.contaDialog = false;
        this.submitted = false;
    }

    async deleteConta(conta: Conta) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar a conta de agência: ' + conta.agencia + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (conta.id != null) {
                    try {
                        await this.contaService.deleteConta(conta.id);

                        const novaLista = this.contas().filter(b => b.id !== conta.id);
                        this.contas.set([...novaLista]);
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
                            detail: 'Falha ao deletar a conta: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.contas().length; i++) {
            if (this.contas()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async saveConta() {
        this.submitted = true;
        let _bancos = this.contas();

        if (this.conta.agencia != 0 && this.conta.numeroConta != 0 && this.conta.banco != undefined && this.conta.ativo != undefined) {
            try {
            if (this.conta.id) {
                const updatedBanco = await this.contaService.updateConta(this.converterContaParaContaSaida(this.conta));
                const index = this.findIndexById(updatedBanco.id!);
                const updatedBancos = [..._bancos];
                updatedBancos[index] = updatedBanco;
                this.contas.set(updatedBancos);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta atualizada',
                life: 3000
                });
            } else {
                const createdBanco = await this.contaService.createConta(this.converterContaParaContaSaida(this.conta));
                this.contas.set([..._bancos, createdBanco]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Conta criada',
                life: 3000
                });
            }

            this.contaDialog = false;
            this.conta = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar Conta: ' + error,
                    life: 3000
                });
            }
        }
    }

    converterContaParaContaSaida(conta: Conta): ContaSaida {
        return {
            id: conta.id,
            bancoId: conta.banco?.id, 
            ativo: conta.ativo,
            agencia: conta.agencia,
            numeroConta: conta.numeroConta
        };
    }

}
