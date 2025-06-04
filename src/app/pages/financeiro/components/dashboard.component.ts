import { CommonModule } from "@angular/common";
import { MovimentoService } from "../services/movimento.service";
import { ChartModule } from "primeng/chart";
import { Component, OnInit, signal } from "@angular/core";
import { FluidModule } from "primeng/fluid";
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
    receitasDespesasRelatorio!: ReceitasDespesasRelatorios;
    chartData: any;
    chartOptions: any;
    loading: boolean = false;
    grupoContas = signal<GrupoConta[]>([]);
    grupo_contas_select!: any[];
    barData : any;
    barOptions: any;
    
    receitas : number[] = [];
    despesas : number[] = [];
    pieOptions: any;

    pieDataReceitas: any;
    pieDataDespesas: any;

    lineData: any;
    lineOptions: any;

    grupoContaSelecionado! : string;

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

        this.grupoContasService.findAll(true).then((data)=>{
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

            this.atualizarGraficoBarra();
            
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

        
        this.pieDataReceitas = {
            labels:  Array.from(new Set(this.receitasDespesasRelatorio.receitasDespesasMensal.filter(f=>f.tipo == 'ENTRADA').map(r => r.grupoContaNome))),
            datasets: [
                {
                    data: this.receitasDespesasRelatorio.receitasDespesasMensal.filter(f=>f.tipo == 'ENTRADA').map(r => r.valor),
                    backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-teal-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
                }
            ]
        };

        this.pieDataDespesas = {
            labels:  Array.from(new Set(this.receitasDespesasRelatorio.receitasDespesasMensal.filter(f=>f.tipo == 'SAIDA').map(r => r.grupoContaNome))),
            datasets: [
                {
                    data: this.receitasDespesasRelatorio.receitasDespesasMensal.filter(f=>f.tipo == 'SAIDA').map(r => r.valor),
                    backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-teal-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
                }
            ]
        };

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    
    }

    handlePieClick(event: any, tipo : string) {

        if(event && event.element) {
            const index = event.element.index;
            const label = tipo == 'ENTRADA' ? this.pieDataReceitas.labels[index] : this.pieDataDespesas.labels[index];

            this.atualizarGraficoBarra(label);
        }
    }

    atualizarGraficoBarra(grupoContaNome: string = ''){
        this.grupoContaSelecionado = grupoContaNome;
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const depesas = grupoContaNome == '' ? (this.receitasDespesasRelatorio.despesa ?? []) : (this.receitasDespesasRelatorio.despesa?.filter(f=>f.grupoContaNome == grupoContaNome) ?? [])
        const receitas = grupoContaNome == '' ? (this.receitasDespesasRelatorio.receita ?? []) : (this.receitasDespesasRelatorio.receita?.filter(f=>f.grupoContaNome == grupoContaNome) ?? [])
        
        this.totalDespesaAno = depesas.reduce((soma, r) => soma + r.valorTotalAnual, 0) ?? 0;
        this.totalDespesaSemestre = depesas.reduce((soma, r) => soma + r.valorTotalSemestral, 0) ?? 0;
        this.totalDespesaMes = depesas.reduce((soma, r) => soma + r.valorTotalMensal, 0) ?? 0;
        this.totalDespesaSemana = depesas.reduce((soma, r) => soma + r.valorTotalSemanal, 0) ?? 0;

        this.totalReceitaAno = receitas.reduce((soma, r) => soma + r.valorTotalAnual, 0) ?? 0;
        this.totalReceitaSemestre = receitas.reduce((soma, r) => soma + r.valorTotalSemestral, 0) ?? 0;
        this.totalReceitaMes = receitas.reduce((soma, r) => soma + r.valorTotalMensal, 0) ?? 0;
        this.totalReceitaSemana = receitas.reduce((soma, r) => soma + r.valorTotalSemanal, 0) ?? 0;

        this.receitas = Array(12).fill(0);
        this.despesas = Array(12).fill(0);

        const lista = grupoContaNome == '' ? (this.receitasDespesasRelatorio.receitasDespesasMensal ?? []) : (this.receitasDespesasRelatorio.receitasDespesasMensal.filter(f=>f.grupoContaNome == grupoContaNome) ?? []);
        
        lista.forEach(t => {
            const mesIndex = (t.mes ?? 0);
            if (mesIndex >= 0 && mesIndex < 12) {
                if (t.tipo === 'ENTRADA') {
                this.receitas[mesIndex] =  this.receitas[mesIndex] + t.valor;
                } else if (t.tipo === 'SAIDA') {
                this.despesas[mesIndex] = this.despesas[mesIndex] + t.valor;
                }
            }
        });

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

        this.lineData = {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro' ,'Dezembro'],
            datasets: [
                {
                    label: 'Lucro',
                    data: this.receitas.map((valor, index) => valor - (this.despesas[index] ?? 0)),
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                    tension: 0.4
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
