// src/views/Movements.tsx
import { useState } from 'react';
import { ArrowRightLeft, Search, Plus, ArrowDownRight, ArrowUpRight, Filter, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { StockMovement } from '../types/inventory';

export function Movements() {
  const { movements, products, registerMovement } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<Omit<StockMovement, 'id' | 'tenant_id' | 'date' | 'operator_id'>>({
    product_id: '', type: 'IN', quantity: 1
  });

  // Filtro de busca no histórico
  const filteredMovements = movements.filter(m => 
    m.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.operator_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    registerMovement(formData);
    setIsModalOpen(false);
    setFormData({ product_id: '', type: 'IN', quantity: 1 });
  };

  const getMovementIcon = (type: string) => {
    if (type === 'IN') return <ArrowDownRight className="text-green-400" size={18} />;
    if (type === 'OUT') return <ArrowUpRight className="text-red-400" size={18} />;
    return <ArrowRightLeft className="text-aurora-accent" size={18} />;
  };

  const getMovementLabel = (type: string) => {
    if (type === 'IN') return <span className="text-green-400 bg-green-400/10 px-2.5 py-1 rounded-md text-xs font-bold border border-green-400/20">ENTRADA</span>;
    if (type === 'OUT') return <span className="text-red-400 bg-red-400/10 px-2.5 py-1 rounded-md text-xs font-bold border border-red-400/20">SAÍDA</span>;
    return <span className="text-aurora-accent bg-aurora-accent/10 px-2.5 py-1 rounded-md text-xs font-bold border border-aurora-accent/20">AJUSTE</span>;
  };

  return (
    <div className="flex flex-col space-y-6 h-full relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Movimentações</h2>
          <p className="text-gray-400 mt-1">Histórico em tempo real de entradas, saídas e vendas do PDV.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-aurora-primary hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-colors shadow-lg">
          <Plus size={20} />
          Registo Manual
        </button>
      </div>

      <div className="flex gap-4 bg-aurora-card p-4 rounded-2xl border border-aurora-border shadow-sm">
        <div className="flex-1 flex items-center gap-4">
          <div className="bg-aurora-dark p-3 rounded-xl border border-aurora-border">
            <Search className="text-aurora-primary" size={20} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por produto ou operador..." 
            className="flex-1 bg-transparent text-white focus:outline-none placeholder-gray-500 font-mono"
          />
        </div>
        <button className="bg-black/40 border border-aurora-border hover:border-gray-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
          <Filter size={20} />
          Filtrar
        </button>
      </div>

      <div className="bg-aurora-card rounded-2xl border border-aurora-border flex-1 overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-aurora-border bg-black/20">
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Data/Hora</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Tipo</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Produto</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Quantidade</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Operador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aurora-border">
              {filteredMovements.map((mov) => (
                <tr key={mov.id} className="hover:bg-[#2C2C2E] transition-colors">
                  <td className="p-4 text-gray-400 text-sm font-mono">
                    {new Date(mov.date).toLocaleString('pt-BR')}
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    {getMovementIcon(mov.type)}
                    {getMovementLabel(mov.type)}
                  </td>
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <Package size={16} className="text-gray-500" />
                    {mov.product_id}
                  </td>
                  <td className="p-4 text-white font-bold text-lg">{mov.quantity} un</td>
                  <td className="p-4 text-gray-400 text-sm">{mov.operator_id}</td>
                </tr>
              ))}
              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Nenhuma movimentação registada no sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-aurora-card border border-aurora-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-aurora-border bg-black/20">
              <h3 className="text-xl font-bold text-white">Registar Movimentação</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSaveMovement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Produto *</label>
                <select required value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary appearance-none cursor-pointer">
                  <option value="" disabled>Selecione um produto do inventário</option>
                  {products.map(p => (
                    <option key={p.id} value={p.sku}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Tipo de Movimentação *</label>
                <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary appearance-none cursor-pointer">
                  <option value="IN">Entrada (Compra/Reposição)</option>
                  <option value="OUT">Saída (Consumo/Perda)</option>
                  <option value="ADJUSTMENT">Ajuste de Inventário</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Quantidade *</label>
                <input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary" />
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-aurora-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#3A3A3C] transition-colors font-bold">Cancelar</button>
                <button type="submit" className="bg-aurora-primary hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}