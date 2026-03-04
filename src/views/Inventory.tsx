import React from 'react';
import { useStore } from '../context/StoreContext';
import { Smartphone, PlusCircle, Edit3, ShieldCheck, FileDigit } from 'lucide-react';

export const Inventory = () => {
  const { products, updateProduct, addProduct } = useStore();

  const handleAddNew = () => {
    if (prompt("PIN de Gerente:") !== "2307") return alert("PIN INCORRETO.");
    const name = prompt("Nome completo do aparelho:");
    const sku = prompt("SKU/Modelo:");
    const price = Number(prompt("Preço de Venda:"));
    const cost = Number(prompt("Preço de Custo:"));
    const stock = Number(prompt("Qtd Inicial:"));
    const category = prompt("Categoria (Apple/Android/Acessório):", "Apple");
    const ncm = prompt("Código NCM (Nomenclatura Comum Mercosul):", "8517.13.00");
    const cfop = prompt("Código CFOP (Padrão Venda):", "5102");
    const imei = prompt("Digite o IMEI para registro inicial:");

    if (name && imei) {
      addProduct({ name, sku, price, cost, stock, category, ncm, cfop, lastImei: imei });
      alert("✅ Item cadastrado com sucesso!");
    }
  };

  const handleEdit = (p: any) => {
    if (prompt("PIN de Gerente:") !== "2307") return alert("PIN INCORRETO.");
    const imei = prompt(`Digite o IMEI do ${p.name} para autorizar a edição:`);
    if (!imei) return alert("IMEI Obrigatório.");

    const upPrice = Number(prompt("Novo Preço Venda:", p.price));
    const upStock = Number(prompt("Nova Qtd:", p.stock));
    const upNcm = prompt("Atualizar NCM:", p.ncm || "8517.13.00");
    
    updateProduct(p.id, { price: upPrice, stock: upStock, ncm: upNcm, lastImei: imei });
  };

  return (
    <div className="p-8 bg-zinc-950 text-white min-h-screen pb-32">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Almoxarifado</h2>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-2">Segurança e Dados Fiscais Ativos</p>
        </div>
        <button onClick={handleAddNew} className="bg-blue-600 px-8 py-5 rounded-[1.5rem] font-black italic flex items-center gap-3 uppercase text-xs hover:bg-white hover:text-black transition-all shadow-2xl">
          <PlusCircle size={20}/> Cadastrar Lote
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((p: any) => (
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center hover:border-zinc-500 transition-all">
            <div className="flex items-center gap-8 w-full md:w-1/3">
              <div className="p-6 rounded-3xl bg-black/50 border border-zinc-800 flex items-center justify-center text-zinc-600"><Smartphone size={32} /></div>
              <div>
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{p.sku}</p>
                <h3 className="font-black text-xl uppercase italic mb-1">{p.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {p.lastImei && <span className="text-[9px] text-blue-500 font-mono italic flex items-center gap-1"><ShieldCheck size={10}/> {p.lastImei}</span>}
                  <span className="text-[9px] text-zinc-400 font-mono italic flex items-center gap-1 border border-zinc-700 px-2 rounded-md"><FileDigit size={10}/> NCM: {p.ncm || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-16 my-8 md:my-0">
               <div className="text-center"><p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Custo Médio</p><span className="text-sm font-mono text-zinc-500 italic">R$ {p.cost?.toLocaleString()}</span></div>
               <div className="text-center"><p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Venda Final</p><span className="text-2xl font-mono font-black text-white">R$ {p.price?.toLocaleString()}</span></div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center min-w-[100px]"><p className="text-[9px] text-zinc-600 font-black uppercase mb-1 tracking-widest">Saldo</p><span className={`text-4xl font-mono font-black ${p.stock < 5 ? 'text-red-500' : 'text-white'}`}>{p.stock}</span></div>
              <button onClick={() => handleEdit(p)} className="p-5 bg-zinc-800 rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl"><Edit3 size={24} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};