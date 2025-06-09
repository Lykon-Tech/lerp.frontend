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
import { TurmaService } from "../services/turma.service";
import { Curso } from "../../cursos/models/curso.model";
import { CursoService } from "../../cursos/services/curso.service";
import { SituacaoTurmaService } from "../services/situacaoturma.service";
import { FuncionarioService } from "../../funcionarios/services/funcionario.service";
import { TurnoService } from "../services/turno.service";
import { SalaService } from "../services/sala.service";
import { SituacaoTurma } from "../models/situacaoturma.model";
import { Funcionario } from "../../funcionarios/models/funcionario.model";
import { Turno } from "../models/turno.model";
import { Sala } from "../models/sala.model";
import { TurmaSaida } from "../models/turma.saida.model";
import { DatePicker } from "primeng/datepicker";

@Component({
    selector: 'app-turma',
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
        DatePicker
    ],
    templateUrl: `./turma.component.html`,
    providers: [MessageService, TurmaService, ConfirmationService]
})
export class TurmaComponent extends BaseComponente<Turma,TurmaSaida> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: TurmaService,
        private cursoService : CursoService,
        private situacaoTurmaService : SituacaoTurmaService,
        private funcionarioService : FuncionarioService,
        private turnoService : TurnoService,
        private salaService : SalaService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );

        this.titulo = 'turma';
        this.genero = 'a';
    }

    cursos = signal<Curso[]>([]);
    situacoesTurmas = signal<SituacaoTurma[]>([]);
    professores = signal<Funcionario[]>([]);
    turnos = signal<Turno[]>([]);
    salas = signal<Sala[]>([]);

    cursos_select! : any[];
    situacao_turmas_select! : any[];
    professores_select! : any[];
    turnos_select! : any[];
    salas_select! : any[];

    override async loadDemoData() {
        this.loading = true;
        await this.cursoService.findAll(true).then((data) => {
            this.cursos.set(data);
            this.cursos_select = this.cursos().map(curso => ({
                label: curso.nome,
                value: curso
            }));
        });

        await this.situacaoTurmaService.findAll(true).then((data) => {
            this.situacoesTurmas.set(data);
            this.situacao_turmas_select = this.situacoesTurmas().map(curso => ({
                label: curso.nome,
                value: curso
            }));
        });

        await this.funcionarioService.findProfessores().then((data) => {
            this.professores.set(data);
            this.professores_select = this.professores().map(professor => ({
                label: professor.nome,
                value: professor
            }));
        });

        await this.turnoService.findAll(true).then((data) => {
            this.turnos.set(data);
            this.turnos_select = this.turnos().map(turno => ({
                label: turno.nome,
                value: turno
            }));
        });

        await this.salaService.findAll(true).then((data) => {
            this.salas.set(data);
            this.salas_select = this.salas().map(sala => ({
                label: sala.nome,
                value: sala
            }));
        });

        super.loadDemoData();
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).nome.trim() && 
            (this.objeto as any).ativo != undefined &&
            (this.objeto as any).turno != undefined &&
            (this.objeto as any).sala != undefined &&
            (this.objeto as any).curso != undefined;
    }

    override getObjetoEdit(objeto: Turma): Turma {
        return {
            id : objeto.id,
            nome: objeto.nome,
            ativo: objeto.ativo,
            dataInicio : objeto.dataInicio,
            dataFim : objeto.dataFim,
            maximoAlunos : objeto.maximoAlunos,
            minimoAlunos : objeto.minimoAlunos,
            metaAlunos : objeto.metaAlunos,
            curso : this.cursos().find(b => b.id === objeto.curso?.id),
            situacaoTurma : this.situacoesTurmas().find(b => b.id === objeto.situacaoTurma?.id),
            professor : this.professores().find(b => b.id === objeto.professor?.id),
            turno :this.turnos().find(b => b.id === objeto.turno?.id),
            sala : this.salas().find(b => b.id === objeto.sala?.id),
        }
    }

    override converterObjeto(objeto: Turma): TurmaSaida {
        return {
            id : objeto.id,
            nome: objeto.nome,
            ativo: objeto.ativo,
            dataInicio : objeto.dataInicio,
            dataFim : objeto.dataFim,
            maximoAlunos : objeto.maximoAlunos,
            minimoAlunos : objeto.minimoAlunos,
            metaAlunos : objeto.metaAlunos,
            cursoId : objeto.curso?.id,
            situacaoTurmaId : objeto.situacaoTurma?.id,
            professorId : objeto.professor?.id,
            turnoId : objeto.turno?.id,
            salaId : objeto.sala?.id
        }
    }


}
