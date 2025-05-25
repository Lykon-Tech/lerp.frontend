import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
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
import { OfxImportService } from '../services/ofximport.service';
import { TagService } from '../services/tag.service';
import { Conta } from '../models/conta.model';
import { ContaService } from '../services/conta.service';
import { TagModel } from '../models/tag.model';
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
    contas_select!: any[];
    contas = signal<Conta[]>([]);
    tipo_documentos_select!: any[];
    tiposDocumentos = signal<TipoDocumento[]>([]);
    totalRecords : number = 0;
    @ViewChild('dt') dt!: Table;
    @ViewChild('fileInput') fileInput!: ElementRef;
    private resolverMovimentoManual?: () => void;

    constructor(
    private movimentoService: MovimentoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private subcontaService : SubcontaService,
    private tipoDocumentoService : TipoDocumentoService,
    private ofxService : OfxImportService,
    private tagService : TagService,
    private contaService : ContaService
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

        this.contaService.getContas(true).then((data)=>{
            this.contas.set(data);
            this.contas_select = this.contas().map(conta => ({
                label: conta.numeroConta,
                value: conta
            }));
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
    async importOfx(event: Event) {
        const input = event.target as HTMLInputElement;
        
        if (input.files && input.files.length > 0) {
            try {
                const file = input.files[0];
                this.loading = true;

           
                const ofxData = await this.ofxService.importarOfx(file);
                
                const conta = await this.contaService.findByAgenciaNumeroConta(ofxData[0].agencia, ofxData[0].numeroConta);

                if(!conta){
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Conta não cadastrada ou inativa, não foi possível importar OFX. \n Agência: ' + ofxData[0].agencia + ' Número da conta: ' + ofxData[0].numeroConta,
                        life: 5000
                    });
                    return;
                }
                
                const tipoDocumento = await this.tipoDocumentoService.findOfx();

                const { movimentosValidos, historicosSemTag } = await this.identificarTagsFaltantes(ofxData, conta, tipoDocumento);

                if (historicosSemTag.length > 0) {
                    this.confirmationService.confirm({
                        message: `
                            <div>
                                <p>Os seguintes históricos não possuem tags correspondentes:</p>
                                <ul style="max-height: 200px; overflow-y: auto; margin: 10px 0; padding-left: 20px;">
                                    ${historicosSemTag.map(h => `<li>${h}</li>`).join('')}
                                </ul>
                                <p>Deseja importar esses ${historicosSemTag.length} movimentos manualmente?</p>
                            </div>
                        `,
                        header: 'Tags não encontradas',
                        icon: 'pi pi-exclamation-triangle',
                        acceptLabel: 'Sim, importar manualmente',
                        rejectLabel: 'Não, pular estes',
                        acceptButtonStyleClass: 'p-button-primary',
                        rejectButtonStyleClass: 'p-button-secondary',
                        accept: async () => {
                            await this.importarMovimentosManualmente(
                                ofxData.filter(item => historicosSemTag.includes(item.historico)),
                                tipoDocumento
                            );
                        },
                        reject: () => {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Importação parcial',
                                detail: `${historicosSemTag.length} movimentos sem tags foram ignorados`,
                                life: 5000
                            });
                        }
                    });
                }

                if (movimentosValidos.length > 0) {
                    const movimentosSaida = movimentosValidos
                        .map(mov => this.converterMovimentoComObjetosParaIds(mov));

                    await this.movimentoService.createmovimentos(movimentosSaida);
                    await this.loadMovimentos();
                    
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: `${movimentosValidos.length} movimentos importados automaticamente!`,
                        life: 5000
                    });
                }

            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao importar arquivo OFX: ' + error,
                    life: 5000
                });
            } finally {
                this.loading = false;
                input.value = '';
            }
        }
    }

    private async identificarTagsFaltantes(ofxData: any[], conta :Conta, tipoDocumento : TipoDocumento): Promise<{ 
        movimentosValidos: Movimento[], 
        historicosSemTag: string[]
    }> {
        const movimentosValidos: Movimento[] = [];
        const historicosSemTag = new Set<string>();
        let tag : TagModel = {};

        for (const item of ofxData) {
            try {
                tag = await this.tagService.findByName(item.historico);
                
                if (!tag) {
                    historicosSemTag.add(item.historico);
                    continue;
                }
               

            } catch (error) {
                historicosSemTag.add(item.historico);
                continue;
            }
            
            movimentosValidos.push({
                dataLancamento: item.dataLancamento,
                valor: item.valor,
                historico: item.historico,
                numeroDocumento: item.numeroDocumento,
                subconta: tag.subconta || {},
                conta : conta || {},
                tipoDocumento: tipoDocumento || {},
                importadoOfx: true
            });
           
        }

        return { 
            movimentosValidos, 
            historicosSemTag: Array.from(historicosSemTag) 
        };
    }

    private async importarMovimentosManualmente(movimentos: any[], tipodocumento :TipoDocumento): Promise<void> {
        for (const mov of movimentos) {
            try {
               
                this.movimento = {
                    dataLancamento: mov.dataLancamento,
                    valor: mov.valor,
                    historico: mov.historico,
                    numeroDocumento: mov.numeroDocumento,
                    importadoOfx: true,
                    subconta: {}, 
                    tipoDocumento: tipodocumento || {}
                };


                this.movimentoDialog = true;
                
                await new Promise<void>((resolve) => {
                    const subscription = this.messageService.messageObserver.subscribe((msg) => {
                        const mensagens = Array.isArray(msg) ? msg : [msg];

                        for (const m of mensagens) {
                            if ((m.summary === 'Sucesso' && m.detail?.includes('Movimento'))) {
                                subscription.unsubscribe();
                                resolve();
                                break;
                            }
                        }
                    });
                });


            } catch (error) {
                console.error(`Erro ao importar: ${mov.historico}`, error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: `Falha ao importar: ${mov.historico}`,
                    life: 3000
                });
            }
        }
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
            message: 'Você tem certeza que deseja deletar ' + movimento.historico + '?',
            header: 'Confirmar',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
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
                            detail: 'Movimento deletado',
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

        if (this.movimento.valor != undefined && 
            this.movimento.conta && 
            Object.keys(this.movimento.conta).length > 0 && 
            this.movimento.subconta && 
            Object.keys(this.movimento.subconta).length > 0 && 
            this.movimento?.historico?.trim != undefined
        ) {
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
            contaId: movimento.conta?.id ?? '',
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
