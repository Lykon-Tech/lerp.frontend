import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponente } from "../../bases/components/base.component";
import { Turma } from "../../turmas/models/turma.model";
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
import { TurmaService } from "../../turmas/services/turma.service";
import { SituacaoContratoService } from "../services/situacaocontrato.service";
import { FuncionarioService } from "../../funcionarios/services/funcionario.service";
import { SituacaoContrato } from "../models/situacaocontrato.model";
import { Funcionario } from "../../funcionarios/models/funcionario.model";
import { DatePicker } from "primeng/datepicker";
import { Contrato } from "../models/contrato.model";
import { ContratoSaida } from "../models/contrato.saida.model";
import { ContratoService } from "../services/contrato.service";
import { TipoContratoService } from "../services/tipocontrato.service";
import { BolsaService } from "../../financeiro/services/bolsa.service";
import { TipoContrato } from "../models/tipocontrato.model";
import { Bolsa } from "../../financeiro/models/bolsa.model";
import { AlunoService } from "../../funcionarios/services/aluno.service";
import { Aluno } from "../../funcionarios/models/aluno.model";

@Component({
    selector: 'app-contrato',
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
    templateUrl: `./contrato.component.html`,
    providers: [MessageService, TurmaService, ConfirmationService]
})
export class ContratoComponent extends BaseComponente<Contrato,ContratoSaida> {
   
    constructor(
        messageService: MessageService,
        confirmationService: ConfirmationService,
        service: ContratoService,
        private alunoService : AlunoService,
        private turmaService : TurmaService,
        private situacaoContratoService : SituacaoContratoService,
        private funcionarioService : FuncionarioService,
        private tipoContratoService : TipoContratoService,
        private bolsaService : BolsaService
    ) {
        super(
            messageService,
            confirmationService,
            service
        );

        this.titulo = 'contrato';
    }

    alunos = signal<Aluno[]>([]);
    turmas = signal<Turma[]>([]);
    situacoesContratos = signal<SituacaoContrato[]>([]);
    vendedores = signal<Funcionario[]>([]);
    tipoContratos = signal<TipoContrato[]>([]);
    bolsas = signal<Bolsa[]>([]);

    alunos_select! : any[];
    turmas_select! : any[];
    situacao_contratos_select! : any[];
    vendedores_select! : any[];
    bolsas_select! : any[];
    tipo_contratos_select! : any[];

    override loadDemoData(): void {

        this.alunoService.findAll(true).then((data) => {
            this.alunos.set(data);
            this.alunos_select = this.alunos().map(aluno => ({
                label: aluno.nome,
                value: aluno
            }));
        });

        this.turmaService.findAll(true).then((data) => {
            this.turmas.set(data);
            this.turmas_select = this.turmas().map(turma => ({
                label: turma.nome,
                value: turma
            }));
        });

        this.situacaoContratoService.findAll(true).then((data) => {
            this.situacoesContratos.set(data);
            this.situacao_contratos_select = this.situacoesContratos().map(turma => ({
                label: turma.nome,
                value: turma
            }));
        });

        this.funcionarioService.findVendedores().then((data) => {
            this.vendedores.set(data);
            this.vendedores_select = this.vendedores().map(vendedor => ({
                label: vendedor.nome,
                value: vendedor
            }));
        });

        this.bolsaService.findAll(true).then((data) => {
            this.bolsas.set(data);
            this.bolsas_select = this.bolsas().map(bolsa => ({
                label: bolsa.nome,
                value: bolsa
            }));
        });

        this.tipoContratoService.findAll(true).then((data) => {
            this.tipoContratos.set(data);
            this.tipo_contratos_select = this.tipoContratos().map(tipoContrato => ({
                label: tipoContrato.nome,
                value: tipoContrato
            }));
        });

        super.loadDemoData();
    }

    override getValidacoes(): boolean {
        return (this.objeto as any).aluno != undefined && 
            (this.objeto as any).ativo != undefined &&
            (this.objeto as any).bolsa != undefined &&
            (this.objeto as any).tipoContrato != undefined &&
            (this.objeto as any).turma != undefined;
    }

    override getObjetoEdit(objeto: Contrato): Contrato {
        return {
            id : objeto.id,
            aluno: objeto.aluno,
            ativo: objeto.ativo,
            dataInicio : objeto.dataInicio,
            dataFim : objeto.dataFim,
            observacao : objeto.observacao,
            turma : this.turmas().find(b => b.id === objeto.turma?.id),
            vendedor : this.vendedores().find(b => b.id === objeto.vendedor?.id),
            bolsa : this.bolsas().find(b => b.id === objeto.bolsa?.id),
            situacaoContrato : this.situacoesContratos().find(b => b.id === objeto.situacaoContrato?.id),
            tipoContrato : this.tipoContratos().find(b => b.id === objeto.tipoContrato?.id)
        }
    }

    override converterObjeto(objeto: Contrato): ContratoSaida {
        return {
            id : objeto.id,
            alunoId: objeto.aluno?.id,
            ativo: objeto.ativo,
            dataInicio : objeto.dataInicio,
            dataFim : objeto.dataFim,
            observacao : objeto.observacao,
            turmaId : objeto.turma?.id,
            vendedorId : objeto.vendedor?.id,
            bolsaId : objeto.bolsa?.id,
            situacaoContratoId : objeto.situacaoContrato?.id,
            tipoContratoId : objeto.tipoContrato?.id
        }
    }


}
