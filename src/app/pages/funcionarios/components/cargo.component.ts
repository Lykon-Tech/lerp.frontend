import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente, Column } from "../../bases/components/base.component";
import { Cargo } from "../models/cargo.model";
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
import { CargoService } from "../services/cargo.service";

@Component({
    selector: 'app-Cargo',
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
    templateUrl: `./cargo.component.html`,
    providers: [MessageService, CargoService, ConfirmationService]
})
export class CargoComponent extends BaseComponente<Cargo> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: CargoService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );

        this.titulo = 'cargo';
    }

    permissoes! : any[];
    
    override loadDemoData(): void {
        this.permissoes = [
            { label: 'VENDEDOR', value: 'VENDEDOR' },
            { label: 'FINANCEIRO', value: 'FINANCEIRO' },
            { label: 'SUPERVISOR', value: 'SUPERVISOR' },
            { label: 'GESTOR', value: 'GESTOR' }
        ];

        super.loadDemoData();
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).nome.trim() && (this.objeto as any).ativo != undefined && (this.objeto as any).permissao != undefined;
    }

}
