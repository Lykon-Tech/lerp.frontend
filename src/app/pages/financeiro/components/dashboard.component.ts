import { CommonModule } from "@angular/common";
import { Movimento } from "../models/movimento.model";
import { MovimentoService } from "../services/movimento.service";
import { ChartModule } from "primeng/chart";
import { Component, OnInit, signal } from "@angular/core";
import { FluidModule } from "primeng/fluid";
import { DatePicker } from "primeng/datepicker";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { FiltroMovimento } from "../models/filtromovimento.model";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { ConfirmationService, MessageService } from "primeng/api";
import { SelectModule } from "primeng/select";
import { GrupoConta } from "../models/grupoconta.model";
import { GrupoContaService } from "../services/grupoconta.service";
import { ReceitasDespesasRelatorios } from "../models/receitasdespesasrelatorios.model";

@Component({
    selector: 'app-dashboard-financeiro',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule, 
        ChartModule,
        FluidModule,
        DropdownModule,
        InputTextModule,
        CheckboxModule,
        ButtonModule,
        CardModule,
        SelectModule
    ],
    templateUrl: './dashboard.component.html',
    providers: [MessageService,ConfirmationService]
})
export class DashboardFinanceiroComponent implements OnInit {
  filtro: FiltroMovimento = {};
  receitasDespesasRelatorio: ReceitasDespesasRelatorios = {};
  chartData: any;
  chartOptions: any;
  loading: boolean = false;
  grupoContas = signal<GrupoConta[]>([]);
  grupo_contas_select!: any[];
  barData : any;
  barOptions: any;
  
  receitas : number[] = [];
  despesas : number[] = [];

  totalReceitaSemana : number = 0;
  totalReceitaMes : number = 0;
  totalReceitaSemestre : number = 0;
  totalReceitaAno : number = 0;
  totalDespesaSemana : number = 0;
  totalDespesaMes : number = 0;
  totalDespesaSemestre : number = 0;
  totalDespesaAno : number = 0;

  constructor(private movimentoService: MovimentoService,private messageService: MessageService, private grupoContasService : GrupoContaService) {}

  ngOnInit() {

    this.filtro = {dataInicio:new Date(new Date().getFullYear(), 0, 1), dataFim:new Date(new Date().getFullYear(), 11, 31)}
    this.buscarMovimentos();

    this.grupoContasService.getGrupoContas(true).then((data)=>{
        this.grupoContas.set(data);
        this.grupo_contas_select = this.grupoContas().map(grupoConta => ({
            label: grupoConta.nome,
            value: grupoConta
        }));
    });
  }

  
  buscarMovimentos() {
    this.loading = true;

    this.movimentoService.getReceitasDespesas(this.filtro).then((response) => {
        this.receitasDespesasRelatorio = response;
        this.receitas = Array(12).fill(0);
        this.despesas = Array(12).fill(0);

        (this.receitasDespesasRelatorio.receitasDespesasMensal ?? []).forEach(t => {
            const mesIndex = (t.mes ?? 0);
            if (mesIndex >= 0 && mesIndex < 12) {
                if (t.tipo === 'ENTRADA') {
                this.receitas[mesIndex] = t.valor;
                } else if (t.tipo === 'SAIDA') {
                this.despesas[mesIndex] = t.valor;
                }
            }
        });

        this.totalDespesaAno = this.receitasDespesasRelatorio.despesa?.valorTotalAnual ?? 0;
        this.totalDespesaSemestre = this.receitasDespesasRelatorio.despesa?.valorTotalSemestral ?? 0;
        this.totalDespesaMes = this.receitasDespesasRelatorio.despesa?.valorTotalMensal ?? 0;
        this.totalDespesaSemana = this.receitasDespesasRelatorio.despesa?.valorTotalSemanal ?? 0;

        this.totalReceitaAno = this.receitasDespesasRelatorio.receita?.valorTotalAnual ?? 0;
        this.totalReceitaSemestre = this.receitasDespesasRelatorio.receita?.valorTotalSemestral ?? 0;
        this.totalReceitaMes = this.receitasDespesasRelatorio.receita?.valorTotalMensal ?? 0;
        this.totalReceitaSemana = this.receitasDespesasRelatorio.receita?.valorTotalSemanal ?? 0;
        
        this.initCharts();
        this.loading = false;
    }).catch(error => {
        this.loading = false;
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar receitas x despesas: ' + error
        });
    });
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barData = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro' ,'Dezembro'],
        datasets: [
            {
                label: 'Receita',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                data: this.receitas
            },
            {
                label: 'Despesa',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                data: this.despesas
            }
        ]
    };

    this.barOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
  }
}
