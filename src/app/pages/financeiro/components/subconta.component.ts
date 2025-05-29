import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../bases/components/base.component";
import { Subconta } from "../models/subconta.model";
import { SubcontaService } from "../services/subconta.service";
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
import { GrupoConta } from "../models/grupoconta.model";
import { GrupoContaService } from "../services/grupoconta.service";
import { SubcontaSaida } from "../models/subconta.saida.model";


@Component({
    selector: 'app-subconta',
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
    templateUrl: `./subconta.component.html`,
    providers: [MessageService, SubcontaService, ConfirmationService]
})
export class SubcontaComponent extends BaseComponente<Subconta, SubcontaSaida> {

    tipoTravado : boolean = false;
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: SubcontaService,
        private grupoContaService : GrupoContaService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );
        this.titulo = 'subconta';
        this.genero = 'a';
    }

    grupoContas = signal<GrupoConta[]>([]);

    grupoContas_select! : any[]

    override loadDemoData(): void {
        this.grupoContaService.findAll(true).then((data) => {
            this.grupoContas.set(data);
        });

        this.grupoContas_select = this.grupoContas().map(grupoConta => ({
            label: grupoConta.nome,
            value: grupoConta
        }));

        super.loadDemoData();
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).agencia.trim() && (this.objeto as any).ativo != undefined && (this.objeto as any).grupoConta != undefined && (this.objeto as any).tipo != undefined;
    }

    override getObjetoEdit(objeto: Subconta): Subconta {
        return {
            id : objeto.id,
            nome : objeto.nome,
            tipo : objeto.tipo,
            grupoConta : this.grupoContas().find(b => b.id === objeto.grupoConta?.id),
            ativo : objeto.ativo
        }
    }

    override converterObjeto(subconta: Subconta): SubcontaSaida {
        return {
            id: subconta.id,
            nome:subconta.nome,
            grupoContaId: subconta.grupoConta?.id, 
            ativo: subconta.ativo,
            tipo: subconta.tipo
        };
    }

    aoSelecionar(event: any) {
        if (event.value.recebimentoVendas) {
            this.objeto.tipo = 'ENTRADA';
            this.tipoTravado = true;
        } else {
            this.tipoTravado = false; 
        }
    }

}
