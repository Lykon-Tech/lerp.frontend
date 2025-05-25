import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { Movimento } from "../models/movimento.model";
import { FiltroMovimento } from "../models/filtromovimento.model";
import { Subconta } from "../models/subconta.model";

import { MovimentoService } from "../services/movimento.service";
import { SubcontaService } from "../services/subconta.service";

import { ChartModule } from "primeng/chart";
import { FluidModule } from "primeng/fluid";
import { DatePicker } from "primeng/datepicker";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ConfirmationService, MessageService } from "primeng/api";
import { SelectModule } from "primeng/select";
import { PanelModule } from "primeng/panel";

@Component({
  selector: 'app-dashboard-financeiro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    FluidModule,
    DatePicker,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    CardModule,
    SelectModule,
    PanelModule
  ],
  templateUrl: './dashboard.component.html',
  providers: [MessageService, ConfirmationService]
})
export class DashboardFinanceiroComponent implements OnInit {
  filtro: FiltroMovimento = {};
  movimentos: Movimento[] = [];
  subcontas = signal<Subconta[]>([]);
  subcontas_select!: any[];

  chartPizzaData: any;
  chartBarData: any;
  chartLineData: any;

  chartOptions: any;
  loading = false;

  constructor(
    private movimentoService: MovimentoService,
    private messageService: MessageService,
    private subcontaService: SubcontaService
  ) {}

  ngOnInit() {
    this.definirPeriodoMensal();
    this.buscarMovimentos();

    this.subcontaService.getSubcontas(true).then((data) => {
      this.subcontas.set(data);
      this.subcontas_select = this.subcontas().map(sub => ({
        label: sub.nome,
        value: sub
      }));
    });

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } },
        y: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } }
      }
    };
  }

  definirPeriodoSemanal() {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    this.filtro.dataInicio = inicioSemana;
    this.filtro.dataFim = fimSemana;
    this.buscarMovimentos();
  }

  definirPeriodoMensal() {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    this.filtro.dataInicio = inicioMes;
    this.filtro.dataFim = fimMes;
    this.buscarMovimentos();
  }

  buscarMovimentos() {
    this.loading = true;
    this.movimentoService.getMovimentosFiltro(this.filtro).then((response) => {
      this.movimentos = response;
      this.atualizarGraficos();
      this.loading = false;
    }).catch(error => {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar movimentos: ' + error
      });
    });
  }

  atualizarGraficos() {
    const entradas = this.movimentos.filter(m => (m?.valor || 0) > 0).reduce((sum, m) => sum + (m?.valor || 0), 0);
    const saidas = this.movimentos.filter(m => (m?.valor || 0) < 0).reduce((sum, m) => sum + Math.abs((m?.valor || 0)), 0);

    this.chartPizzaData = {
      labels: ['Entradas', 'Saídas'],
      datasets: [
        {
          data: [entradas, saidas],
          backgroundColor: ['#42A5F5', '#FF6384'],
          hoverBackgroundColor: ['#64B5F6', '#FF6384']
        }
      ]
    };

    const movimentacaoPorDia: { [data: string]: number } = {};
    this.movimentos.forEach(mov => {
      const data = new Date(mov.dataLancamento || '').toLocaleDateString();
      movimentacaoPorDia[data] = (movimentacaoPorDia[data] || 0) + (mov.valor || 0);
    });

    const dias = Object.keys(movimentacaoPorDia).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const valores = dias.map(dia => movimentacaoPorDia[dia]);

    this.chartBarData = {
      labels: dias,
      datasets: [
        {
          label: 'Movimentação Diária',
          backgroundColor: '#42A5F5',
          data: valores
        }
      ]
    };

    let saldoAcumulado = 0;
    const saldoPorDia = valores.map(valor => {
      saldoAcumulado += valor;
      return saldoAcumulado;
    });

    this.chartLineData = {
      labels: dias,
      datasets: [
        {
          label: 'Saldo Acumulado',
          data: saldoPorDia,
          fill: false,
          borderColor: '#66BB6A',
          tension: 0.4
        }
      ]
    };
  }
}
