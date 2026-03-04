import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Barcode, Trash2, Smartphone, Zap } from 'lucide-react';

export const PDV = () => {
  const { products } = useStore();
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter((p: any) => 
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (p: any) => {
    setCart([...cart, { ...p, cartId: Math.random() }]);
    setSearch('');
    inputRef.current?.focus();
  };

  const handleRemove = (id: number) => {
    if (prompt("PIN de Gerente:") === "2307") {
      setCart(cart.filter(i => i.cartId !== id));
    }
  };

  const total = cart.reduce((acc, i) => acc + i.price, 0);

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:p-6 bg-zinc-950 text-white min-h-screen pb-32">
      <div className="col-span-8 flex flex-col gap-4">
        <div className="relative">
          <Barcode className="absolute left-4 top-4 text-zinc-500" />
          <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Bipe ou busque o aparelho..." className="w-full bg-zinc-900 border border-zinc-800 p-5 pl-14 rounded-3xl focus:outline-none focus:ring-2" style={{'--tw-ring-color': 'var(--primary-color)'} as any} autoFocus />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[70vh]">
          {filtered.map((p: any) => (
            <button key={p.id} onClick={() => addToCart(p)} className="bg-zinc-900 p-5 rounded-[2rem] border border-zinc-800 text-left h-40 flex flex-col justify-between hover:border-zinc-500">
              <span className="text-[10px] font-black text-zinc-600 uppercase italic">{p.category}</span>
              <h3 className="font-bold text-sm">{p.name}</h3>
              <p className="font-mono text-xl font-bold" style={{color: 'var(--primary-color)'}}>R$ {p.price.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="col-span-4 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 p-8 flex flex-col shadow-2xl">
        <h2 className="text-2xl font-black italic mb-6 flex items-center gap-2 uppercase tracking-tighter"><ShoppingCart style={{color: 'var(--primary-color)'}}/> Caixa</h2>
        <div className="flex-1 overflow-y-auto space-y-3 mb-6">
          {cart.map(i => (
            <div key={i.cartId} className="flex justify-between items-center bg-zinc-800/40 p-3 rounded-2xl border border-zinc-700/30 text-xs">
              <span className="font-bold truncate w-32">{i.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">R$ {i.price.toLocaleString()}</span>
                <button onClick={() => handleRemove(i.cartId)} className="p-2 bg-red-500/10 rounded-full text-red-500"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-800 pt-4">
          <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Total</p>
          <p className="text-3xl font-black font-mono mb-6 italic">R$ {total.toLocaleString()}</p>
          <button onClick={() => { alert("Venda Finalizada!"); setCart([]); }} className="w-full py-5 rounded-2xl font-black italic uppercase shadow-xl" style={{backgroundColor: 'var(--primary-color)', color: '#000'}}>Finalizar <Zap className="inline" size={16}/></button>
        </div>
      </div>
    </div>
  );
};