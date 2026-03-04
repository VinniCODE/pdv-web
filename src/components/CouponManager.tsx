import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Ticket, Plus, Ban, CheckCircle, Percent, Banknote, X } from 'lucide-react';

export const CouponManager = () => {
  const { coupons, addCoupon, toggleCoupon } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newC, setNewC] = useState({ code: '', discount: 0, type: 'fixed', limit: 10 });

  return (
    <div className="p-4 md:p-8 bg-zinc-950 text-white min-h-screen pb-24">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Central de Cupons</h2>
        <button onClick={() => setShowModal(true)} className="bg-white text-black px-6 py-4 rounded-2xl font-black italic flex items-center gap-2 hover:scale-105 transition-all uppercase text-xs">
          <Plus size={18}/> Novo Cupom
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((c: any) => (
          <div key={c.id} className={`bg-zinc-900 border ${c.active ? 'border-zinc-800' : 'border-red-900/40 opacity-50'} rounded-[2.5rem] p-8 relative`}>
            <div className="flex justify-between mb-6">
              <div className="bg-zinc-800 p-4 rounded-3xl"><Ticket className={c.active ? 'text-blue-500' : 'text-zinc-600'} size={24} /></div>
              <button onClick={() => toggleCoupon(c.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${c.active ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {c.active ? <Ban size={14} className="inline mr-1"/> : <CheckCircle size={14} className="inline mr-1"/>}
                {c.active ? 'Desativar' : 'Ativar'}
              </button>
            </div>
            <h3 className="text-3xl font-black italic mb-6 font-mono tracking-tighter uppercase">{c.code}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-2xl border border-zinc-800"><p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Desconto</p><span className="text-lg font-bold">{c.type === 'fixed' ? `R$ ${c.discount}` : `${c.discount}%`}</span></div>
              <div className="bg-black/30 p-4 rounded-2xl border border-zinc-800"><p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Usos</p><span className="text-lg font-mono font-bold">{c.used} / {c.limit}</span></div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-[600] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-zinc-900 w-full max-w-md rounded-[3rem] border border-zinc-800 p-10">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black italic uppercase">Configurar Cupom</h2><button onClick={() => setShowModal(false)}><X/></button></div>
            <div className="space-y-6">
              <div className="flex flex-col gap-2"><label className="text-[10px] font-black text-zinc-500 uppercase">Código</label><input className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl font-black uppercase italic" value={newC.code} onChange={e => setNewC({...newC, code: e.target.value.toUpperCase()})} placeholder="PROMO2026"/></div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setNewC({...newC, type: 'fixed'})} className={`p-4 rounded-2xl border ${newC.type === 'fixed' ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-800'}`}><Banknote className="mx-auto mb-2"/><span className="text-[9px] font-black uppercase">Fixo R$</span></button>
                <button onClick={() => setNewC({...newC, type: 'percent'})} className={`p-4 rounded-2xl border ${newC.type === 'percent' ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-800'}`}><Percent className="mx-auto mb-2"/><span className="text-[9px] font-black uppercase">Perc %</span></button>
              </div>
              <div className="flex flex-col gap-2"><label className="text-[10px] font-black text-zinc-500 uppercase">Valor</label><input type="number" className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl font-mono font-bold" value={newC.discount} onChange={e => setNewC({...newC, discount: Number(e.target.value)})}/></div>
              <div className="flex flex-col gap-2"><label className="text-[10px] font-black text-zinc-500 uppercase">Limite Global</label><input type="number" className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl font-mono font-bold" value={newC.limit} onChange={e => setNewC({...newC, limit: Number(e.target.value)})}/></div>
              <button onClick={() => { addCoupon(newC); setShowModal(false); }} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] shadow-xl mt-4">Ativar Promoção</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};