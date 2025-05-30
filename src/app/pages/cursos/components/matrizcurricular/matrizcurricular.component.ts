import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseComponente } from '../../../bases/components/base.component';
import { MatrizCurricular } from '../../models/matrizcurricular.model';
import { Component, signal } from '@angular/core';
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
import { MatrizCurricularService } from '../../services/matrizcurricular.service';
import { MatrizCurricularSaida } from '../../models/matrizcurricular.saida.model';
import { MultiSelect } from 'primeng/multiselect';
import { DisciplinaService } from '../../services/disciplina.service';
import { Disciplina } from '../../models/disciplina.model';

@Component({
    selector: 'app-MatrizCurricular',
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
        MultiSelect
    ],
    templateUrl: `./matrizcurricular.component.html`,
    providers: [MessageService, MatrizCurricularService, ConfirmationService]
})
export class MatrizCurricularComponent extends BaseComponente<MatrizCurricular, MatrizCurricularSaida> {
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: MatrizCurricularService,
        private disciplinaService: DisciplinaService
    ) {
        super(messageService, confirmationService, service);

        this.titulo = 'matriz curricular';
        this.genero = 'a';
    }

    disciplinas = signal<Disciplina[]>([]);

    disciplinas_multi_select!: any[];

    override getValidacoes(): boolean {
        return (this.objeto as any).nome.trim() && (this.objeto as any).ativo != undefined && (this.objeto as any).disciplinas != undefined && (this.objeto as any).disciplinas.length > 0;
    }

    override loadDemoData(): void {
        this.disciplinaService.findAll(true).then((data) => {
            this.disciplinas.set(data);
            this.disciplinas_multi_select = this.disciplinas().map((disciplina) => ({
                label: disciplina.nome,
                value: disciplina,
                nome: disciplina.nome
            }));
        });

        super.loadDemoData();
    }

    override getObjetoEdit(matriz: MatrizCurricular) {
        return {
            id: matriz.id,
            nome: matriz.nome,
            ativo: matriz.ativo,
            disciplinas: this.disciplinas().filter((d) => matriz.disciplinas?.some((md) => md.id === d.id))
        };
    }

    override converterObjeto(matriz: MatrizCurricular): MatrizCurricularSaida {
        return {
            id: matriz.id,
            nome: matriz.nome,
            ativo: matriz.ativo,
            disciplinasIds: matriz.disciplinas?.map((d) => d.id).filter((id): id is string => !!id) ?? []
        };
    }
}
