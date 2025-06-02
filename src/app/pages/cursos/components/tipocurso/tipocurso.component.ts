import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseComponente } from '../../../bases/components/base.component';
import { TipoCurso } from '../../models/tipocurso.model';
import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TipoCursoService } from '../../services/tipocurso.service';

@Component({
    selector: 'app-TipoCurso',
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
    templateUrl: `./tipocurso.component.html`,
    providers: [MessageService, TipoCursoService, ConfirmationService]
})
export class TipoCursoComponent extends BaseComponente<TipoCurso, TipoCurso> {
    constructor(messageService: MessageService, confirmationService: ConfirmationService, service: TipoCursoService) {
        super(messageService, confirmationService, service);

        this.titulo = 'tipo de curso';
    }

    override getValidacoes(): boolean {
        return this.objeto?.nome?.trim() !== '' && this.objeto?.ativo != undefined;
    }
}
