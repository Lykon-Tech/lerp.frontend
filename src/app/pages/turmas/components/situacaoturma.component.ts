import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente, Column } from "../../bases/components/base.component";
import { SituacaoTurma } from "../models/situacaoturma.model";
import { SituacaoTurmaService } from "../services/situacaoturma.service";
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
    selector: 'app-situacao-turma',
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
    templateUrl: `./situacaoturma.component.html`,
    providers: [MessageService, SituacaoTurmaService, ConfirmationService]
})
export class SituacaoTurmaComponent extends BaseComponente<SituacaoTurma> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: SituacaoTurmaService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );
        this.titulo = 'situação de turma'
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).nome.trim() && (this.objeto as any).ativo != undefined;
    }

    override getObjetoEdit(objeto: SituacaoTurma): SituacaoTurma {
        return {...objeto}
    }

}
