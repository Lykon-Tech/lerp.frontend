import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Import CurrencyPipe
import { TableModule } from 'primeng/table';
import { TreeNode } from 'primeng/api';
import { MovimentoService } from '../../services/movimento.service';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { FluxoCaixa } from '../../models/fluxocaixa.model';
import { FluxoCaixaTreeNode } from '../../models/fluxocaixa.tree.model';

@Component({
  selector: 'app-fluxo-caixa',
  standalone: true,
  imports: [CommonModule, TableModule, TreeModule, TreeTableModule, DatePickerModule, FormsModule, CurrencyPipe],
  templateUrl: './fluxocaixa.component.html',
  providers: [CurrencyPipe] 
})
export class FluxoCaixaComponent implements OnInit {

  constructor(private service: MovimentoService) {}

  cols: { field: string; header: string }[] = [];
  treeTableValue: TreeNode<FluxoCaixaTreeNode>[] = [];
  selectedNodes: TreeNode<FluxoCaixaTreeNode>[] = [];
  selectedYear: Date = new Date();

  ngOnInit(): void {
    this.cols = [
      { field: '', header: 'Grupo de conta' },
      { field: 'janeiro', header: 'Janeiro' },
      { field: 'fevereiro', header: 'Fevereiro' },
      { field: 'marco', header: 'Março' },
      { field: 'abril', header: 'Abril' },
      { field: 'maio', header: 'Maio' },
      { field: 'junho', header: 'Junho' },
      { field: 'julho', header: 'Julho' },
      { field: 'agosto', header: 'Agosto' },
      { field: 'setembro', header: 'Setembro' },
      { field: 'outubro', header: 'Outubro' },
      { field: 'novembro', header: 'Novembro' },
      { field: 'dezembro', header: 'Dezembro' },
      { field: 'ano', header: 'Ano' }
    ];

    this.loadDataForSelectedYear();
  }

  onYearSelect() {
    this.loadDataForSelectedYear();
  }

