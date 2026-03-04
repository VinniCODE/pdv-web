import React from 'react';
import { useStore } from '../context/StoreContext';
import { Wallet, Percent, TrendingUp, Award, AlertCircle } from 'lucide-react';

export const Comissoes = () => {
  const { user, performance, commissionRate, setCommissionRate } = useStore();

  // Bloqueio de Segurança: Apenas Admin vê esta aba
  if (user?.role !== 'admin') {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={64} className="text-red-500 mb-4 opacity-20" />
        <h2 className="text-2xl font-black uppercase italic">Acesso Negado</h2>
        <p className="text-zinc-500 text-sm mt-2">Apenas o Sidney (Admin) pode gerenciar comissões.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
            <Wallet className="text-blue-500" size={48} /> Comissões
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Gestão de Bônus e Incentivos</p>
        </div>

        {/* Ajuste de Taxa Responsivo */}
        <div className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800 flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500"><Percent size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase">Taxa Global</p>
            <input 
              type="number" 
              className="bg-transparent border-none text-xl font-black text-white w-16 focus:outline-none"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performance.ranking.map(([nome, dados]: any) => (
          <div key={nome} className="bg-zinc-950 border-2 border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500 transition-all">
            <TrendingUp className="absolute -right-4 -bottom-4 text-blue-500/5 group-hover:scale-125 transition-transform" size={120} />
            
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-blue-500 transition-colors">
                <Award size={28} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-zinc-600 uppercase">Vendas</p>
                <p className="font-mono font-black text-lg">{dados.count}</p>
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase italic mb-1">{nome}</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8">Colaborador Ativo</p>

            <div className="space-y-3 relative z-10">
              <div className="flex justify-between text-sm font-bold border-b border-zinc-900 pb-3">
                <span className="text-zinc-500">Total Produzido</span>
                <span>R$ {dados.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Bônus a Pagar</span>
                <span className="text-4xl font-mono font-black text-white">R$ {dados.comissao.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};