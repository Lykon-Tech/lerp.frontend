import { CommonModule } from "@angular/common";
import { MovimentoService } from "../../services/movimento.service";
import { ChartModule } from "primeng/chart";
import { Component, OnInit, signal } from "@angular/core";
import { FluidModule } from "primeng/fluid";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { FiltroMovimento } from "../../models/filtromovimento.model";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { ConfirmationService, MessageService } from "primeng/api";
import { SelectModule } from "primeng/select";
import { GrupoConta } from "../../models/grupoconta.model";
import { GrupoContaService } from "../../services/grupoconta.service";
import { ReceitasDespesasRelatorios } from "../../models/receitasdespesasrelatorios.model";
import { PanelModule } from "primeng/panel";
import { Conta } from "../../models/conta.model";
import { DashConta } from "../../models/dashconta.model";
import { DatePicker } from "primeng/datepicker";
import { SaldoConta } from "../../models/saldoconta.model";

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
        SelectModule,
        PanelModule,
        DatePicker
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
    barHorizontalOptions: any;
    
    receitas : number[] = [];
    despesas : number[] = [];
    pieOptions: any;

    dashes : DashConta[] = [];
    saldoContas : SaldoConta[] = [];

    pieDataReceitas: any;
    pieDataDespesas: any;

    barDataReceitas!: any;
    barDataDespesas!: any;

    lineData: any;
    fluxoCaixa: any;
    lineOptions: any;

    grupoContaSelecionado! : string;

    totalReceitaSemana : string = '0';
    totalReceitaMes : string = '0';
    totalReceitaSemestre : string = '0';
    totalReceitaAno : string = '0';
    totalDespesaSemana : string = '0';
    totalDespesaMes : string = '0';
    totalDespesaSemestre : string = '0';
    totalDespesaAno : string = '0';

    constructor(private movimentoService: MovimentoService,private messageService: MessageService, private grupoContasService : GrupoContaService) {}

    ngOnInit() {
    
        const hoje = new Date();

        this.filtro = {
            dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
            dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())     
        };
        
        this.loadDemoData();
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
            this.atualizarGraficoLinha();
            this.atualizarGraficoBarraSubcontas();
            this.inciarGraficoRosquinha();
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

    inciarGraficoRosquinha() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const receitasFiltradas = this.receitasDespesasRelatorio.receitasDespesasMensal.filter(f => f.tipo === 'ENTRADA');
        const despesasFiltradas = this.receitasDespesasRelatorio.receitasDespesasMensal.filter(f => f.tipo === 'SAIDA');

        const sumByGroup: { [key: string]: number } = {};

        receitasFiltradas.forEach(item => {
            if (sumByGroup[item.grupoContaNome]) {
                sumByGroup[item.grupoContaNome] += item.valor;
            } else {
                sumByGroup[item.grupoContaNome] = item.valor;
            }
        });

        const sumByGroupDesp: { [key: string]: number } = {};

        
        despesasFiltradas.forEach(item => {
            if (sumByGroupDesp[item.grupoContaNome]) {
                sumByGroupDesp[item.grupoContaNome] += item.valor;
            } else {
                sumByGroupDesp[item.grupoContaNome] = item.valor;
            }
        });

     
        this.pieDataReceitas = {
            labels: Object.keys(sumByGroup), 
            datasets: [
                {
                    data: Object.values(sumByGroup),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--p-indigo-500'),
                        documentStyle.getPropertyValue('--p-purple-500'),
                        documentStyle.getPropertyValue('--p-teal-500'),
                        documentStyle.getPropertyValue('--p-orange-500'),
                        documentStyle.getPropertyValue('--p-pink-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--p-indigo-400'),
                        documentStyle.getPropertyValue('--p-purple-400'),
                        documentStyle.getPropertyValue('--p-teal-400'),
                        documentStyle.getPropertyValue('--p-orange-400'),
                        documentStyle.getPropertyValue('--p-pink-400')
                    ]                
                }
            ]
        };

        this.pieDataDespesas = {
            labels: Object.keys(sumByGroupDesp), 
            datasets: [
                {
                    data: Object.values(sumByGroupDesp),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--p-indigo-500'),
                        documentStyle.getPropertyValue('--p-purple-500'),
                        documentStyle.getPropertyValue('--p-teal-500'),
                        documentStyle.getPropertyValue('--p-orange-500'),
                        documentStyle.getPropertyValue('--p-pink-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--p-indigo-400'),
                        documentStyle.getPropertyValue('--p-purple-400'),
                        documentStyle.getPropertyValue('--p-teal-400'),
                        documentStyle.getPropertyValue('--p-orange-400'),
                        documentStyle.getPropertyValue('--p-pink-400')
                    ]
                }
            ]
        };

        this.pieOptions = {
            maintainAspectRatio: false,
            responsive: true,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    },
                    
                }
            }
        };

    
    }

    atualizarGraficoBarraSubcontas(grupoContaNome : string = ''){
        const documentStyle = getComputedStyle(document.documentElement);

        const receitasFiltradas = this.receitasDespesasRelatorio.receitasDespesasMensal.filter(f =>
            f.tipo === 'ENTRADA' && (grupoContaNome === '' || f.grupoContaNome === grupoContaNome)
        );

        const despesasFiltradas = this.receitasDespesasRelatorio.receitasDespesasMensal.filter(f =>
            f.tipo === 'SAIDA' && (grupoContaNome === '' || f.grupoContaNome === grupoContaNome)
        );

        const sumBySubcontaDesp: { [key: string]: number } = {};

        const sumBySubconta: { [key: string]: number } = {};

        receitasFiltradas.forEach(item => {
            if (sumBySubconta[item.subcontaNome]) {
                sumBySubconta[item.subcontaNome] += item.valor;
            } else {
                sumBySubconta[item.subcontaNome] = item.valor;
            }
        });

        despesasFiltradas.forEach(item => {
            if (sumBySubcontaDesp[item.subcontaNome]) {
                sumBySubcontaDesp[item.subcontaNome] += item.valor;
            } else {
                sumBySubcontaDesp[item.subcontaNome] = item.valor;
            }
        });

        const top10Subcontas = Object.entries(sumBySubconta)
            .sort((a, b) => b[1] - a[1]) 
            .slice(0, 10);               

        const topSumBySubconta: { [key: string]: number } = {};

        top10Subcontas.forEach(([key, value]) => {
            topSumBySubconta[key] = value;
        });

        const top10SubcontasDesp = Object.entries(sumBySubcontaDesp)
            .sort((a, b) => b[1] - a[1]) 
            .slice(0, 10);               

        const topSumBySubcontaDesp: { [key: string]: number } = {};

        top10SubcontasDesp.forEach(([key, value]) => {
            topSumBySubcontaDesp[key] = value;
        });

        this.barDataReceitas = {
            labels: Object.keys(topSumBySubconta),
            datasets: [
                {
                    label: 'Receita',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                    barThickness: 20,
                    data: Object.values(topSumBySubconta)
                }
            ]
        };

        
        this.barDataDespesas = {
            labels: Object.keys(topSumBySubcontaDesp),
            datasets: [
                {
                    label: 'Despesa',
                    backgroundColor: '#f44336',
                    borderColor: '#f44336',
                    barThickness: 20,
                    data: Object.values(topSumBySubcontaDesp)
                }
            ]
        };
    }

    handlePieClick(event: any, tipo : string) {

        if(event && event.element) {
            const index = event.element.index;
            const label = tipo == 'ENTRADA' ? this.pieDataReceitas.labels[index] : this.pieDataDespesas.labels[index];
 
            this.atualizarGraficoBarra(label);
            this.atualizarGraficoBarraSubcontas(label);
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
        
        this.totalDespesaAno = (depesas.reduce((soma, r) => soma + r.valorTotalAnual, 0) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.totalDespesaSemestre = (depesas.reduce((soma, r) => soma + r.valorTotalSemestral, 0) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.totalDespesaMes = (depesas.reduce((soma, r) => soma + r.valorTotalMensal, 0) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.totalDespesaSemana = (depesas.reduce((soma, r) => soma + r.valorTotalSemanal, 0) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        this.totalReceitaAno = (receitas.reduce((soma, r) => soma + r.valorTotalAnual, 0) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.totalReceitaSemestre = (receitas.reduce((soma, r) => soma + r.valorTotalSemestral, 0) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.totalReceitaMes = (receitas.reduce((soma, r) => soma + r.valorTotalMensal, 0) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.totalReceitaSemana = (receitas.reduce((soma, r) => soma + r.valorTotalSemanal, 0) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
                    backgroundColor: '#f44336',
                    borderColor: '#f44336',
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

        this.barHorizontalOptions = {
            indexAxis: 'y',
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

    atualizarGraficoLinha(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.fluxoCaixa = {
            labels: this.dashes.filter(f=>(f.dataLancamento != null || f.dataLancamento != undefined)).map(d=>(new Date(d.dataLancamento).toLocaleDateString('pt-BR'))),
            datasets: [
                {
                    label: 'Fluxo de caixa',
                    data: this.dashes.map(d => d.receita),
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                    tension: 0.4
                }
            ]
        };

        this.lineOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };

        
    }
    
    async loadDemoData(){
        await this.movimentoService.findDashByFiltro(this.filtro).then(data =>{
            this.dashes = data;
            this.atualizarGraficoLinha();
        });

        await this.movimentoService.findSaldoContas().then(data =>{
            this.saldoContas = data;
        });

    }

    atualizarGraficos(){
        this.atualizarGraficoBarra();
        this.atualizarGraficoBarraSubcontas();
    }

}
