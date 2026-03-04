import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Target, TrendingUp, Users, CreditCard, Ticket, FileDown, BarChart2, PackageOpen, Banknote, ShoppingBag, Activity, History, ArrowRight, UserCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Dashboard = () => {
  const { config, performance, sales } = useStore();

  if (!performance?.ranking) return <div className="p-10 text-white font-mono uppercase">Carregando métricas...</div>;

  const ticketMedio = sales.length > 0 ? performance.totalVendido / sales.length : 0;

  // Função para exportar o relatório geral em PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22); doc.setTextColor(0, 122, 255); doc.text(`${config.name}`, 14, 20);
    doc.setFontSize(12); doc.setTextColor(100); doc.text(`Relatório Geral de Vendas`, 14, 28);
    doc.setFontSize(10); doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 34);

    const tableData = sales.map((sale: any) => [
      `#${sale.id}`, new Date(sale.data).toLocaleDateString('pt-BR'), sale.vendedor, sale.metodo, `R$ ${sale.total.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 42,
      head: [['ID', 'Data', 'Operador', 'Pagamento', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [20, 20, 24] },
      styles: { fontSize: 9 }
    });
    doc.save(`Relatorio_Vendas_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="p-4 md:p-8 bg-black text-white min-h-screen pb-32">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-zinc-800 pb-8">
        <div>
          <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
            <BarChart2 className="text-blue-500" size={48} /> BI <span className="text-zinc-600">/ Detalhes</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Visão Analítica da Loja - Dados de Demonstração</p>
        </div>
        <button onClick={exportPDF} className="bg-blue-600 hover:bg-white hover:text-black text-white px-8 py-5 rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all shadow-xl flex items-center gap-3">
          <FileDown size={20} /> Exportar Relatório Diário
        </button>
      </div>

      {/* BLOCO 1: INDICADORES PRINCIPAIS (KPIs com Ícones Gigantes) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        
        {/* Faturamento */}
        <div className="bg-zinc-950 p-8 rounded-[2rem] border border-zinc-800 group hover:border-green-500 transition-colors">
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20">
            <Banknote size={36} className="text-green-500" />
          </div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Faturamento Bruto</p>
          <p className="text-3xl lg:text-4xl font-mono font-black text-white transition-all">R$ {performance.totalVendido?.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-700 font-bold uppercase mt-2">Dados simulados fakes</p>
        </div>

        {/* Quantidade de Vendas */}
        <div className="bg-zinc-950 p-8 rounded-[2rem] border border-zinc-800 group hover:border-blue-500 transition-colors">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
            <ShoppingBag size={36} className="text-blue-500" />
          </div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Total de Vendas</p>
          <p className="text-3xl lg:text-4xl font-mono font-black text-white">{sales.length} <span className="text-base font-bold text-zinc-600">itens</span></p>
          <p className="text-[10px] text-zinc-700 font-bold uppercase mt-2">Histórico simulado fake</p>
        </div>

        {/* Ticket Médio */}
        <div className="bg-zinc-950 p-8 rounded-[2rem] border border-zinc-800 group hover:border-purple-500 transition-colors">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
            <Activity size={36} className="text-purple-500" />
          </div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Ticket Médio</p>
          <p className="text-3xl lg:text-4xl font-mono font-black text-white">R$ {ticketMedio.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-[10px] text-zinc-700 font-bold uppercase mt-2">Gasto médio por cliente fake</p>
        </div>

        {/* Meta da Loja */}
        <div className="bg-zinc-950 p-8 rounded-[2rem] border border-zinc-800 relative overflow-hidden group hover:border-orange-500 transition-colors">
          <Target className="absolute -right-4 -bottom-4 text-orange-500/5 group-hover:scale-110 transition-transform" size={130} />
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 relative z-10 border border-orange-500/20">
            <Target size={36} className="text-orange-500" />
          </div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest mb-1 relative z-10 group-hover:text-white transition-colors">Meta: R$ {config.monthlyGoal.toLocaleString()}</p>
          <p className="text-3xl lg:text-4xl font-mono font-black text-orange-500 relative z-10">{(performance.percentualMeta || 0).toFixed(1)}%</p>
          <div className="w-full bg-zinc-800 h-2.5 rounded-full mt-4 relative z-10 overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, performance.percentualMeta)}%` }} />
          </div>
        </div>

      </div>

      {/* BLOCO 2: GRÁFICOS E VISUALIZAÇÃO DE DADOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* Curva ABC (Top Produtos) */}
        <div className="bg-zinc-950 p-8 md:p-10 rounded-[2.5rem] border border-zinc-800">
          <div className="flex items-center gap-4 mb-10">
            <PackageOpen size={30} className="text-blue-500" />
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Top 5 Produtos Mais Vendidos</h3>
          </div>
          
          {performance.topProdutos.length === 0 ? (
            <p className="text-zinc-600 text-sm font-bold italic text-center py-10 font-mono">Sem dados simulados fakes suficientes.</p>
          ) : (
            <div className="space-y-6">
              {performance.topProdutos.map(([nome, qtd]: any, idx: number) => {
                const maxQtd = performance.topProdutos[0][1];
                const percent = (qtd / maxQtd) * 100;
                return (
                  <div key={nome} className="group">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold uppercase text-zinc-300 group-hover:text-white transition-colors">{idx + 1}º {nome}</span>
                      <span className="text-sm font-mono font-black text-blue-400">{qtd} UN</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full group-hover:bg-white transition-colors" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Receita por Pagamento */}
        <div className="bg-zinc-950 p-8 md:p-10 rounded-[2.5rem] border border-zinc-800 relative">
          <div className="flex items-center gap-4 mb-10">
            <CreditCard size={30} className="text-green-500" />
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Receita por Forma de Pagamento</h3>
          </div>
          
          {performance.vendasPorMetodo.length === 0 ? (
            <p className="text-zinc-600 text-sm font-bold italic text-center py-10 font-mono">Sem dados simulados fakes suficientes.</p>
          ) : (
            <div className="space-y-6">
              {performance.vendasPorMetodo.map(([metodo, valor]: any) => {
                const percent = (valor / performance.totalVendido) * 100;
                return (
                  <div key={metodo} className="group">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold uppercase text-zinc-300 group-hover:text-white transition-colors">{metodo}</span>
                      <div className="text-right">
                        <span className="text-sm font-mono font-black text-green-400 block">R$ {valor.toLocaleString()}</span>
                        <span className="text-[10px] text-zinc-500 font-bold group-hover:text-white transition-colors">{percent.toFixed(1)}% do faturamento fake</span>
                      </div>
                    </div>
                    <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden relative">
                      <div className="h-full bg-green-500 rounded-full group-hover:bg-white transition-colors" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* BLOCO 3: LISTAS DE OPERAÇÃO (CÉLULAS COM DADOS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Ranking da Equipe */}
        <div className="bg-zinc-950 p-8 md:p-10 rounded-[2.5rem] border border-zinc-800">
          <div className="flex items-center gap-4 mb-8 border-b border-zinc-800 pb-6">
            <Users size={30} className="text-purple-500" />
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Rank Operacional</h3>
          </div>
          <div className="space-y-4">
            {performance.ranking.length === 0 ? (
              <p className="text-zinc-600 text-sm font-bold italic text-center py-6 font-mono">Sem vendas simuladas fakes.</p>
            ) : (
              performance.ranking.map(([nome, dados]: any, idx: number) => (
                <div key={nome} className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 hover:border-purple-500 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center font-black text-sm text-purple-400 border border-purple-500/20">{idx + 1}º</div>
                    <div>
                      <p className="font-bold uppercase text-sm text-white">{nome}</p>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{dados.count} Vendas fakes registradas</p>
                    </div>
                  </div>
                  <span className="font-mono font-black text-2xl text-purple-400">R$ {dados.total?.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimas Vendas */}
        <div className="bg-zinc-950 p-8 md:p-10 rounded-[2.5rem] border border-zinc-800">
          <div className="flex items-center gap-4 mb-8 border-b border-zinc-800 pb-6">
            <History size={30} className="text-orange-500" />
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Histórico de Caixa fakes</h3>
          </div>
          <div className="space-y-4 pr-3 overflow-y-auto max-h-[400px] custom-scrollbar">
            {sales.length === 0 ? (
              <p className="text-zinc-600 text-sm font-bold italic text-center py-6 font-mono">Sem vendas simuladas fakes.</p>
            ) : (
              sales.slice(0, 10).map((sale: any) => (
                <div key={sale.id} className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 hover:border-orange-500 transition-all">
                  <div className="flex items-center gap-5 truncate">
                    <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700 text-zinc-400 flex items-center justify-center"><UserCircle2 size={18}/></div>
                    <div className="truncate">
                      <p className="font-bold text-xs uppercase text-white truncate max-w-[150px] md:max-w-[200px]">
                        {sale.cliente || 'Consumidor Final'}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">#{sale.id} • {sale.metodo} • {sale.vendedor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-2xl text-orange-400">R$ {sale.total.toLocaleString()}</span>
                    <ArrowRight size={18} className="text-zinc-600" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};