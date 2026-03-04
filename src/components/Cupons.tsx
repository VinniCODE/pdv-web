import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Ticket, Plus, Trash2, X, Percent, DollarSign, AlertCircle } from 'lucide-react';

export const Cupons = () => {
  const { coupons, setCoupons, addLog } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [novoCupom, setNovoCupom] = useState({ code: '', discount: '', type: 'percent' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCupom.code || !novoCupom.discount) return;

    const cupomFinal = {
      ...novoCupom,
      id: Date.now().toString(),
      discount: parseFloat(novoCupom.discount),
      active: true
    };

    setCoupons([...coupons, cupomFinal]);
    addLog('CUPOM_CRIADO', `Novo cupom: ${novoCupom.code} (${novoCupom.discount}${novoCupom.type === 'percent' ? '%' : 'R$'})`);
    setShowModal(false);
    setNovoCupom({ code: '', discount: '', type: 'percent' });
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Excluir cupom ${code}?`)) {
      setCoupons(coupons.filter((c: any) => c.id !== id));
      addLog('CUPOM_REMOVIDO', `Cupom ${code} excluído.`);
    }
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
            <Ticket className="text-blue-500" size={48} /> Cupons <span className="text-zinc-800">/ Ofertas</span>
          </h2>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-white hover:text-black text-white px-8 py-5 rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all shadow-xl flex items-center gap-3"
        >
          <Plus size={20} /> Novo Cupom
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c: any) => (
          <div key={c.id} className="bg-zinc-950 border-2 border-zinc-900 p-8 rounded-[2.5rem] relative group hover:border-blue-500 transition-all">
            <div className="flex justify-between items-center mb-6">
              <div className="p-4 bg-zinc-900 rounded-2xl text-blue-500"><Ticket size={24} /></div>
              <button onClick={() => handleDelete(c.id, c.code)} className="text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
            </div>
            <h3 className="text-3xl font-black uppercase italic text-white mb-2">{c.code}</h3>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-mono font-black text-xl">
                {c.type === 'percent' ? `${c.discount}% OFF` : `R$ ${c.discount.toLocaleString()} OFF`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border-2 border-zinc-800 w-full max-w-md rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic">Criar Promoção</h3>
              <button onClick={() => setShowModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-6">
              <input 
                placeholder="CÓDIGO (EX: SIDNEY10)" 
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-black uppercase text-white outline-none focus:border-blue-500"
                value={novoCupom.code}
                onChange={e => setNovoCupom({...novoCupom, code: e.target.value.toUpperCase()})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" placeholder="VALOR" 
                  className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-black text-white outline-none"
                  value={novoCupom.discount}
                  onChange={e => setNovoCupom({...novoCupom, discount: e.target.value})}
                />
                <select 
                  className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-black text-white outline-none"
                  value={novoCupom.type}
                  onChange={e => setNovoCupom({...novoCupom, type: e.target.value})}
                >
                  <option value="percent">PORCENTAGEM (%)</option>
                  <option value="fixed">VALOR FIXO (R$)</option>
                </select>
              </div>
              <button className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase italic tracking-widest">Ativar Cupom</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};