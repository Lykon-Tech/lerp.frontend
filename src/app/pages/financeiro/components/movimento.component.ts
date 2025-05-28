import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../bases/components/base.component";
import { Movimento } from "../models/movimento.model";
import { Component, signal } from "@angular/core";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { CheckboxModule } from "primeng/checkbox";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { TagModule } from "primeng/tag";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { InputTextModule } from "primeng/inputtext";
import { RatingModule } from "primeng/rating";
import { ToolbarModule } from "primeng/toolbar";
import { ToastModule } from "primeng/toast";
import { RippleModule } from "primeng/ripple";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { MovimentoService } from "../services/movimento.service";
import { FiltroMovimento } from "../models/filtromovimento.model";
import { ContaService } from "../services/conta.service";
import { Conta } from "../models/conta.model";
import { Subconta } from "../models/subconta.model";
import { SubcontaService } from "../services/subconta.service";
import { TipoDocumentoService } from "../services/tipodocumento.service";
import { TagModel } from "../models/tag.model";
import { TagService } from "../services/tag.service";
import { OfxImportService } from "../services/ofximport.service";
import { TipoDocumento } from "../models/tipodocumento.model";
import { MovimentoSaida } from "../models/movimento.saida.model";
import { DatePicker } from "primeng/datepicker";


@Component({
    selector: 'app-movimento',
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
        DatePicker
    ],
    templateUrl: `./Movimento.component.html`,
    providers: [MessageService, MovimentoService, ConfirmationService]
})
export class MovimentoComponent extends BaseComponente<Movimento> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: MovimentoService,
        private movimentoService : MovimentoService,
        private contaService : ContaService,
        private subcontaService : SubcontaService,
        private tipoDocumentoService : TipoDocumentoService,
        private tagService : TagService,
        private ofxService : OfxImportService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );

        this.titulo = 'movimento';
    }

    filtro : FiltroMovimento = {};
    loading: boolean = false;

    contas = signal<Conta[]>([]);
    contas_select! : any[];

    subcontas = signal<Subconta[]>([]);
    subcontas_select! : any[];

    tipoDocumentos = signal<Subconta[]>([]);
    tipoDocumentos_select! : any[];

    override getValidacoes(): boolean {
        return (this.objeto as any).historico.trim() && (this.objeto as any).subconta != undefined  && (this.objeto as any).dataLancamento != undefined;
    }

    override loadDemoData(): void {
        const hoje = new Date();

        this.filtro = {
            dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
            dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())     
        };

        this.loading = true;
        
        this.movimentoService.getMovimentosFiltro(this.filtro).then(data => {
            const movimentosComDataConvertida = data.map(mov => ({
                ...mov,
                dataLancamento: mov.dataLancamento ? new Date(mov.dataLancamento) : undefined
            }));
            this.lista.set(movimentosComDataConvertida);
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

        this.contaService.findAll(true).then((data)=>{
            this.contas.set(data);
            this.contas_select = this.contas().map(conta => ({
                label: conta.numeroConta,
                value: conta
            }));
        });


        this.subcontaService.findAll(true).then((data)=>{
            this.subcontas.set(data);
            this.subcontas_select = this.subcontas().map(subconta => ({
                label: subconta.nome,
                value: subconta
            }));
        });

        this.tipoDocumentoService.findAll(true).then((data)=>{
            this.tipoDocumentos.set(data);
            this.tipoDocumentos_select = this.tipoDocumentos().map(tipoDocumento => ({
                label: tipoDocumento.nome,
                value: tipoDocumento
            }));
        });
    }

    override getObjectNew(): Movimento {
        return {dataLancamento : new Date};
    }

    override getObjetoEdit(objeto: Movimento): Movimento {
         return {
            id: objeto.id,
            subconta: this.subcontas().find(b => b.id === objeto.subconta?.id),
            conta : this.contas().find(b => b.id === objeto.conta?.id),
            tipoDocumento : this.tipoDocumentos().find(b => b.id === objeto.tipoDocumento?.id),
            valor: objeto.valor,
            dataLancamento : objeto.dataLancamento ? new Date(objeto.dataLancamento) : new Date(),
            historico: objeto.historico,
            observacao: objeto.observacao,
            numeroDocumento: objeto.numeroDocumento,
            numeroMovimento: objeto.numeroMovimento,
            importadoOfx: objeto.importadoOfx,
        };
        
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
                        .map(mov => this.converterObjeto(mov));

                    await this.movimentoService.createmovimentos(movimentosSaida);
                    await this.loadDemoData();
                    
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
                
                this.objeto = {
                    dataLancamento: mov.dataLancamento,
                    valor: mov.valor,
                    historico: mov.historico,
                    numeroDocumento: mov.numeroDocumento,
                    importadoOfx: true,
                    subconta: {}, 
                    tipoDocumento: tipodocumento || {}
                };


                this.dialogo = true;
                
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

    override converterObjeto(movimento: Movimento): MovimentoSaida {
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
        return this.lista()
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

}
