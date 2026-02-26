// src/views/Inventory.tsx
import { useState } from 'react';
import { Plus, Search, AlertTriangle, Edit, Trash2, X, Save, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Product, ProductCategory } from '../types/inventory';

export function Inventory() {
  // Puxando os dados e funções do Cérebro Global
  const { products, addProduct, deleteProduct } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Formulário
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'tenant_id' | 'status'>>({
    name: '', sku: '', category: 'Smartphones', price: 0, cost_price: 0, stock_current: 0, stock_minimum: 0, unit_measure: 'UN'
  });

  // Filtro de busca na tabela
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(formData); // Salva no contexto global
    setIsModalOpen(false); 
    setFormData({ name: '', sku: '', category: 'Smartphones', price: 0, cost_price: 0, stock_current: 0, stock_minimum: 0, unit_measure: 'UN' }); 
  };

  return (
    <div className="flex flex-col space-y-6 h-full relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Inventário</h2>
          <p className="text-gray-400 mt-1">Gestão de catálogo e níveis de estoque.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-aurora-primary hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Busca */}
      <div className="bg-aurora-card p-4 rounded-2xl border border-aurora-border flex items-center gap-4 shadow-sm">
        <div className="bg-aurora-dark p-3 rounded-xl border border-aurora-border">
          <Search className="text-aurora-primary" size={20} />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar no inventário por nome ou SKU..." 
          className="flex-1 bg-transparent text-white focus:outline-none placeholder-gray-500 font-mono"
        />
      </div>

      {/* Tabela */}
      <div className="bg-aurora-card rounded-2xl border border-aurora-border flex-1 overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-aurora-border bg-black/20">
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">SKU</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Produto</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Categoria</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Preço (Venda)</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Estoque Atual</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aurora-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#2C2C2E] transition-colors">
                  <td className="p-4 text-gray-400 text-sm font-mono">{product.sku}</td>
                  <td className="p-4 font-bold text-white">{product.name}</td>
                  <td className="p-4">
                    <span className="bg-black/50 border border-aurora-border text-gray-300 text-xs px-2.5 py-1 rounded-md">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-aurora-primary font-bold">
                    R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 font-bold ${product.stock_current <= product.stock_minimum ? 'text-red-400' : 'text-green-400'}`}>
                        <Package size={14} />
                        {product.stock_current} {product.unit_measure}
                      </span>
                      {product.stock_current <= product.stock_minimum && (
                        <div className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-0.5 rounded-md text-xs font-bold border border-red-400/20">
                          <AlertTriangle size={12} />
                          Repor
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button className="text-gray-500 hover:text-aurora-primary transition-colors p-2 bg-black/30 rounded-lg border border-transparent hover:border-aurora-primary/30" title="Editar">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="text-gray-500 hover:text-red-400 transition-colors p-2 bg-black/30 rounded-lg border border-transparent hover:border-red-400/30" title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Nenhum produto encontrado no inventário.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-aurora-card border border-aurora-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-aurora-border bg-black/20">
              <h3 className="text-xl font-bold text-white">Cadastrar Novo Produto</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Nome do Produto *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary transition-colors" placeholder="Ex: iPad Pro M4 256GB" />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Código SKU *</label>
                  <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value.toUpperCase()})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-aurora-primary transition-colors" placeholder="IPAD-PRO-M4" />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Categoria *</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ProductCategory})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary transition-colors appearance-none cursor-pointer">
                    <option value="Smartphones">Smartphones / Tablets</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Serviços">Serviços</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Preço de Custo (R$)</label>
                  <input type="number" step="0.01" value={formData.cost_price} onChange={e => setFormData({...formData, cost_price: Number(e.target.value)})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary transition-colors" />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Preço de Venda (R$) *</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-aurora-primary font-bold focus:outline-none focus:border-aurora-primary transition-colors" />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Estoque Inicial</label>
                  <input type="number" value={formData.stock_current} onChange={e => setFormData({...formData, stock_current: Number(e.target.value)})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary transition-colors" />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Estoque Mínimo (Alerta)</label>
                  <input type="number" value={formData.stock_minimum} onChange={e => setFormData({...formData, stock_minimum: Number(e.target.value)})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary transition-colors" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-aurora-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#3A3A3C] transition-colors font-bold">
                  Cancelar
                </button>
                <button type="submit" className="bg-aurora-primary hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg">
                  <Save size={20} />
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}