import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../bases/components/base.component";
import { Curso } from "../models/curso.model";
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
import { CursoService } from "../services/curso.service";
import { TipoCursoService } from "../services/tipocurso.service";
import { TipoCurso } from "../models/tipocurso.model";
import { Funcionario } from "../../funcionarios/models/funcionario.model";
import { MatrizCurricular } from "../models/matrizcurricular.model";
import { Bolsa } from "../../financeiro/models/bolsa.model";
import { FuncionarioService } from "../../funcionarios/services/funcionario.service";
import { MatrizCurricularService } from "../services/matrizcurricular.service";
import { BolsaService } from "../../financeiro/services/bolsa.service";
import { CursoSaida } from "../models/curso.saida.model";
import { MultiSelectModule } from "primeng/multiselect";


@Component({
    selector: 'app-curso',
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
        MultiSelectModule
    ],
    templateUrl: `./curso.component.html`,
    providers: [MessageService, CursoService, ConfirmationService]
})
export class CursoComponent extends BaseComponente<Curso, CursoSaida> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: CursoService,
        private tipoCursoService : TipoCursoService,
        private funcionarioService : FuncionarioService,
        private matrizService : MatrizCurricularService,
        private bolsaService : BolsaService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );

        this.titulo = 'curso';
    }

    tiposCursos = signal<TipoCurso[]>([]);
    coordenadores = signal<Funcionario[]>([]);
    matrizesCurriculares = signal<MatrizCurricular[]>([]);
    bolsas = signal<Bolsa[]>([]);

    tiposCursos_select! : any[];
    coordenadores_select! : any[];
    matrizes_select! : any[];
    bolsas_multi_select! : any[];

    override loadDemoData(): void {

        this.tipoCursoService.findAll(true).then((data) => {
            this.tiposCursos.set(data);
            this.tiposCursos_select = data.map(tipoCurso => ({
                label: tipoCurso.nome,
                value: tipoCurso
            }));
        });

        this.funcionarioService.findCoordenadores().then((data) => {
            this.coordenadores.set(data);
            this.coordenadores_select = data.map(coordenador => ({
                label: coordenador.nome,
                value: coordenador
            }));
        });

        this.matrizService.findAll(true).then((data) => {
            this.matrizesCurriculares.set(data);
            this.matrizes_select = data.map(matriz => ({
                label: matriz.nome,
                value: matriz
            }));
        });


        this.bolsaService.findAll(true).then((data)=>{
            this.bolsas.set(data);
            this.bolsas_multi_select = this.bolsas().map(bolsa => ({
                label: bolsa.nome,
                value: bolsa,
                nome: bolsa.nome
            }));
        });


        super.loadDemoData();
        
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).nome.trim() && 
                (this.objeto as any).ativo != undefined && 
                (this.objeto as any).coordenador != undefined && 
                (this.objeto as any).matrizCurricular != undefined &&
                (this.objeto as any).numeroAulas != undefined &&
                (this.objeto as any).cargaHoraria != undefined &&
                (this.objeto as any).valor != undefined; 
    }

    override getObjetoEdit(objeto: Curso): Curso {
        return {
            id: objeto.id,
            nome: objeto.nome,
            ativo: objeto.ativo,
            valor: objeto.valor,
            coordenador : this.coordenadores().find(c=>c.id === objeto.coordenador?.id),
            numeroAulas : objeto.numeroAulas,
            cargaHoraria : objeto.cargaHoraria,
            matrizCurricular : this.matrizesCurriculares().find(c=>c.id === objeto.matrizCurricular?.id),
            tipoCurso : this.tiposCursos().find(c=>c.id === objeto.matrizCurricular?.id),
            bolsas: this.bolsas().filter(d =>
                objeto.bolsas?.some(b => b.id === d.id),
            
            )
        }
    }

    override converterObjeto(objeto: Curso): CursoSaida {
        return {
            id: objeto.id,
            nome: objeto.nome,
            ativo: objeto.ativo,
            valor: objeto.valor,
            coordenadorId : objeto.coordenador?.id,
            numeroAulas : objeto.numeroAulas,
            cargaHoraria : objeto.cargaHoraria,
            matrizCurricularId : objeto.matrizCurricular?.id,
            tipoCursoId : objeto.tipoCurso?.id,
            bolsasIds: objeto.bolsas
                ?.map(d => d.id)
                .filter((id): id is string => !!id) ?? []
        };
    }

}
