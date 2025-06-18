import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TreeNode } from 'primeng/api';
import { MovimentoService } from '../../services/movimento.service';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { FormsModule } from '@angular/forms';
import { FluxoCaixa } from '../../models/fluxocaixa.model';
import { FluxoCaixaTreeNode } from '../../models/fluxocaixa.tree.model';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-faixa-dre',
  standalone: true,
  imports: [CommonModule, TableModule, TreeModule, TreeTableModule, DatePicker, FormsModule, CurrencyPipe, PercentPipe],
  templateUrl: './faixadre.component.html',
  providers: [CurrencyPipe, PercentPipe]
})
export class FaixaDREComponent implements OnInit {

  constructor(private service: MovimentoService) {}

  cols: { field: string; header: string }[] = [];
  treeTableValue: TreeNode<FluxoCaixaTreeNode>[] = [];
  selectedNodes: TreeNode<FluxoCaixaTreeNode>[] = [];
  selectedYear: Date = new Date();

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'DRE' },
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

    const response: FluxoCaixa[] = await this.service.findFaixaDRE(ano);

    const dataByFaixaDRE = new Map<string, Map<string, FluxoCaixaTreeNode[]>>();
    const naoOperacionalEntrada = new Map<string, FluxoCaixaTreeNode[]>();
    const naoOperacionalSaida = new Map<string, FluxoCaixaTreeNode[]>();

    const receitaBrutaTotals: FluxoCaixaTreeNode = { ...this.initializeMonthlyTotals(), faixaDRE: 'RECEITA BRUTA', isTotal: true, tipo: 'RECEITA BRUTA', name: '(+) RECEITA BRUTA' };
    const deducoesReceitaTotals: FluxoCaixaTreeNode = { ...this.initializeMonthlyTotals(), faixaDRE: 'DEDUÇÕES DA RECEITA', isTotal: true, tipo: 'DEDUÇÕES DA RECEITA', name: '(-) DEDUÇÕES DA RECEITA' };
    const custosVariaveisTotals: FluxoCaixaTreeNode = { ...this.initializeMonthlyTotals(), faixaDRE: 'CUSTOS VARIÁVEIS', isTotal: true, tipo: 'CUSTOS VARIÁVEIS', name: '(-) CUSTOS VARIÁVEIS' };
    const custosFixosTotals: FluxoCaixaTreeNode = { ...this.initializeMonthlyTotals(), faixaDRE: 'CUSTOS FIXOS', isTotal: true, tipo: 'CUSTOS FIXOS', name: '(-) CUSTOS FIXOS' };
    const resultadoNaoOperacionalTotals: FluxoCaixaTreeNode = { ...this.initializeMonthlyTotals(), faixaDRE: 'RESULTADO NÃO OPERACIONAL', isTotal: true, tipo: 'RESULTADO NÃO OPERACIONAL', name: '(=) RESULTADO NÃO OPERACIONAL' };
    const irCssllTotals: FluxoCaixaTreeNode = { ...this.initializeMonthlyTotals(), faixaDRE: 'IR/CSLL', isTotal: true, tipo: 'IR/CSLL', name: '(-) IR/CSLL' };

    for (const item of response) {
      const faixaDREKey = item.faixaDRE;
      const grupo = item.grupoContaNome;
      const subconta = item.subcontaNome;
      const mes = meses[item.mes];
      const valor = item.valor ?? 0;
      const tipoSubconta = item.tipo;

      if (faixaDREKey === 'RECEITA BRUTA') {
        receitaBrutaTotals[mes] = (Number(receitaBrutaTotals[mes]) || 0) + valor;
        receitaBrutaTotals.ano += valor;
      } else if (faixaDREKey === 'DEDUÇÕES DA RECEITA') {
        deducoesReceitaTotals[mes] = (Number(deducoesReceitaTotals[mes]) || 0) + valor;
        deducoesReceitaTotals.ano += valor;
      } else if (faixaDREKey === 'CUSTOS VARIÁVEIS') {
        custosVariaveisTotals[mes] = (Number(custosVariaveisTotals[mes]) || 0) + valor;
        custosVariaveisTotals.ano += valor;
      } else if (faixaDREKey === 'CUSTOS FIXOS') {
        custosFixosTotals[mes] = (Number(custosFixosTotals[mes]) || 0) + valor;
        custosFixosTotals.ano += valor;
      } else if (faixaDREKey === 'IR/CSLL') {
        irCssllTotals[mes] = (Number(irCssllTotals[mes]) || 0) + valor;
        irCssllTotals.ano += valor;
      }

      if (!dataByFaixaDRE.has(faixaDREKey)) {
        dataByFaixaDRE.set(faixaDREKey, new Map());
      }
      const grupoMap = dataByFaixaDRE.get(faixaDREKey)!;
      if (!grupoMap.has(grupo)) {
        grupoMap.set(grupo, []);
      }
      const subcontas = grupoMap.get(grupo)!;
      let sub = subcontas.find(s => s.subconta === subconta);
      if (!sub) {
        sub = {
          subconta,
          name: subconta,
          janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0,
          julho: 0, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0,
          ano: 0,
          faixaDRE: faixaDREKey,
          grupoConta: grupo,
        };
        subcontas.push(sub);
      }
      sub[mes] = (Number(sub[mes]) || 0) + valor;
      sub.ano += valor;

      if (faixaDREKey === 'RESULTADO NÃO OPERACIONAL') {
        

        if (tipoSubconta === 'ENTRADA') {
          if (!naoOperacionalEntrada.has(grupo)) naoOperacionalEntrada.set(grupo, []);
          const subcontasEntrada = naoOperacionalEntrada.get(grupo)!;
          let subEntrada = subcontasEntrada.find(s => s.subconta === subconta);
          if (!subEntrada) {
            subEntrada = {
              subconta,
              name: subconta, 
              janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0,
              julho: 0, agosto: 0, setembro: 0, 'outubro': 0, novembro: 0, dezembro: 0,
              ano: 0,
              faixaDRE: faixaDREKey,
              grupoConta: grupo,
            };
            subcontasEntrada.push(subEntrada);
          }
          subEntrada[mes] = (Number(subEntrada[mes]) || 0) + valor;
          subEntrada.ano += valor;
          resultadoNaoOperacionalTotals[mes] = (Number(resultadoNaoOperacionalTotals[mes]) || 0) + valor;
          resultadoNaoOperacionalTotals.ano += valor;
        } else if (tipoSubconta === 'SAIDA') {
          if (!naoOperacionalSaida.has(grupo)) naoOperacionalSaida.set(grupo, []);
          const subcontasSaida = naoOperacionalSaida.get(grupo)!;
          let subSaida = subcontasSaida.find(s => s.subconta === subconta);
          if (!subSaida) {
            subSaida = {
              subconta,
              name: subconta, 
              janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0,
              julho: 0, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0,
              ano: 0,
              faixaDRE: faixaDREKey,
              grupoConta: grupo,
            };
            subcontasSaida.push(subSaida);
          }
          subSaida[mes] = (Number(subSaida[mes]) || 0) + valor;
          subSaida.ano += valor;
          resultadoNaoOperacionalTotals[mes] = (Number(resultadoNaoOperacionalTotals[mes]) || 0) - valor;
          resultadoNaoOperacionalTotals.ano -= valor;
        }
      }
    }

    const result: TreeNode<FluxoCaixaTreeNode>[] = [];

    const dreOrder = [
      'RECEITA BRUTA',
      'DEDUÇÕES DA RECEITA',
      'RECEITA LÍQUIDA',
      'CUSTOS VARIÁVEIS',
      'MARGEM DE CONTRIBUIÇÃO',
      'MARGEM DE CONTRIBUIÇÃO PERCENTUAL',
      'CUSTOS FIXOS',
      'RESULTADO OPERACIONAL',
      'RESULTADO NÃO OPERACIONAL',
      'LUCRO ANTES DO IR/CSLL',
      'IR/CSLL',
      'RESULTADO FINAL',
      'MARGEM LÍQUIDA'
    ];

    const monthlyColumns = Object.values(meses);

    let resultadoLiquidoOperacionalTotals = this.initializeMonthlyTotals();
    let margemContribuicaoTotals = this.initializeMonthlyTotals();
    let margemContribuicaoPerc = this.initializeMonthlyTotals();
    let resultadoOperacionalAntesIrCssllTotals = this.initializeMonthlyTotals();
    let resultadoAntesIrCssllTotals = this.initializeMonthlyTotals();
    let resultadoFinalTotals = this.initializeMonthlyTotals();
    let percentualLucratividadeTotals = this.initializeMonthlyTotals();

    for (const faixa of dreOrder) {
      if (faixa === 'RECEITA BRUTA') {
        result.push(this.createFaixaDRENode(faixa, dataByFaixaDRE.get(faixa) || new Map(), receitaBrutaTotals));
      } else if (faixa === 'DEDUÇÕES DA RECEITA') {
        result.push(this.createFaixaDRENode(faixa, dataByFaixaDRE.get(faixa) || new Map(), deducoesReceitaTotals));
      } else if (faixa === 'RECEITA LÍQUIDA') {
        resultadoLiquidoOperacionalTotals = this.initializeMonthlyTotals();
        for (const mes of monthlyColumns) {
          resultadoLiquidoOperacionalTotals[mes] = (Number(receitaBrutaTotals[mes]) || 0) - (Number(deducoesReceitaTotals[mes]) || 0);
          resultadoLiquidoOperacionalTotals.ano += resultadoLiquidoOperacionalTotals[mes];
        }
        result.push({
          data: { ...resultadoLiquidoOperacionalTotals, tipo: 'RECEITA LÍQUIDA', isTotal: true, name: '(=) RECEITA LÍQUIDA' },
          expanded: false
        });
      } else if (faixa === 'CUSTOS VARIÁVEIS') {
        result.push(this.createFaixaDRENode(faixa, dataByFaixaDRE.get(faixa) || new Map(), custosVariaveisTotals));
      } else if (faixa === 'MARGEM DE CONTRIBUIÇÃO') {
        margemContribuicaoTotals = this.initializeMonthlyTotals();
        for (const mes of monthlyColumns) {
          margemContribuicaoTotals[mes] = (Number(resultadoLiquidoOperacionalTotals[mes]) || 0) - (Number(custosVariaveisTotals[mes]) || 0);
          margemContribuicaoTotals.ano += margemContribuicaoTotals[mes];
        }
        result.push({
          data: { ...margemContribuicaoTotals, tipo: 'MARGEM DE CONTRIBUIÇÃO', isTotal: true, name: '(=) MARGEM DE CONTRIBUIÇÃO' },
          expanded: false
        });
      }
      else if(faixa == 'MARGEM DE CONTRIBUIÇÃO PERCENTUAL'){
        margemContribuicaoPerc = this.initializeMonthlyTotals();

        for (const mes of monthlyColumns) {
          margemContribuicaoPerc[mes] = (Number(margemContribuicaoTotals[mes]) || 0) / (Number(receitaBrutaTotals[mes]) || 1);
          margemContribuicaoPerc.ano = (Number(margemContribuicaoTotals[ano]) || 0) / (Number(receitaBrutaTotals[ano]) || 1);
        }
        result.push({
          data: { ...margemContribuicaoPerc, tipo: 'MARGEM DE CONTRIBUIÇÃO PERCENTUAL', isTotal: true, name: '(=) MARGEM DE CONTRIBUIÇÃO %' },
          expanded: false
        });
      } 
      else if (faixa === 'CUSTOS FIXOS') {
        result.push(this.createFaixaDRENode(faixa, dataByFaixaDRE.get(faixa) || new Map(), custosFixosTotals));
      } else if (faixa === 'RESULTADO OPERACIONAL') {
        resultadoOperacionalAntesIrCssllTotals = this.initializeMonthlyTotals();
        for (const mes of monthlyColumns) {
          resultadoOperacionalAntesIrCssllTotals[mes] = (Number(margemContribuicaoTotals[mes]) || 0) - (Number(custosFixosTotals[mes]) || 0);
          resultadoOperacionalAntesIrCssllTotals.ano += resultadoOperacionalAntesIrCssllTotals[mes];
        }
        result.push({
          data: { ...resultadoOperacionalAntesIrCssllTotals, tipo: 'RESULTADO OPERACIONAL', isTotal: true, name: '(=) RESULTADO OPERACIONAL' },
          expanded: false
        });
      } else if (faixa === 'RESULTADO NÃO OPERACIONAL') {
        const naoOperacionalNode: TreeNode<FluxoCaixaTreeNode> = {
          data: {
            faixaDRE: faixa,
            name: faixa, 
            isHeader: true,
            ...resultadoNaoOperacionalTotals
          },
          expanded: false,
          children: []
        };

        const receitasNaoOperacionaisNode: TreeNode<FluxoCaixaTreeNode> = {
          data: {
            ...this.initializeMonthlyTotals(),
            tipo: 'Receitas Não Operacionais',
            isTotal: true,
            faixaDRE: faixa,
            name: '(+) Receitas Não Operacionais' 
          },
          expanded: false,
          children: []
        };

        const sortedEntradaGroups = Array.from(naoOperacionalEntrada.keys()).sort();

        for (const grupo of sortedEntradaGroups) {
          const subs = naoOperacionalEntrada.get(grupo)!;
          const grupoReceitasTotals = this.initializeMonthlyTotals();
          grupoReceitasTotals.grupoConta = grupo;
          grupoReceitasTotals.isTotal = true;
          grupoReceitasTotals.faixaDRE = faixa;
          grupoReceitasTotals.name = grupo; 

          const subNodes: TreeNode<FluxoCaixaTreeNode>[] = subs
            .sort((a, b) => (a.subconta || '').localeCompare(b.subconta || '')) 
            .map(s => {
              return { data: s };
            });

          for (const s of subs) {
            for (const mes of monthlyColumns) {
              grupoReceitasTotals[mes] = (Number(grupoReceitasTotals[mes]) || 0) + (Number(s[mes]) || 0);
            }
            grupoReceitasTotals.ano += (Number(s.ano) || 0);
          }

          for (const mes of monthlyColumns) {
            receitasNaoOperacionaisNode.data![mes] = (Number(receitasNaoOperacionaisNode.data![mes]) || 0) + (Number(grupoReceitasTotals[mes]) || 0);
          }
          receitasNaoOperacionaisNode.data!.ano += (Number(grupoReceitasTotals.ano) || 0);

          receitasNaoOperacionaisNode.children!.push({
            data: grupoReceitasTotals,
            children: subNodes,
            expanded: false
          });
        }
        naoOperacionalNode.children!.push(receitasNaoOperacionaisNode);

        const despesasNaoOperacionaisNode: TreeNode<FluxoCaixaTreeNode> = {
          data: {
            ...this.initializeMonthlyTotals(),
            tipo: 'Despesas Não Operacionais',
            isTotal: true,
            faixaDRE: faixa,
            name: '(-) Despesas Não Operacionais' 
          },
          expanded: false,
          children: []
        };

        const sortedSaidaGroups = Array.from(naoOperacionalSaida.keys()).sort();

        for (const grupo of sortedSaidaGroups) {
          const subs = naoOperacionalSaida.get(grupo)!;
          const grupoDespesasTotals = this.initializeMonthlyTotals();
          grupoDespesasTotals.grupoConta = grupo;
          grupoDespesasTotals.isTotal = true;
          grupoDespesasTotals.faixaDRE = faixa;
          grupoDespesasTotals.name = grupo; 

          const subNodes: TreeNode<FluxoCaixaTreeNode>[] = subs
            .sort((a, b) => (a.subconta || '').localeCompare(b.subconta || '')) 
            .map(s => {
              return { data: s };
            });

          for (const s of subs) {
            for (const mes of monthlyColumns) {
              grupoDespesasTotals[mes] = (Number(grupoDespesasTotals[mes]) || 0) + (Number(s[mes]) || 0);
            }
            grupoDespesasTotals.ano += (Number(s.ano) || 0);
          }

          for (const mes of monthlyColumns) {
            despesasNaoOperacionaisNode.data![mes] = (Number(despesasNaoOperacionaisNode.data![mes]) || 0) + (Number(grupoDespesasTotals[mes]) || 0);
          }
          despesasNaoOperacionaisNode.data!.ano += (Number(grupoDespesasTotals.ano) || 0);

          despesasNaoOperacionaisNode.children!.push({
            data: grupoDespesasTotals,
            children: subNodes,
            expanded: false
          });
        }
        naoOperacionalNode.children!.push(despesasNaoOperacionaisNode);

        result.push(naoOperacionalNode);

      } else if (faixa === 'LUCRO ANTES DO IR/CSLL') {
        resultadoAntesIrCssllTotals = this.initializeMonthlyTotals();
        for (const mes of monthlyColumns) {
          resultadoAntesIrCssllTotals[mes] = (Number(resultadoOperacionalAntesIrCssllTotals[mes]) || 0) + (Number(resultadoNaoOperacionalTotals[mes]) || 0);
          resultadoAntesIrCssllTotals.ano += resultadoAntesIrCssllTotals[mes];
        }
        result.push({
          data: { ...resultadoAntesIrCssllTotals, tipo: 'LUCRO ANTES DO IR/CSLL', isTotal: true, name: '(=) LUCRO ANTES DO IR/CSLL' },
          expanded: false
        });
      } else if (faixa === 'IR/CSLL') {
        result.push(this.createFaixaDRENode(faixa, dataByFaixaDRE.get(faixa) || new Map(), irCssllTotals));
      } else if (faixa === 'RESULTADO FINAL') {
        resultadoFinalTotals = this.initializeMonthlyTotals();
        for (const mes of monthlyColumns) {
          resultadoFinalTotals[mes] = (Number(resultadoAntesIrCssllTotals[mes]) || 0) - (Number(irCssllTotals[mes]) || 0);
          resultadoFinalTotals.ano += resultadoFinalTotals[mes];
        }
        result.push({
          data: { ...resultadoFinalTotals, tipo: 'RESULTADO FINAL', isTotal: true, name: '(=) RESULTADO FINAL' },
          expanded: false
        });
      }
      else if (faixa === 'MARGEM LÍQUIDA') {
        percentualLucratividadeTotals = this.initializeMonthlyTotals();
        for (const mes of monthlyColumns) {
          const receitaBrutaMes = (Number(receitaBrutaTotals[mes]) || 0);
          percentualLucratividadeTotals[mes] = receitaBrutaMes === 0 ? 0 : (Number(resultadoFinalTotals[mes]) || 0) / receitaBrutaMes;
        }
        const totalReceitaBrutaAno = (Number(receitaBrutaTotals.ano) || 0);
        const totalResultadoFinalAno = (Number(resultadoFinalTotals.ano) || 0);
        percentualLucratividadeTotals.ano = totalReceitaBrutaAno === 0 ? 0 : totalResultadoFinalAno / totalReceitaBrutaAno;
        
        result.push({
          data: { ...percentualLucratividadeTotals, tipo: 'MARGEM LÍQUIDA', isTotal: true, name: '(=) MARGEM LÍQUIDA %' },
          expanded: false
        });
      }
    }

    this.treeTableValue = result;
  }

  private createFaixaDRENode(
    faixaDRE: string,
    gruposMap: Map<string, FluxoCaixaTreeNode[]>,
    faixaTotals: FluxoCaixaTreeNode
  ): TreeNode<FluxoCaixaTreeNode> {
    const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

    const faixaNode: TreeNode<FluxoCaixaTreeNode> = {
      data: {
        faixaDRE: faixaDRE,
        name: faixaDRE,
        isHeader: true,
        ...faixaTotals
      },
      expanded: false,
      children: []
    };

    const sortedGroups = Array.from(gruposMap.keys()).sort();

    for (const grupo of sortedGroups) {
      const subs = gruposMap.get(grupo)!;
      const grupoTotals: FluxoCaixaTreeNode = this.initializeMonthlyTotals();
      grupoTotals.grupoConta = grupo;
      grupoTotals.faixaDRE = faixaDRE; 
      grupoTotals.isTotal = true;
      grupoTotals.name = grupo;

      const subNodes: TreeNode<FluxoCaixaTreeNode>[] = subs
        .sort((a, b) => (a.subconta || '').localeCompare(b.subconta || ''))
        .map(s => {
          let totalSubconta = 0;
          for (const mes of meses) {
            grupoTotals[mes] = (Number(grupoTotals[mes]) || 0) + (Number(s[mes]) || 0);
            totalSubconta += (Number(s[mes]) || 0);
          }
          s.ano = totalSubconta;
          s.faixaDRE = faixaDRE; 
          s.grupoConta = grupo;
          s.name = s.subconta; 
          return { data: s };
        });

      let totalGrupoAno = 0;
      for (const mes of meses) {
        totalGrupoAno += (Number(grupoTotals[mes]) || 0);
      }
      grupoTotals['ano'] = totalGrupoAno;

      faixaNode.children!.push({
        data: grupoTotals,
        children: subNodes,
        expanded: false
      });
    }
    return faixaNode;
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