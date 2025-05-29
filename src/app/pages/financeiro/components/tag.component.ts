import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../bases/components/base.component";
import { TagModel } from "../models/tag.model";
import { TagService } from "../services/tag.service";
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
import { Subconta } from "../models/subconta.model";
import { SubcontaService } from "../services/subconta.service";
import { TagSaida } from "../models/tag.saida.model";


@Component({
    selector: 'app-tag',
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
    templateUrl: `./tag.component.html`,
    providers: [MessageService, TagService, ConfirmationService]
})
export class TagComponent extends BaseComponente<TagModel, TagSaida> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: TagService,
        private subcontaService : SubcontaService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );
        this.titulo = 'tag';
        this.genero = 'a';
    }

    subcontas = signal<Subconta[]>([]);

    subcontas_select! : any[]

    override loadDemoData(): void {
        this.subcontaService.findAll(true).then((data) => {
            this.subcontas.set(data);
        });

        this.subcontas_select = this.subcontas().map(subconta => ({
            label: subconta.nome,
            value: subconta
        }));

        super.loadDemoData();
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).nome.trim()  && (this.objeto as any).ativo != undefined && (this.objeto as any).subconta != undefined;
    }

    override getObjetoEdit(objeto: TagModel): TagModel {
        return {
            id : objeto.id,
            nome : objeto.nome,
            subconta : this.subcontas().find(b => b.id === objeto.subconta?.id),
            ativo : objeto.ativo
        }
    }

    override converterObjeto(objeto: TagModel): TagSaida {
         return {
            id : objeto.id,
            nome : objeto.nome,
            subcontaId : objeto.subconta?.id,
            ativo : objeto.ativo
        }
    }

}
