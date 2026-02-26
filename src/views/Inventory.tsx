// src/views/Inventory.tsx
import { useState } from 'react';
import { Plus, Search, AlertTriangle, ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { Product } from '../types/inventory';

export function Inventory() {
  // Mock de dados reais da "Sidney Iphones"
  const [products] = useState<Product[]>([
    { id: '1', tenant_id: 'sidney-001', name: 'iPhone 15 Pro Max 256GB - Titânio Natural', sku: 'IPH-15PM-256-TN', category: 'Smartphones', price: 7499.00, cost_price: 6200.00, stock_current: 2, stock_minimum: 3, unit_measure: 'UN', status: 'ACTIVE' },
    { id: '2', tenant_id: 'sidney-001', name: 'iPhone 13 128GB - Meia-noite', sku: 'IPH-13-128-MN', category: 'Smartphones', price: 3599.00, cost_price: 2900.00, stock_current: 8, stock_minimum: 4, unit_measure: 'UN', status: 'ACTIVE' },
    { id: '3', tenant_id: 'sidney-001', name: 'Apple Watch Series 9 45mm', sku: 'AW-S9-45', category: 'Wearables', price: 2899.00, cost_price: 2100.00, stock_current: 1, stock_minimum: 2, unit_measure: 'UN', status: 'ACTIVE' },
    { id: '4', tenant_id: 'sidney-001', name: 'Carregador Fonte 20W Original Apple', sku: 'ACC-FONTE-20W', category: 'Acessórios', price: 179.00, cost_price: 85.00, stock_current: 4, stock_minimum: 15, unit_measure: 'UN', status: 'ACTIVE' },
    { id: '5', tenant_id: 'sidney-001', name: 'Película de Vidro 3D Premium', sku: 'ACC-PEL-3D', category: 'Acessórios', price: 50.00, cost_price: 12.00, stock_current: 45, stock_minimum: 20, unit_measure: 'UN', status: 'ACTIVE' },
  ]);

  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Estoque da Loja</h2>
          <p className="text-gray-400 mt-1">Gestão de aparelhos e acessórios da Sidney Iphones.</p>
        </div>
        <button className="bg-aurora-primary hover:bg-aurora-primary/80 text-aurora-dark font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,209,255,0.3)]">
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Busca e Filtros */}
      <div className="flex gap-4 bg-aurora-card p-4 rounded-xl border border-aurora-border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por modelo, SKU ou categoria..." 
            className="w-full bg-aurora-dark border border-aurora-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-aurora-primary transition-colors"
          />
        </div>
        <button className="bg-aurora-dark border border-aurora-border hover:border-gray-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <ArrowUpDown size={20} />
          Filtrar
        </button>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-aurora-card rounded-xl border border-aurora-border flex-1 overflow-hidden flex flex-col shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-aurora-border bg-aurora-dark/50">
                <th className="p-4 text-gray-400 font-medium text-sm">SKU</th>
                <th className="p-4 text-gray-400 font-medium text-sm">Produto</th>
                <th className="p-4 text-gray-400 font-medium text-sm">Categoria</th>
                <th className="p-4 text-gray-400 font-medium text-sm">Preço (Venda)</th>
                <th className="p-4 text-gray-400 font-medium text-sm">Estoque Atual</th>
                <th className="p-4 text-gray-400 font-medium text-sm text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aurora-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-aurora-dark/30 transition-colors">
                  <td className="p-4 text-gray-400 text-sm font-mono">{product.sku}</td>
                  <td className="p-4 font-medium text-white">{product.name}</td>
                  <td className="p-4">
                    <span className="bg-aurora-dark border border-aurora-border text-gray-300 text-xs px-2.5 py-1 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-aurora-primary font-medium">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${product.stock_current <= product.stock_minimum ? 'text-red-400' : 'text-green-400'}`}>
                        {product.stock_current} {product.unit_measure}
                      </span>
                      {product.stock_current <= product.stock_minimum && (
                        <div className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs font-medium border border-red-400/20">
                          <AlertTriangle size={14} />
                          Repor
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 flex justify-end gap-3">
                    <button className="text-gray-400 hover:text-aurora-primary transition-colors p-1" title="Editar Produto">
                      <Edit size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-red-400 transition-colors p-1" title="Excluir Produto">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}