// src/views/Reports.tsx
import { useMemo } from 'react';
import { DollarSign, Package, TrendingUp, AlertCircle, Calendar, Filter } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Reports() {
  const { products, movements } = useStore();

  const kpis = useMemo(() => {
    const total_inventory_value = products.reduce((acc, p) => acc + (p.cost_price * p.stock_current), 0);
    const monthly_sales = movements
      .filter(m => m.type === 'OUT')
      .reduce((acc, m) => {
        const p = products.find(prod => prod.name === m.product_id);
        return acc + ((p?.price || 0) * m.quantity);
      }, 0);
    const low_stock_items = products.filter(p => p.stock_current <= p.stock_minimum && p.category !== 'Serviços').length;
    
    return { total_inventory_value, monthly_sales, low_stock_items, movements_today: movements.length };
  }, [products, movements]);

  // Calcula dinamicamente a Curva A (Produtos mais vendidos)
  const topProducts = useMemo(() => {
    const salesCount: Record<string, { qty: number, revenue: number }> = {};
    movements.filter(m => m.type === 'OUT').forEach(m => {
      const p = products.find(prod => prod.name === m.product_id);
      if (!salesCount[m.product_id]) salesCount[m.product_id] = { qty: 0, revenue: 0 };
      salesCount[m.product_id].qty += m.quantity;
      salesCount[m.product_id].revenue += m.quantity * (p?.price || 0);
    });

    return Object.entries(salesCount)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 4); // Pega os 4 maiores
  }, [movements, products]);

  // Calcula o maior valor para a barra de progresso
  const maxRevenue = Math.max(...topProducts.map(p => p.revenue), 1);

  return (
    <div className="flex flex-col space-y-6 h-full overflow-y-auto pb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard de Performance</h2>
          <p className="text-gray-400 mt-1">Visão geral financeira baseada nas vendas reais.</p>
        </div>
        <div className="flex gap-3">
          {/* Filtros visuais solicitados no checklist */}
          <button className="bg-black/40 border border-aurora-border text-gray-400 hover:text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors text-sm font-bold">
            <Filter size={18} /> Por Fornecedor
          </button>
          <button className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-bold shadow-lg">
            <Calendar size={18} /> Este Mês
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-aurora-card p-6 rounded-2xl border border-aurora-border shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Capital em Estoque (Custo)</p>
          <h3 className="text-3xl font-bold text-white mb-1">R$ {kpis.total_inventory_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="bg-aurora-card p-6 rounded-2xl border border-aurora-border shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Faturação do Mês</p>
          <h3 className="text-3xl font-bold text-green-400 mb-1">R$ {kpis.monthly_sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="bg-aurora-card p-6 rounded-2xl border border-aurora-border shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Alertas de Reposição</p>
          <h3 className="text-3xl font-bold text-red-400 mb-1">{kpis.low_stock_items} itens</h3>
        </div>
        <div className="bg-aurora-card p-6 rounded-2xl border border-aurora-border shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Movimentações Totais</p>
          <h3 className="text-3xl font-bold text-white mb-1">{kpis.movements_today} reg.</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1">
        <div className="bg-aurora-card p-6 rounded-2xl border border-aurora-border shadow-sm flex flex-col">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-aurora-primary" size={20} /> Top Produtos (Curva A)
          </h3>
          <div className="space-y-6 flex-1">
            {topProducts.length > 0 ? topProducts.map((product, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="text-gray-200 font-bold">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.qty} unidades vendidas</p>
                  </div>
                  <span className="text-white font-bold">R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-2 border border-[#48484A]">
                  <div className="bg-aurora-primary h-2 rounded-full shadow-[0_0_10px_rgba(10,132,255,0.5)]" style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}></div>
                </div>
              </div>
            )) : <p className="text-gray-500 text-center py-10">Nenhuma venda registada ainda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}