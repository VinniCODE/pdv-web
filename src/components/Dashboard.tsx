import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Eye, Target, TrendingUp, X, CreditCard, Calendar, Ticket } from 'lucide-react';

export const Dashboard = () => {
  const { config, performance } = useStore();
  const [selected, setSelected] = useState<any>(null);

  if (!performance?.ranking) return <div className="p-10 text-white">SINCRONIZANDO...</div>;

  return (
    <div className="p-4 md:p-8 bg-zinc-950 text-white min-h-screen pb-24">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-10 italic">Performance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800">
          <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 flex items-center gap-2"><Target size={12}/> Meta de Loja</p>
          <p className="text-4xl font-mono font-bold">R$ {config.monthlyGoal?.toLocaleString()}</p>
          <div className="mt-6 w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${performance.percentualMeta}%` }} />
          </div>
        </div>
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800">
          <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 flex items-center gap-2"><TrendingUp size={12}/> Faturamento Bruto</p>
          <p className="text-4xl font-mono font-bold text-green-500">R$ {performance.totalVendido?.toLocaleString()}</p>
          <p className="text-[10px] font-bold mt-4 italic text-zinc-500">{(performance.percentualMeta || 0).toFixed(1)}% ALCANÇADO</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-xl font-black italic uppercase tracking-tight">Ranking Equipe</h3>
        </div>
        <div className="p-8 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 text-[10px] font-black uppercase border-b border-zinc-800 pb-4">
                <th className="pb-4">Vendedor</th>
                <th className="pb-4 text-right">Faturamento</th>
                <th className="pb-4 text-center">Auditoria</th>
              </tr>
            </thead>
            <tbody>
              {performance.ranking.map(([nome, dados]: any, idx: number) => (
                <tr key={nome} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-all">
                  <td className="py-6 font-bold uppercase italic flex items-center gap-4">
                    <span className="text-2xl text-zinc-800 font-black">{idx + 1}º</span> {nome}
                  </td>
                  <td className="py-6 text-right font-mono font-bold text-xl" style={{color: 'var(--primary-color)'}}>R$ {dados.total?.toLocaleString()}</td>
                  <td className="py-6 text-center">
                    <button onClick={() => setSelected({nome, ...dados})} className="p-3 bg-zinc-800 rounded-2xl hover:bg-white hover:text-black transition-all"><Eye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-xl rounded-[3rem] border border-zinc-800 p-10 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-3xl font-black italic uppercase">{selected.nome}</h2>
              <button onClick={() => setSelected(null)} className="p-3 bg-zinc-800 rounded-full hover:bg-red-500 transition-all"><X/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
              {selected.history?.map((sale: any) => (
                <div key={sale.id} className="bg-black/30 border border-zinc-800 p-6 rounded-[2rem]">
                  <div className="flex justify-between mb-4">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-widest">VENDA #{sale.id}</span>
                    <span className="font-mono font-bold text-lg text-green-500">R$ {sale.total?.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-t border-zinc-800 pt-4 mt-2">
                    <div className="flex flex-col text-[10px]"><span className="text-zinc-600 font-black uppercase tracking-tighter italic">Pagamento</span><span className="font-bold uppercase italic">{sale.metodo}</span></div>
                    <div className="flex flex-col text-[10px]"><span className="text-zinc-600 font-black uppercase tracking-tighter italic">Parcelas</span><span className="font-bold uppercase italic">{sale.parcelas}x</span></div>
                    <div className="flex flex-col text-[10px]"><span className="text-zinc-600 font-black uppercase tracking-tighter italic">Cupom</span><span className="font-bold text-blue-500">{sale.cupom}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="mt-8 w-full py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};