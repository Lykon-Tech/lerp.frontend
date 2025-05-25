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
import { Movimento } from '../models/movimento.model';
import { MovimentoService } from '../services/movimento.service';
import { MovimentoSaida } from '../models/movimento.saida.model';
import { SubcontaService } from '../services/subconta.service';
import { Subconta } from '../models/subconta.model';
import { DatePicker } from 'primeng/datepicker';
import { TipoDocumentoService } from '../services/tipodocumento.service';
import { TipoDocumento } from '../models/tipodocumento.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-movimentos',
    templateUrl: './movimento.component.html',
    standalone: true,
    imports:[
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
        ConfirmDialogModule,
        DatePicker,
        DropdownModule
    ],
    providers: [MessageService,ConfirmationService]

})
export class Movimentos implements OnInit {
    movimentos = signal<Movimento[]>([]);
    movimentoDialog: boolean = false;
    loading: boolean = false;
    exportColumns!: any[];
    cols!: any[];
    movimento! : Movimento;
    submitted: boolean = false;
    subcontas_select!: any[];
    subcontas = signal<Subconta[]>([]);
    tipo_documentos_select!: any[];
    tiposDocumentos = signal<TipoDocumento[]>([]);
    totalRecords : number = 0;
    @ViewChild('dt') dt!: Table;

    constructor(
    private movimentoService: MovimentoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private subcontaService : SubcontaService,
    private tipoDocumentoService : TipoDocumentoService
    ) {}

    ngOnInit() {
    this.loadMovimentos();

    this.cols = [
        { field: 'subconta.nome', header: 'Subconta', customExportHeader: 'Subconta' },
        { field: 'tipoDocumento.nome', header: 'Tipo Documento' },
        { field: 'valor', header: 'Valor' },
        { field: 'dataLancamento', header: 'Data' },
        { field: 'numeroDocumento', header: 'Nº Documento' },
        { field: 'historico', header: 'Histórico' }
    ];

    this.exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
    }));
    }

    loadMovimentos() {
        this.loading = true;
        this.movimentoService.getMovimentos(0,10).then(data => {
            const movimentosComDataConvertida = data.content.map(mov => ({
                ...mov,
                dataLancamento: mov.dataLancamento ? new Date(mov.dataLancamento) : undefined
            }));
            this.movimentos.set(movimentosComDataConvertida);
            this.loading = false;
        }).catch(error => {
            this.loading = false;
            this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar movimentos: ' + error,
            life: 3000
            });
        });

        this.subcontaService.getSubcontas(true).then((data)=>{
            this.subcontas.set(data);
            this.subcontas_select = this.subcontas().map(subconta => ({
                label: subconta.nome,
                value: subconta
            }));
        });

        this.tipoDocumentoService.getTipoDocumentos(true).then((data)=>{
            this.tiposDocumentos.set(data);
            this.tipo_documentos_select = this.tiposDocumentos().map(tipoDocumento => ({
                label: tipoDocumento.nome,
                value: tipoDocumento
            }));
        });
    }

    onGlobalFilter(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input?.value || '';
        this.dt?.filterGlobal(value, 'contains');
    }

    openNew() {
        this.movimento = {dataLancamento : new Date}
        this.submitted = false;
        this.movimentoDialog = true;
    }

    editMovimento(movimento: Movimento) {
        this.movimento = {
            id: movimento.id,
            subconta: this.subcontas().find(b => b.id === movimento.subconta?.id),
            tipoDocumento : this.tiposDocumentos().find(b => b.id === movimento.tipoDocumento?.id),
            valor: movimento.valor,
            dataLancamento : movimento.dataLancamento ? new Date(movimento.dataLancamento) : new Date(),
            historico: movimento.historico,
            observacao: movimento.observacao,
            numeroDocumento: movimento.numeroDocumento,
            numeroMovimento: movimento.numeroMovimento,
            importadoOfx: movimento.importadoOfx,
        };
        
        this.movimentoDialog = true;
    }

    hideDialog() {
        this.movimentoDialog = false;
        this.submitted = false;
    }

    async deleteMovimento(movimento: Movimento) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + movimento.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (movimento.id != null) {
                    try {
                        await this.movimentoService.deleteMovimento(movimento.id);

                        const novaLista = this.movimentos().filter(b => b.id !== movimento.id);
                        this.movimentos.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Movimento deletada',
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao deletar a Movimento: ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.movimentos().length; i++) {
            if (this.movimentos()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    async savemovimento() {
        this.submitted = true;
        let _movimentos = this.movimentos();

        if (this.movimento.valor != undefined && this.movimento.subconta != undefined && this.movimento.tipoDocumento != undefined) {
            try {
            if (this.movimento.id) {
                const updatedmovimento = await this.movimentoService.updateMovimento(this.converterMovimentoComObjetosParaIds(this.movimento));
                const index = this.findIndexById(updatedmovimento.id!);
                const updatedmovimentos = [..._movimentos];
                updatedmovimentos[index] = updatedmovimento;
                this.movimentos.set(updatedmovimentos);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Movimento atualizado',
                life: 3000
                });
            } else {
                const createdmovimento = await this.movimentoService.createMovimento(this.converterMovimentoComObjetosParaIds(this.movimento));
                this.movimentos.set([..._movimentos, createdmovimento]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Movimento criado',
                life: 3000
                });
            }

            this.movimentoDialog = false;
            this.movimento = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar Movimento: ' + error,
                    life: 3000
                });
            }
        }
    }

    converterMovimentoComObjetosParaIds(movimento: Movimento): MovimentoSaida {
        return {
            id: movimento.id,
            subcontaId: movimento.subconta?.id ?? '',
            tipoDocumentoId: movimento.tipoDocumento?.id ?? '',
            valor: movimento?.valor ?? 0,
            dataLancamento: movimento?.dataLancamento ?? new Date,
            historico: movimento.historico,
            observacao: movimento.observacao,
            numeroDocumento: movimento.numeroDocumento,
            numeroMovimento: movimento.numeroMovimento,
            importadoOfx: movimento?.importadoOfx ?? false
        };
    }

    totalSaldo(): number {
        return this.movimentos()
            .reduce((acc, mov) => {
                return mov?.subconta?.tipo === 'ENTRADA'
                    ? acc + (mov?.valor ?? 0)
                    : acc - (mov?.valor ?? 0);
            }, 0);
    }

    totalSaldoFormatado(): string {
        const total = this.totalSaldo() ?? 0;
        return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    formatarValor(valor: number): string{
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    loadMovimentosLazy(event: any) {
        this.loading = true;

        const page = event.first / event.rows;
        const size = event.rows;

        this.movimentoService.getMovimentos(page, size).then((response) => {
            this.movimentos.set(response.content);
            this.totalRecords = response.totalElements;
            this.loading = false;
        }).catch(error => {
            this.loading = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar movimentos: ' + error
            });
        });
    }


}
