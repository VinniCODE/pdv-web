import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldAlert, Activity, Search } from 'lucide-react';

export const Auditoria = () => {
  const { logs } = useStore();
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((log: any) => 
    log.operadorNome.toLowerCase().includes(search.toLowerCase()) || 
    log.acao.toLowerCase().includes(search.toLowerCase()) ||
    log.detalhes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-zinc-950 text-white min-h-screen pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <ShieldAlert className="text-orange-500" size={36} /> Logs de Segurança
          </h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Auditoria Antifraude e Rastreio de Operadores</p>
        </div>
        <div className="bg-orange-500/10 text-orange-500 px-6 py-3 rounded-2xl font-black uppercase italic text-xs tracking-widest flex items-center gap-2 border border-orange-500/20">
          <Activity size={18} /> Rastreamento Ativo
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
        <div className="p-6 border-b border-zinc-800 relative">
          <Search className="absolute left-10 top-10 text-zinc-500" size={18} />
          <input 
            placeholder="Pesquisar por Operador, PIN, Ação ou Detalhe..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl text-white font-bold outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 text-[10px] font-black uppercase border-b border-zinc-800 pb-4">
                <th className="pb-4">Data / Hora</th>
                <th className="pb-4">Código (PIN)</th>
                <th className="pb-4">Operador</th>
                <th className="pb-4">Ação</th>
                <th className="pb-4">Detalhes do Evento</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log: any) => (
                <tr key={log.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-all text-sm">
                  <td className="py-5 font-mono text-zinc-400 text-xs">
                    {new Date(log.data).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-5">
                    <span className="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-md font-mono font-black text-orange-500 tracking-widest">
                      {log.operadorPin}
                    </span>
                  </td>
                  <td className="py-5 font-bold uppercase italic text-zinc-300">
                    {log.operadorNome}
                  </td>
                  <td className="py-5">
                    <span className="bg-zinc-800 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      {log.acao}
                    </span>
                  </td>
                  <td className="py-5 text-zinc-400 font-medium italic">
                    {log.detalhes}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-zinc-600 font-black uppercase italic tracking-widest">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};