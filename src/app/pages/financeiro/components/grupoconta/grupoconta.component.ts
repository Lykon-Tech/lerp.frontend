import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../../bases/components/base.component";
import { GrupoConta } from "../../models/grupoconta.model";
import { GrupoContaService } from "../../services/grupoconta.service";
import { Component } from "@angular/core";
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


@Component({
    selector: 'app-grupo-conta',
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
    templateUrl: `./grupoconta.component.html`,
    providers: [MessageService, GrupoContaService, ConfirmationService]
})
export class GrupoContaComponent extends BaseComponente<GrupoConta, GrupoConta> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: GrupoContaService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );
        this.titulo = 'grupo de conta';
    }

    faixaDRE! : any[];
    travarFaixa : boolean = false;

    override async loadDemoData(){
        
        this.faixaDRE = [
            { label: 'RECEITA BRUTA', value: 'RECEITA BRUTA' },
            { label: 'DEDUÇÕES DA RECEITA', value: 'DEDUÇÕES DA RECEITA' },
            { label: 'CUSTOS VARIÁVEIS', value: 'CUSTOS VARIÁVEIS' },
            { label: 'CUSTOS FIXOS', value: 'CUSTOS FIXOS' },
            { label: 'RESULTADO NÃO OPERACIONAL', value: 'RESULTADO NÃO OPERACIONAL' },
            { label: 'IR/CSSLL', value: 'IR/CSSLL' },
            { label: 'NÃO FILTRAR', value: 'NÃO FILTRAR' }
        ];

        super.loadDemoData();
    }

    override edit(objeto: GrupoConta): void {
        super.edit(objeto);
        this.mudarFaixaDRE();
    }

    mudarFaixaDRE(){
        if(this.objeto.tipoOperacao == 'TRANSFERENCIA'){
            this.objeto.faixaDRE = 'NÃO FILTRAR';
            this.travarFaixa = true;
        }
        else if(this.objeto.tipoOperacao == 'RECEBIMENTO'){
            this.objeto.faixaDRE = 'RECEITA BRUTA';
            this.travarFaixa = true;
        }
        else{
            this.travarFaixa = false;
        }
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).nome.trim() && (this.objeto as any).ativo != undefined;
    }

}
