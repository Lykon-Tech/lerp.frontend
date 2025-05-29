import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../bases/components/base.component";
import { Aluno } from "../models/aluno.model";
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
import { AlunoService } from "../services/aluno.service";

@Component({
    selector: 'app-Aluno',
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
    templateUrl: `./aluno.component.html`,
    providers: [MessageService, AlunoService, ConfirmationService]
})
export class AlunoComponent extends BaseComponente<Aluno, Aluno> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: AlunoService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );

        this.titulo = 'aluno';
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).nome.trim() && 
                (this.objeto as any).cpf.trim() &&
                (this.objeto as any).rg.trim() &&
                (this.objeto as any).cep.trim() &&
                (this.objeto as any).logradouro.trim() &&
                (this.objeto as any).numero.trim() &&
                (this.objeto as any).complemento.trim() &&
                (this.objeto as any).bairro.trim() &&
                (this.objeto as any).cidade.trim() &&
                (this.objeto as any).uf.trim() &&
                (this.objeto as any).telefone.trim() &&
                (this.objeto as any).email.trim() &&
                (this.objeto as any).matricula.trim();
    }

}
