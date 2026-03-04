import React from 'react';
import { useStore } from '../context/StoreContext';
import { Smartphone, Edit3, PlusCircle } from 'lucide-react';

export const Inventory = () => {
  const { products, updateProduct, addProduct } = useStore();

  const handleAddNew = () => {
    if (prompt("PIN de Gerente:") !== "2307") return alert("PIN INCORRETO.");
    const name = prompt("Nome do Aparelho:");
    const sku = prompt("SKU/Modelo:");
    const price = Number(prompt("Preço de Venda:"));
    const cost = Number(prompt("Preço de Custo:"));
    const stock = Number(prompt("Quantidade Inicial:"));
    const category = prompt("Categoria (Apple/Android/Acessório):");
    const imei = prompt("IMEI para Registro:");

    if (name && imei) {
      addProduct({ name, sku, price, cost, stock, category, lastImei: imei });
      alert("✅ Produto cadastrado com sucesso!");
    }
  };

  const handleEdit = (p: any) => {
    if (prompt("PIN de Gerente:") !== "2307") return alert("PIN INCORRETO.");
    const imei = prompt(`Confirme o IMEI de ${p.name} para editar:`);
    if (!imei) return alert("IMEI Obrigatório.");

    const upPrice = Number(prompt("Novo Preço Venda:", p.price));
    const upStock = Number(prompt("Nova Qtd:", p.stock));
    updateProduct(p.id, { price: upPrice, stock: upStock, lastImei: imei });
  };

  return (
    <div className="p-4 md:p-8 bg-zinc-950 text-white min-h-screen pb-24">
      <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Estoque</h2>
        <button onClick={handleAddNew} className="bg-white text-black px-6 py-4 rounded-2xl font-black italic flex items-center gap-2 uppercase text-xs shadow-xl"><PlusCircle size={18}/> Novo Item</button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {products.map((p: any) => (
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 flex flex-col md:flex-row justify-between items-center hover:border-zinc-500 transition-all">
            <div className="flex items-center gap-6 w-full md:w-1/3">
              <div className="p-5 rounded-3xl bg-zinc-800 border border-zinc-700/50"><Smartphone className="text-zinc-500" /></div>
              <div>
                <p className="text-[10px] text-zinc-600 font-black uppercase">{p.sku}</p>
                <h3 className="font-bold text-lg uppercase italic">{p.name}</h3>
                {p.lastImei && <p className="text-[9px] text-blue-500 font-mono mt-1 italic">AUDIT: {p.lastImei}</p>}
              </div>
            </div>
            <div className="flex gap-10">
               <div className="text-center"><p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Custo</p><span className="text-sm font-mono text-zinc-500 italic">R$ {p.cost?.toLocaleString()}</span></div>
               <div className="text-center"><p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Venda</p><span className="text-xl font-mono font-bold">R$ {p.price?.toLocaleString()}</span></div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center min-w-[80px]"><p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Saldo</p><span className="text-3xl font-mono font-black">{p.stock}</span></div>
              <button onClick={() => handleEdit(p)} className="p-4 bg-zinc-800 rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl"><Edit3 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};