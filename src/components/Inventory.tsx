import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  LayoutGrid, 
  Search, 
  Plus, 
  Package, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Smartphone, 
  Laptop, 
  Watch, 
  MoreVertical 
} from 'lucide-react';

export const Inventory = () => {
  const { products, updateProduct, addLog } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtragem dinâmica para busca rápida
  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdjustStock = (id: string, currentStock: number) => {
    const newStock = window.prompt("Digite a nova quantidade em estoque:", currentStock.toString());
    if (newStock !== null) {
      updateProduct(id, { stock: parseInt(newStock) });
      addLog('ESTOQUE_ALTERADO', `Ajuste manual de estoque para o item ID: ${id}`);
    }
  };

  // Ícones dinâmicos por categoria
  const getCategoryIcon = (category: string) => {
    if (category.includes('Apple') || category.includes('Smartphone')) return <Smartphone size={24} />;
    if (category.includes('Computadores') || category.includes('Laptop')) return <Laptop size={24} />;
    if (category.includes('Watch') || category.includes('Acessórios')) return <Watch size={24} />;
    return <Package size={24} />;
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen pb-32">
      
      {/* CABEÇALHO DE GESTÃO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
            <LayoutGrid className="text-blue-500" size={48} /> Estoque <span className="text-zinc-800">/ Almoxarifado</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Controle de Ativos e Mercadorias</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-5 top-5 text-zinc-600" size={20} />
            <input 
              type="text" 
              placeholder="PESQUISAR ITEM OU CATEGORIA..."
              className="w-full bg-zinc-900 border-2 border-zinc-800 p-5 pl-14 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all uppercase text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 hover:bg-white hover:text-black text-white px-8 py-5 rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
            <Plus size={20} /> Novo Produto
          </button>
        </div>
      </div>

      {/* GRADE DE PRODUTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((p: any) => (
          <div key={p.id} className="bg-zinc-950 border-2 border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500 transition-all shadow-2xl">
            
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center text-zinc-700 group-hover:text-blue-500 transition-colors">
                {getCategoryIcon(p.category)}
              </div>
              <div className="flex flex-col items-end">
                {p.stock <= 3 ? (
                  <span className="bg-red-500/10 text-red-500 text-[9px] font-black px-4 py-2 rounded-full border border-red-500/20 mb-2 flex items-center gap-2 animate-pulse">
                    <AlertTriangle size={12} /> ESTOQUE BAIXO
                  </span>
                ) : (
                  <span className="bg-green-500/10 text-green-500 text-[9px] font-black px-4 py-2 rounded-full border border-green-500/20 mb-2 uppercase">Disponível</span>
                )}
                <button className="text-zinc-800 hover:text-white transition-colors p-2"><MoreVertical size={20}/></button>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">{p.category}</p>
              <h3 className="text-2xl font-black uppercase italic leading-none">{p.name}</h3>
              <p className="text-zinc-500 text-xs font-mono mt-2">{p.storage} • {p.color}</p>
            </div>

            {/* FINANCEIRO DO ITEM */}
            <div className="space-y-4 border-t border-zinc-900 pt-8 relative z-10">
              <div className="flex justify-between items-center bg-black p-5 rounded-2xl border border-zinc-900">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-600 uppercase">Preço de Venda</span>
                  <span className="font-mono font-black text-xl text-blue-500">R$ {p.price.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-zinc-600 uppercase">Estoque Real</span>
                  <p className="font-mono font-black text-2xl text-white">{p.stock} <span className="text-xs text-zinc-700">un</span></p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => handleAdjustStock(p.id, p.stock)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 p-4 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 border border-zinc-800 transition-all"
                >
                  <Edit3 size={14} /> Ajustar Qtd
                </button>
                <button className="p-4 bg-zinc-900 hover:bg-red-900/20 hover:text-red-500 rounded-xl border border-zinc-800 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Decoração de fundo */}
            <LayoutGrid className="absolute -right-6 -bottom-6 text-blue-500/5 group-hover:scale-125 transition-transform" size={140} />
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
          <Package size={80} className="mb-4" />
          <p className="font-black uppercase italic text-2xl tracking-tighter">Item não catalogado</p>
        </div>
      )}

    </div>
  );
};