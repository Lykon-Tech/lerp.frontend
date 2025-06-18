import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../../bases/components/base.component";
import { Movimento } from "../../models/movimento.model";
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
import { Table, TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { MovimentoService } from "../../services/movimento.service";
import { FiltroMovimento } from "../../models/filtromovimento.model";
import { ContaService } from "../../services/conta.service";
import { Conta } from "../../models/conta.model";
import { Subconta } from "../../models/subconta.model";
import { SubcontaService } from "../../services/subconta.service";
import { TipoDocumentoService } from "../../services/tipodocumento.service";
import { OfxImportService } from "../../services/ofximport.service";
import { TipoDocumento } from "../../models/tipodocumento.model";
import { MovimentoSaida } from "../../models/movimento.saida.model";
import { DatePicker } from "primeng/datepicker";
import { SubcontaSaida } from "../../models/subconta.saida.model";
import { AutoCompleteCompleteEvent, AutoCompleteModule } from "primeng/autocomplete";
import { AgrupamentoSaida } from "../../models/agrupamento.saida.model";
import { Agrupamento } from "../../models/agrupamento.model";


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
        DatePicker,
        AutoCompleteModule
    ],
    templateUrl: `./Movimento.component.html`,
    providers: [MessageService, MovimentoService, ConfirmationService]
})
export class MovimentoComponent extends BaseComponente<Movimento, MovimentoSaida> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: MovimentoService,
        private movimentoService : MovimentoService,
        private contaService : ContaService,
        private subcontaService : SubcontaService,
        private tipoDocumentoService : TipoDocumentoService,
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
     
    dialogoEditar: boolean = false;
    dialogoAgrupamento : boolean = false;

    loadingEditar : boolean = false;
    loadingAgrupar : boolean = false;

    movimentosSelecionados!: Movimento[];

    movimentoEditar! : Movimento;
    
    contas = signal<Conta[]>([]);
    contas_select! : any[];

    subcontas = signal<Subconta[]>([]);
    subcontasAgrupar : Subconta[] = [];
    subcontas_select : Subconta[] = [];

    tipoDocumentos = signal<Subconta[]>([]);
    tipoDocumentos_select! : any[];

    saldo : string = '';

    novoValor: number = 0;
    valorDistribuido: number = 0;
    erroValor: boolean = false;

    adicionarAgrupamento() {
        if (!this.subcontas || this.novoValor <= 0) return;

        const totalSimulado = this.valorDistribuido + this.novoValor;

        if (totalSimulado > (this.movimentoEditar.valor ?? 0)) {
            this.erroValor = true;
            return;
        }

        this.movimentoEditar.agrupamentos?.push({ subconta: this.movimentoEditar.subconta ?? {}, valor: this.novoValor });
        this.valorDistribuido += this.novoValor;
        this.novoValor = 0;
        this.erroValor = false;
    }

    removerAgrupamento(agrup: Agrupamento) {
        const index = this.movimentoEditar.agrupamentos?.indexOf(agrup);
        if ((index ?? 0) >= 0) {
            this.movimentoEditar.agrupamentos?.splice(index ?? 0, 1);
            this.valorDistribuido -= agrup.valor;
        }
    }

    async salvarAgrupamentos() {
        if (this.valorDistribuido !== this.movimentoEditar.valor) {
            return;
        }

        this.submitted = true;
        let _lista = this.lista();

        try{
            this.loadingAgrupar = true;
            const updateObject = await this.movimentoService.update(this.converterObjeto(this.movimentoEditar), this.movimentoEditar.id ?? '');
            const index = this.findIndexById((updateObject as any).id!);
            const updatedObjects = [..._lista];
            updatedObjects[index] = updateObject;
            this.lista.set(updatedObjects);
            this.loadingAgrupar = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Subcontas agrupadas',
                life : 8000
            });
            this.dialogoAgrupamento = false;
        }catch(error){
            this.loadingAgrupar = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Falha',
                detail: 'Falha ao editar movimento: ' + error,
                life : 8000
            });
        }
        

    }

    override getValidacoes(): boolean {
        return (this.objeto as any).historico.trim() && (this.objeto as any).subconta != undefined  && (this.objeto as any).dataLancamento != undefined;
    }

    override ngOnInit(): void {
        const hoje = new Date();

        this.filtro = {
            dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0 , 0 , 0),
            dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23,59,59)     
        };

        super.ngOnInit();
    }

    override async loadDemoData() {

        this.loading = true;
        
        await this.movimentoService.getMovimentosFiltro(this.filtro).then(data => {
            const movimentosComDataConvertida = data.map(mov => ({
                ...mov,
                dataLancamento: mov.dataLancamento ? new Date(mov.dataLancamento) : undefined,
                subcontaNomeExibido: mov.agrupamentos && mov.agrupamentos.length > 0 ? 'AGRUPADO' : mov.subconta?.nome
            }));
            this.lista.set(movimentosComDataConvertida);
            
            this.loading = false;
            this.saldo = this.totalSaldoFormatado(this.dt);
            
        }).catch(error => {
            this.loading = false;
            this.messageService.add({
            severity: 'error',
            summary: 'Falha',
            detail: 'Falha ao carregar movimentos: ' + error,
            life : 8000
            });
        });

        await this.contaService.findAll(true).then((data)=>{
            this.contas.set(data);
            this.contas_select = this.contas().map(conta => ({
                label: conta.banco?.nome + ' - ' + conta.numeroConta,
                value: conta
            }));
        });


        await this.subcontaService.findAll(true).then((data)=>{
            this.subcontas.set(data);
            this.subcontas_select = this.subcontas();
        });

        await this.tipoDocumentoService.findAll(true).then((data)=>{
            this.tipoDocumentos.set(data);
            this.tipoDocumentos_select = this.tipoDocumentos().map(tipoDocumento => ({
                label: tipoDocumento.nome,
                value: tipoDocumento
            }));
        });
    }

    filterSubconta(event: AutoCompleteCompleteEvent) {
        const query = event.query?.toLowerCase() || '';
        this.subcontas_select = this.subcontas().filter(subconta => 
            subconta.nome?.toLowerCase().includes(query)
        );
    }

    filterSubcontaAgrupar(event: AutoCompleteCompleteEvent) {
        const query = event.query?.toLowerCase() || '';
        this.subcontas_select = this.subcontasAgrupar.filter(subconta => 
            subconta.nome?.toLowerCase().includes(query)
        );
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
            valor: this.getValor(objeto.valor ?? 0),
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

                if(conta.banco?.numeroBanco?.toString() != ofxData[0].numeroBanco.replace(/^0+/, '')){
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Falha',
                        detail: 'O Banco cadastrado difere da importação OFX! \n Banco cadastrado: ' + conta.banco?.numeroBanco + '\n Banco OFX:' + ofxData[0].numeroBanco ,
                        life: 5000
                    });
                    return;
                }
                if(!conta){
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Falha',
                        detail: 'Conta não cadastrada ou inativa, não foi possível importar OFX. \n Agência: ' + ofxData[0].agencia + ' Número da conta: ' + ofxData[0].numeroConta,
                        life: 5000
                    });
                    return;
                }
                
                const tipoDocumento = await this.tipoDocumentoService.findOfx();

                const { movimentosValidos, movimentosPadrao, historicosSemTag } = await this.identificarTagsFaltantes(ofxData, conta, tipoDocumento);

                let movimentosSaida : MovimentoSaida[]= [];

                if (movimentosValidos.length > 0) {
                    movimentosSaida.push(...movimentosValidos
                        .map(mov => this.converterObjeto(mov)));
                }

                if (movimentosPadrao.length > 0) {
                    movimentosSaida.push(...movimentosPadrao
                        .map(mov => this.converterObjeto(mov)));
                }

                const tamanhoChunk = 50;
                for (let i = 0; i < movimentosSaida.length; i += tamanhoChunk) {
                    let chunk = movimentosSaida.slice(i, i + tamanhoChunk);
                    await this.movimentoService.createmovimentos(chunk);
                }

                if(movimentosValidos.length > 0 || movimentosPadrao.length > 0){
                    await this.loadDemoData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: `Movimentos importados automaticamente!`,
                        life: 5000
                    });
                }   
                this.loading = true;
                await this.abrirTagsEditar(tipoDocumento, movimentosPadrao, historicosSemTag);
                this.loading = false;

            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Falha',
                    detail: 'Falha ao importar arquivo OFX: ' + error,
                    life: 5000
                });
            } finally {
                this.loading = false;
                input.value = '';
            }
        }
    }

    private async abrirTagsEditar(tipoDocumento : TipoDocumento, movimentosPadrao : Movimento[], historicosSemTag : string[]){
        if (historicosSemTag.length > 0) {
            const maxItensExibir = 10;
            const itensExibidos = historicosSemTag.slice(0, maxItensExibir);
            const maisItens = historicosSemTag.length - maxItensExibir;

            this.confirmationService.confirm({
                message: `
                    <div style="max-height: 400px; overflow-y: auto;">
                    <p>Estes movimentos foram importados na subconta padrão!</p>
                    <p>Deseja editar esses ${historicosSemTag.length} movimentos manualmente?</p>
                    <p>Os seguintes históricos não possuem tags correspondentes:</p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        ${itensExibidos.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                    ${maisItens > 0 ? `<p>... e mais ${maisItens} itens não mostrados</p>` : ''}
                    </div>
                `,
                header: 'Tags não encontradas',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sim, editar manualmente',
                rejectLabel: 'Não, pular estes',
                acceptButtonStyleClass: 'p-button-primary',
                rejectButtonStyleClass: 'p-button-secondary',
            accept: async () => {
                await this.importarMovimentosManualmente(movimentosPadrao, tipoDocumento);
            },
            reject: () => {
                this.messageService.add({
                severity: 'info',
                summary: 'Importação padrão',
                detail: `Movimentos sem tags, não editados foram importados na subconta padrão`,
                life: 5000
                });
            }
            });

        }
    }

    private async identificarTagsFaltantes(ofxData: any[], conta :Conta, tipoDocumento : TipoDocumento): Promise<{ 
        movimentosValidos: Movimento[], 
        historicosSemTag: string[],
        movimentosPadrao: Movimento[], 
    }> {
        const movimentosValidos: Movimento[] = [];
        const movimentosPadrao: Movimento[] = [];
        const historicosSemTag = new Set<string>();
        let subconta : Subconta = {};

        const subcontaEntradaPadrao = await this.subcontaService.findSubcontaPadrao(true);
        const subcontaSaidaPadrao = await this.subcontaService.findSubcontaPadrao(false);
        let lancarPadrao = false;

        for (const item of ofxData) {
            try {
                subconta = this.subcontas().filter(s => s.tags?.filter(t => t.nome === item.historico).length ?? 0  > 0)[0];
                
                if (!subconta) {
                    historicosSemTag.add(item.historico);
                }

                lancarPadrao = !subconta || (item.valor > 0 && subconta?.tipo == 'SAIDA') || (item.valor < 0 && subconta?.tipo == 'ENTRADA');

            } catch (error) {
                historicosSemTag.add(item.historico);
                lancarPadrao = true;
            }
            
            if(lancarPadrao){
                lancarPadrao = false;
                movimentosPadrao.push({
                    dataLancamento: item.dataLancamento,
                    valor: item.valor,
                    historico: item.historico,
                    numeroDocumento: item.numeroDocumento,
                    subconta:  item.valor > 0 ? subcontaEntradaPadrao : subcontaSaidaPadrao,
                    conta : conta || {},
                    tipoDocumento: tipoDocumento || {},
                    importadoOfx: true
                });
            }
            else{

                movimentosValidos.push({
                    dataLancamento: item.dataLancamento,
                    valor: item.valor,
                    historico: item.historico,
                    numeroDocumento: item.numeroDocumento,
                    subconta: subconta || {},
                    conta : conta || {},
                    tipoDocumento: tipoDocumento || {},
                    importadoOfx: true
                });
            }

            
        }

        return { 
            movimentosValidos, 
            historicosSemTag: Array.from(historicosSemTag),
            movimentosPadrao
        };
    }

    private async importarMovimentosManualmente(movimentos: any[], tipodocumento :TipoDocumento): Promise<void> {
        for (const mov of movimentos) {
            try {

                const id = await this.movimentoService.findByNumeroDocumento(this.converterObjeto(mov));
                
                this.objeto = {
                    id: id,
                    dataLancamento: mov.dataLancamento,
                    valor: mov.valor,
                    historico: mov.historico,
                    numeroDocumento: mov.numeroDocumento,
                    importadoOfx: true,
                    conta : mov.conta,
                    subconta: {}, 
                    tipoDocumento: tipodocumento || {}
                };

                this.dialogo = true;
                
                await new Promise<void>((resolve) => {
                    const subscription = this.messageService.messageObserver.subscribe((msg) => {
                        const mensagens = Array.isArray(msg) ? msg : [msg];

                        for (const m of mensagens) {
                            if ((m.summary === 'Sucesso' && m.detail?.includes('movimento'))) {
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
                    summary: 'Falha',
                    detail: `Falha ao importar: ${mov.historico}`,
                    life : 8000
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
            agrupamentos: this.converterAgrupamento(movimento.agrupamentos??[]),
            valor: movimento?.valor ?? 0,
            dataLancamento: movimento?.dataLancamento ?? new Date,
            historico: movimento.historico,
            observacao: movimento.observacao,
            numeroDocumento: movimento.numeroDocumento,
            numeroMovimento: movimento.numeroMovimento,
            importadoOfx: movimento?.importadoOfx ?? false
        };
    }

    converterAgrupamento(agrupamentos: Agrupamento[]): AgrupamentoSaida[] {
        return agrupamentos.map(a => ({
            subcontaId: a.subconta.id ?? '',
            valor: a.valor
        }));
    }

    totalSaldo(table : Table): number {
        const movimentosFiltrados = table?.filteredValue ?? this.lista();
        if (!movimentosFiltrados) return 0;

        return movimentosFiltrados.reduce((total, mov) => {
            const valor = mov.valor || 0;
            const tipo = mov.subconta?.tipo;

            if (tipo === 'ENTRADA') return total + valor;
            else if (tipo === 'SAIDA') return total - valor;
            else return total;
        }, 0);
    }

    totalSaldoFormatado(table : Table): string {
        const total = Math.abs(this.totalSaldo(table)) ?? 0;
        return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    formatarValor(valor: number): string{
        return Math.abs(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    getValor(valor: number) {
        return Math.abs(valor)
    }

    editarMovimentos(){
        this.dialogoEditar = true;
        this.movimentoEditar = {};
    }

    hideDialogEditar(){
        this.dialogoEditar = false;
    }

    async saveEditar() {
        const confirmEditar = await this.confirmDialog(
            `Deseja editar todos esses ${this.movimentosSelecionados.length} movimentos?`,
            'Editar movimentos'
        );

        if (!confirmEditar) return;

        const tagsHistoricos = this.movimentosSelecionados.map(s=> s.historico).filter(t=>!this.movimentoEditar.subconta?.tags?.map(e=>e.nome).includes(t));
        const tags = [...new Set(tagsHistoricos)].join(",");
        const tagsLimitadas = tags.length > 200 ? tags.slice(0, 200) + '...' : tags;

        const confirmTags = tagsHistoricos.length > 0 && await this.confirmDialog(
            `Deseja adicionar as tags "${tagsLimitadas}" à subconta?`,
            'Adicionar tags na subconta'
        );

        this.editarMovimentosSubcontas(confirmTags);
      
    }

    confirmDialog(message: string, header: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.confirmationService.confirm({
                message: `<div style="max-height: 400px; overflow-y: auto;">${message}</div>`,
                header: header,
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                acceptButtonStyleClass: 'p-button-primary',
                rejectButtonStyleClass: 'p-button-secondary',
                accept: () => resolve(true),
                reject: () => resolve(false)
            });
        });
    }


    async editarMovimentosSubcontas(adicionarTags : boolean = false){
        const movsSalvar = [];

        const movimentosEditar = this.movimentosSelecionados.map(
            movimento=>({id: movimento.id,
            subconta: movimento.subconta ? { ...movimento.subconta } : undefined,
            conta: movimento.conta ? { ...movimento.conta } : undefined,
            tipoDocumento: movimento.tipoDocumento ? { ...movimento.tipoDocumento } : undefined,
            agrupamentos: movimento.agrupamentos ? movimento.agrupamentos.map(agrup => ({ ...agrup })) : [],
            valor: movimento?.valor ?? 0,
            dataLancamento: movimento?.dataLancamento ? new Date(movimento.dataLancamento) : new Date(),
            historico: movimento.historico,
            observacao: movimento.observacao,
            numeroDocumento: movimento.numeroDocumento,
            numeroMovimento: movimento.numeroMovimento,
            importadoOfx: movimento?.importadoOfx ?? false})
        );

        for(const mov of movimentosEditar){
            mov.subconta = this.movimentoEditar.subconta ?? mov.subconta;
            mov.tipoDocumento = this.movimentoEditar.tipoDocumento ?? mov.tipoDocumento;
            movsSalvar.push(mov);
        }

        const movimentosSaida = movsSalvar.map(mov => this.converterObjeto(mov));

        try{
            if (!this.movimentoEditar.subconta) {
                this.movimentoEditar.subconta = {} as Subconta;
            }
          
            this.loadingEditar = true;

            const _lista = this.lista();

            let subconta : Subconta = {
                id : this.movimentoEditar.subconta.id,
                nome : this.movimentoEditar.subconta.nome,
                grupoConta : {...this.movimentoEditar.subconta.grupoConta},
                tipo : this.movimentoEditar.subconta.tipo,
                ativo : this.movimentoEditar.subconta.ativo,
                tags : this.movimentoEditar.subconta.tags?.map(m=>({
                    id:m.id,
                    nome:m.nome,
                    ativo:m.ativo
                }))
            }

            if(adicionarTags){
                subconta.tags = [
                    ...subconta.tags??[],
                    ...Array.from(new Map(this.movimentosSelecionados.filter(f=> !this.movimentoEditar.subconta?.tags?.map(t=>t.nome).includes(f.historico)).map(
                        m => [m.historico, { ativo: true, nome: m.historico }]
                    )).values())
                ];
                
                await this.subcontaService.update(this.converterObjetoSubconta(subconta), subconta.id??'');
            }

            const updateObjects = await this.movimentoService.createmovimentos(movimentosSaida, true);
            const updatedObjects = [..._lista];

            for(const updateObject of updateObjects){
                const index = this.findIndexById((updateObject as any).id!);
 
                updatedObjects[index] = updateObject;
            }

            this.lista.set(updatedObjects);

            this.loadingEditar = false;
            this.dialogoEditar = false;
            this.movimentoEditar = {};
            this.movimentosSelecionados = [];
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Movimentos editados com sucesso!',
                life : 8000
            });
            
        }catch(error){
            this.loadingEditar = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Falha',
                detail: 'Falha ao editar movimentos: ' + error,
                life : 8000
            });
        }
    }

    override async delete(objeto: Movimento) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + (objeto as any).historico + '?',
            header: 'Confirmar',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if ((objeto as any).id != null) {
                    try {
                        await this.movimentoService.delete((objeto as any).id);

                        const novaLista = this.lista().filter(b => (b as any)?.id !== (objeto as any).id);
                        this.lista.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: this.titulo + ' deletad' + this.genero,
                            life : 8000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Falha',
                            detail: 'Falha ao deletar '+ this.genero + ' ' +  this.titulo + ': ' + err,
                            life : 8000
                        });
                    }
                }
            }
        });
    }

    converterObjetoSubconta(subconta: Subconta): SubcontaSaida {
        return {
            id: subconta.id,
            nome:subconta.nome,
            grupoContaId: subconta.grupoConta?.id, 
            ativo: subconta.ativo,
            tags : subconta.tags,
            tipo: subconta.tipo
        };
    }

    override onGlobalFilter(table: Table, event: Event): void {
        const target = event.target as HTMLInputElement | null;

        if (!(target && target.type === 'checkbox')) {
            this.movimentosSelecionados = [];
        }
    
        super.onGlobalFilter(table,event);
    }

    filtrarSaldo(table : Table): void {
        this.movimentosSelecionados = [];
        this.saldo= this.totalSaldoFormatado(table);
    }

    agrupar(movimento : Movimento){
        this.movimentoEditar = { 
            id: movimento.id,
            subconta: movimento.subconta ? { ...movimento.subconta } : undefined,
            conta: movimento.conta ? { ...movimento.conta } : undefined,
            tipoDocumento: movimento.tipoDocumento ? { ...movimento.tipoDocumento } : undefined,
            agrupamentos: movimento.agrupamentos ? movimento.agrupamentos.map(agrup => ({ ...agrup })) : [],
            valor: movimento?.valor ?? 0,
            dataLancamento: movimento?.dataLancamento ? new Date(movimento.dataLancamento) : new Date(),
            historico: movimento.historico,
            observacao: movimento.observacao,
            numeroDocumento: movimento.numeroDocumento,
            numeroMovimento: movimento.numeroMovimento,
            importadoOfx: movimento?.importadoOfx ?? false
        };

        this.subcontasAgrupar = this.subcontas().filter(s=> s.tipo == this.movimentoEditar.subconta?.tipo);

        this.dialogoAgrupamento = true;
        this.novoValor = 0;
        this.valorDistribuido = (this.movimentoEditar.agrupamentos??[]).reduce((soma, agrup) => {return soma + (agrup.valor || 0);}, 0);
        this.erroValor = false;
    }
}
