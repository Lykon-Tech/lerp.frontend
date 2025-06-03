import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../bases/components/base.component";
import { Turma } from "../models/turma.model";
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
import { PickListModule } from "primeng/picklist";
import { TransfAluno } from "../models/transfaluno.model";
import { TurmaService } from "../services/turma.service";
import { AutoCompleteCompleteEvent, AutoCompleteModule } from "primeng/autocomplete";
import { AlunoService } from "../../funcionarios/services/aluno.service";
import { TurmaSaida } from "../models/turma.saida.model";
import { CursoService } from "../../cursos/services/curso.service";
import { Curso } from "../../cursos/models/curso.model";

@Component({
    selector: 'app-trasnf-alunos',
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
        PickListModule,
        AutoCompleteModule
    ],
    templateUrl: `./transfalunos.component.html`,
    providers: [MessageService, ConfirmationService]
})
export class TransfAlunoComponent extends BaseComponente<Turma, TurmaSaida> {

    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: TurmaService,
        private turmaService: TurmaService,
        private alunoService : AlunoService,
        private cursoService : CursoService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );

        this.titulo = 'transferência de aluno';
        this.genero = 'a';
    }

    cursos = signal<Curso[]>([]);

    cursos_select! : any[];

    curso!: Curso;

    turmaSelecionadaA! : Turma;
    turmasA!: Turma;
    turmasB!: Turma;

    turmaA?: TransfAluno;
    turmaB?: TransfAluno;

    filtroTurmaA: Turma[] = [];
    filtroTurmaB: Turma[] = [];

    override loadDemoData(): void {

        this.cursoService.findAll().then((data) => {
            this.cursos.set(data);
            this.cursos_select = this.cursos().map(curso => ({
                label: curso.nome,
                value: curso
            }));
        });
    }

    onSelect(event : any){
        this.turmaService.findAllbyCurso(event.value.id).then((data) => {
            this.lista.set(data);
        });
    }

    override getValidacoes(): boolean {
        return true;
    }

    filterTurma(event: AutoCompleteCompleteEvent, filtro: string) {
        const query = event.query?.toLowerCase() || '';

        if (filtro === 'TURMA_A') {
            this.filtroTurmaA = this.filtrarTurma(query, this.lista());
        } else if (filtro === 'TURMA_B') {
            this.filtroTurmaB = this.filtrarTurma(query, this.lista().filter(turma =>this.turmaSelecionadaA.id != turma.id));
        }
    }

    filtrarTurma(query: string, turmas: Turma[]): Turma[] {
        if (!query) {
            return turmas;
        }

        return turmas.filter(turma =>
            turma.nome?.toLowerCase().startsWith(query)
        );
    }

    selecionarTurma(event: any, filtro: string) {
        this.alunoService.findByTurma(event.value.id ?? '').then((data) => {
            if (filtro === 'TURMA_A') {
                this.turmaA = data;
                this.turmaSelecionadaA = event.value;
            } else if (filtro === 'TURMA_B') {
                this.turmaB = data;
            }
        });
    }

    override async save() {
        this.submitted = true;

        try {

            if(this.turmaA == undefined || this.turmaB == undefined){
                this.messageService.add({
                    severity: 'error',
                    summary: 'Falha',
                    detail: 'Selecione uma turma de origem e destino',
                    life: 3000
                });

                return;
            }
            
            await this.alunoService.updateTurmaAlunos([this.turmaA,this.turmaB]);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: this.titulo + ' atualizad' + this.genero,
                life: 3000
            });
        
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Falha',
                detail: 'Falha ao salvar ' + this.titulo + ': ' + error,
                life: 3000
            });
        }
        
    }

}
