import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../bases/components/base.component";
import { Conta } from "../models/conta.model";
import { ContaService } from "../services/conta.service";
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
import { Banco } from "../models/banco.model";
import { BancoService } from "../services/banco.service";
import { ContaSaida } from "../models/conta.saida.model";


@Component({
    selector: 'app-conta',
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
    templateUrl: `./conta.component.html`,
    providers: [MessageService, ContaService, ConfirmationService]
})
export class ContaComponent extends BaseComponente<Conta, ContaSaida> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: ContaService,
        private bancoService : BancoService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );
        this.titulo = 'conta';
        this.genero = 'a';
    }

    bancos = signal<Banco[]>([]);

    bancos_select! : any[]

    override loadDemoData(): void {
        this.bancoService.findAll(true).then((data) => {
            this.bancos.set(data);
        });

        this.bancos_select = this.bancos().map(banco => ({
            label: banco.nome,
            value: banco
        }));

        super.loadDemoData();
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).agencia.trim() && (this.objeto as any).numeroConta.trim() && (this.objeto as any).ativo != undefined && (this.objeto as any).banco != undefined;
    }

    override getObjetoEdit(objeto: Conta): Conta {
        return {
            id : objeto.id,
            agencia : objeto.agencia,
            numeroConta : objeto.numeroConta,
            banco : this.bancos().find(b => b.id === objeto.banco?.id),
            ativo : objeto.ativo
        }
    }

    override converterObjeto(objeto: Conta): ContaSaida {
        return {
            id : objeto.id,
            agencia : objeto.agencia,
            numeroConta : objeto.numeroConta,
            bancoId : objeto.banco?.id,
            ativo : objeto.ativo
        }
    }

}
