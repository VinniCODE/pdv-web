import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Activity, 
  FileSearch,
  AlertCircle,
  ArrowDownCircle
} from 'lucide-react';

export const Auditoria = () => {
  const { logs } = useStore();
  const [filtro, setFiltro] = useState('');

  // Filtragem dinâmica dos logs para auditoria rápida
  const logsFiltrados = logs.filter((log: any) => 
    log.acao.toLowerCase().includes(filtro.toLowerCase()) || 
    log.operadorNome.toLowerCase().includes(filtro.toLowerCase()) ||
    log.detalhes.toLowerCase().includes(filtro.toLowerCase())
  );

  // Cores dinâmicas baseadas na gravidade da ação
  const getTagColor = (acao: string) => {
    if (acao.includes('LOGIN')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (acao.includes('VENDA')) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (acao.includes('DEVOLUÇÃO') || acao.includes('ESTORNO')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    if (acao.includes('ERRO') || acao.includes('FALHA')) return 'bg-red-500/10 text-red-500 border-red-500/20';
    return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen pb-32">
      
      {/* CABEÇALHO DE CONTROLE */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
            <ShieldAlert className="text-red-500" size={48} /> Auditoria <span className="text-zinc-800">/ Logs</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Rastreamento de Atividades do Sistema</p>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-5 top-5 text-zinc-600" size={20} />
          <input 
            type="text" 
            placeholder="FILTRAR POR OPERADOR OU AÇÃO..."
            className="w-full bg-zinc-900 border-2 border-zinc-800 p-5 pl-14 rounded-2xl font-bold focus:border-red-500 outline-none transition-all uppercase text-sm"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      {/* TIMELINE DE LOGS (RESPONSIVA) */}
      <div className="space-y-4">
        {logsFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <FileSearch size={80} className="mb-4" />
            <p className="font-black uppercase italic text-2xl tracking-tighter">Nenhum registro encontrado</p>
          </div>
        ) : (
          logsFiltrados.map((log: any) => (
            <div key={log.id} className="bg-zinc-950 border-2 border-zinc-900 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-zinc-700 transition-all">
              
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="hidden sm:flex p-4 bg-zinc-900 rounded-2xl text-zinc-600 border border-zinc-800 group-hover:text-white transition-colors">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-md border uppercase ${getTagColor(log.acao)}`}>
                      {log.acao}
                    </span>
                    <p className="text-zinc-500 text-[10px] font-mono">{new Date(log.data).toLocaleString()}</p>
                  </div>
                  <h3 className="text-xl font-black uppercase text-white leading-tight">{log.detalhes}</h3>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-zinc-900 pt-4 md:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                    <User size={18} className="text-zinc-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-zinc-600 uppercase leading-none">Operador</p>
                    <p className="text-sm font-bold text-zinc-300">{log.operadorNome}</p>
                  </div>
                </div>
                <ArrowDownCircle size={20} className="text-zinc-800 group-hover:text-zinc-400 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* RESUMO DE SEGURANÇA */}
      <div className="mt-10 p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex items-center gap-4">
        <AlertCircle className="text-red-500 shrink-0" size={24} />
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-relaxed">
          Os logs acima são protegidos e não podem ser apagados por operadores. <br />
          <span className="text-red-500/50 italic">Apenas o Sidney (Admin) tem acesso ao relatório completo de exportação.</span>
        </p>
      </div>

    </div>
  );
};