  async loadDataForSelectedYear() {
    if (!this.selectedYear) return;
    const ano = this.selectedYear.getFullYear().toString();
    const meses: { [key: string]: string } = {
      '1': 'janeiro', '2': 'fevereiro', '3': 'marco', '4': 'abril', '5': 'maio', '6': 'junho',
      '7': 'julho', '8': 'agosto', '9': 'setembro', '10': 'outubro', '11': 'novembro', '12': 'dezembro'
    };

    const response: FluxoCaixa[] = await this.service.findFluxoCaixa(ano);

    const dataMap = new Map<string, Map<string, FluxoCaixaTreeNode[]>>();


    const entradaTotals: FluxoCaixaTreeNode = this.initializeMonthlyTotals();
    const saidaTotals: FluxoCaixaTreeNode = this.initializeMonthlyTotals();
    const saldoFinalTotals: FluxoCaixaTreeNode = this.initializeMonthlyTotals();
    const saldoAcumuladoTotals: FluxoCaixaTreeNode = this.initializeMonthlyTotals();
    const percentualLucratividade: FluxoCaixaTreeNode = this.initializeMonthlyTotals();

    let totalAnoEntrada = 0;
    let totalAnoSaida = 0;

    for (const item of response) {
      const tipo = item.tipo;
      const grupo = item.grupoContaNome;
      const subconta = item.subcontaNome;
      const mes = meses[item.mes];
      const valor = item.valor ?? 0;

      if (!dataMap.has(tipo)) dataMap.set(tipo, new Map());

      const grupoMap = dataMap.get(tipo)!;

      if (!grupoMap.has(grupo)) grupoMap.set(grupo, []);

      const subcontas = grupoMap.get(grupo)!;

      let sub = subcontas.find(s => s.subconta === subconta);
      if (!sub) {
        sub = {
          subconta,
          janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0,
          julho: 0, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0, 
          ano: 0
        };
        subcontas.push(sub);
      }
      sub[mes] = (Number(sub[mes]) || 0) + valor;

      if (tipo === 'ENTRADA') {
        entradaTotals[mes] = (Number(entradaTotals[mes]) || 0) + valor;
        totalAnoEntrada+= valor;
        entradaTotals['ano'] = totalAnoEntrada;
      } else if (tipo === 'SAIDA') {
        saidaTotals[mes] = (Number(saidaTotals[mes]) || 0) + valor;
        totalAnoSaida += valor;
        saidaTotals['ano'] = totalAnoSaida;
      }
    }

    const result: TreeNode<FluxoCaixaTreeNode>[] = [];

    ['ENTRADA', 'SAIDA'].forEach(tipo => {
      const currentTypeTotals = tipo === 'ENTRADA' ? entradaTotals : saidaTotals;

      const tipoNode: TreeNode<FluxoCaixaTreeNode> = {
        data: {
          tipo: tipo === 'ENTRADA' ? 'ENTRADAS' : 'SAIDAS',
          isHeader: true,

          janeiro: currentTypeTotals.janeiro,
          fevereiro: currentTypeTotals.fevereiro,
          marco: currentTypeTotals.marco,
          abril: currentTypeTotals.abril,
          maio: currentTypeTotals.maio,
          junho: currentTypeTotals.junho,
          julho: currentTypeTotals.julho,
          agosto: currentTypeTotals.agosto,
          setembro: currentTypeTotals.setembro,
          outubro: currentTypeTotals.outubro,
          novembro: currentTypeTotals.novembro,
          dezembro: currentTypeTotals.dezembro,
          ano: currentTypeTotals.ano
        },
        expanded: false,
        children: []
      };

      const grupos = dataMap.get(tipo);
      
      if (grupos) {
        for (const [grupo, subs] of grupos.entries()) {
          const grupoTotals: FluxoCaixaTreeNode = this.initializeMonthlyTotals();
          grupoTotals.grupoConta = grupo;
          grupoTotals.isTotal = true; 

          const subNodes: TreeNode<FluxoCaixaTreeNode>[] = subs.map(s => {
            let valorGrupoAno = 0;
            let totalSubconta = 0;
            for (const mes of Object.values(meses)) {
              grupoTotals[mes] = (Number(grupoTotals[mes]) || 0) + (Number(s[mes]) || 0);
              valorGrupoAno += Number(grupoTotals[mes]);
              grupoTotals['ano'] = valorGrupoAno;
              totalSubconta += (Number(s[mes]));
              s['ano'] = totalSubconta;
            }
            return { data: s };
          });

          tipoNode.children!.push({
            data: grupoTotals,
            children: subNodes,
            expanded: false
          });
        }
      }
      result.push(tipoNode);
    });

    let valorAcumulado = 0;

    for (const mes of Object.values(meses)) {
      saldoFinalTotals[mes] = (Number(entradaTotals[mes]) || 0) - (Number(saidaTotals[mes]) || 0);
      valorAcumulado += Number(saldoFinalTotals[mes]);

      saldoAcumuladoTotals[mes] = valorAcumulado;
      percentualLucratividade[mes] = Number(entradaTotals[mes]) == 0 ? 0 : Number(saldoFinalTotals[mes]) / (Number(entradaTotals[mes]));

      saldoAcumuladoTotals['ano'] = valorAcumulado;
      saldoFinalTotals['ano'] = valorAcumulado;
    }

    percentualLucratividade['ano'] = Number(saldoAcumuladoTotals['ano']) / Number(entradaTotals['ano']);

    result.push({
      data: {
        tipo: 'RESULTADO FINAL',
        isTotal: true, 
        janeiro: saldoFinalTotals.janeiro,
        fevereiro: saldoFinalTotals.fevereiro,
        marco: saldoFinalTotals.marco,
        abril: saldoFinalTotals.abril,
        maio: saldoFinalTotals.maio,
        junho: saldoFinalTotals.junho,
        julho: saldoFinalTotals.julho,
        agosto: saldoFinalTotals.agosto,
        setembro: saldoFinalTotals.setembro,
        outubro: saldoFinalTotals.outubro,
        novembro: saldoFinalTotals.novembro,
        dezembro: saldoFinalTotals.dezembro,
        ano: saldoFinalTotals.ano
      },
      expanded: false
    });

    result.push({
      data: {
        tipo: 'RESULTADO ACUMULADO',
        isTotal: true, 
        janeiro: saldoAcumuladoTotals.janeiro,
        fevereiro: saldoAcumuladoTotals.fevereiro,
        marco: saldoAcumuladoTotals.marco,
        abril: saldoAcumuladoTotals.abril,
        maio: saldoAcumuladoTotals.maio,
        junho: saldoAcumuladoTotals.junho,
        julho: saldoAcumuladoTotals.julho,
        agosto: saldoAcumuladoTotals.agosto,
        setembro: saldoAcumuladoTotals.setembro,
        outubro: saldoAcumuladoTotals.outubro,
        novembro: saldoAcumuladoTotals.novembro,
        dezembro: saldoAcumuladoTotals.dezembro,
        ano: saldoAcumuladoTotals.ano
      },
      expanded: false
    });

    result.push({
      data: {
        tipo: 'PERCENTUAL DE LUCRATIVIDADE',
        isTotal: true, 
        janeiro: percentualLucratividade.janeiro,
        fevereiro: percentualLucratividade.fevereiro,
        marco: percentualLucratividade.marco,
        abril: percentualLucratividade.abril,
        maio: percentualLucratividade.maio,
        junho: percentualLucratividade.junho,
        julho: percentualLucratividade.julho,
        agosto: percentualLucratividade.agosto,
        setembro: percentualLucratividade.setembro,
        outubro: percentualLucratividade.outubro,
        novembro: percentualLucratividade.novembro,
        dezembro: percentualLucratividade.dezembro,
        ano: percentualLucratividade.ano
      },
      expanded: false
    });

    this.treeTableValue = result;
  }

  private initializeMonthlyTotals(): FluxoCaixaTreeNode {
    return {
      janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0,
      julho: 0, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0, 
      ano: 0
    };
  }

  isTotalRow(row: FluxoCaixaTreeNode): boolean {
    return !!row.isTotal;
  }

  isTypeHeader(row: FluxoCaixaTreeNode): boolean {
    return !!row.isHeader;
  }

  getFieldData(data: any, field: string): any {
    return data?.[field] ?? 0;
  }
}