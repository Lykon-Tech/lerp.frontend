import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../bases/components/base.component";
import { Funcionario } from "../models/funcionario.model";
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
import { FuncionarioService } from "../services/funcionario.service";
import { CargoService } from "../services/cargo.service";
import { Cargo } from "../models/cargo.model";
import { FuncionarioSaida } from "../models/funcionario.saida.model";

@Component({
    selector: 'app-Funcionario',
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
    templateUrl: `./funcionario.component.html`,
    providers: [MessageService, FuncionarioService, ConfirmationService]
})
export class FuncionarioComponent extends BaseComponente<Funcionario, FuncionarioSaida> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: FuncionarioService,
        private cargoService : CargoService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );

        this.titulo = 'funcionario';
    }

    chavesPix_select! : any[];
    tipoPagamento_select! : any[];

    tipoPagamentoSelecionado = '';

    cargos = signal<Cargo[]>([]);

    cargos_select! : any[];

    senha! : string;
    senhaRepetida! : string;

    editarSenha : boolean = false;
    
    override async loadDemoData() {
        this.loading = true;
        this.chavesPix_select = [
            { label: 'CPF', value: 'CPF' },
            { label: 'TELEFONE', value: 'TELEFONE' },
            { label: 'EMAIL', value: 'EMAIL' },
            { label: 'CHAVE ALEATÓRIA', value: 'CHAVE ALEATÓRIA' }
        ];

        this.tipoPagamento_select = [
            { label: 'MENSALISTA', value: 'MENSALISTA' },
            { label: 'HORISTA', value: 'HORISTA' }
        ];
        
        await this.cargoService.findAll(true).then((data) => {
            this.cargos.set(data);
            this.cargos_select = this.cargos().map(cargo => ({
                label: cargo.nome,
                value: cargo
            }));
        });
        
        super.loadDemoData();
    }

    override async save(){
        if(this.senha !== this.senhaRepetida){
            this.messageService.add({
                severity: 'error',
                summary: 'Falha',
                detail: 'As senhas não conferem',
                life : 8000
            });
            return;
        }

        await super.save()
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).nome.trim() && 
                (this.objeto as any).ativo != undefined && 
                (this.objeto as any).cargo != undefined && 
                (this.objeto as any).cpf.trim() &&
                (this.objeto as any).rg.trim() &&
                (this.objeto as any).cep.trim() &&
                (this.objeto as any).logradouro.trim() &&
                (this.objeto as any).numero.trim() &&
                (this.objeto as any).bairro.trim() &&
                (this.objeto as any).cidade.trim() &&
                (this.objeto as any).uf.trim() &&
                (this.objeto as any).telefone.trim() &&
                (this.objeto as any).email.trim();
    }

    override getObjetoEdit(objeto: Funcionario): Funcionario {
        return {
            id: objeto.id,
            nome: objeto.nome,
            email: objeto.email,
            cpf: objeto.cpf,
            rg: objeto.rg,
            telefone: objeto.telefone,
            cep: objeto.cep,
            logradouro: objeto.logradouro,
            numero: objeto.numero,
            complemento: objeto.complemento,
            bairro: objeto.bairro,
            cidade: objeto.cidade,
            uf: objeto.uf,
            ativo: objeto.ativo,
            cargo: this.cargos().find(c => c.id === objeto.cargo?.id),
            isMensalista : objeto.isMensalista,
            valorSalario : objeto.valorSalario,
            percentualInss : objeto.percentualInss,
            valorHora : objeto.valorHora,
            chavePix : objeto.chavePix,
            tipoChavePix : objeto.tipoChavePix,
            agencia : objeto.agencia,
            numeroConta : objeto.numeroConta
            
        };
    }

    override converterObjeto(objeto: Funcionario): FuncionarioSaida{
        return {
            id: objeto.id,
            nome: objeto.nome,
            email: objeto.email,
            cpf: objeto.cpf,
            rg: objeto.rg,
            telefone: objeto.telefone,
            cep: objeto.cep,
            logradouro: objeto.logradouro,
            numero: objeto.numero,
            complemento: objeto.complemento,
            bairro: objeto.bairro,
            cidade: objeto.cidade,
            uf: objeto.uf,
            ativo: objeto.ativo,
            cargoId: objeto.cargo?.id,
            isMensalista : objeto.isMensalista,
            valorSalario : objeto.valorSalario,
            percentualInss : objeto.percentualInss,
            valorHora : objeto.valorHora,
            chavePix : objeto.chavePix,
            tipoChavePix : objeto.tipoChavePix,
            agencia : objeto.agencia,
            numeroConta : objeto.numeroConta,
            senha: this.senha
        };
    }

    alterarTipoPagamento(event : any){
        this.tipoPagamentoSelecionado = event.value;
    }

    editSenha(){
        this.editarSenha = !this.editarSenha;
    }

}
