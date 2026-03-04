import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Landmark, ArrowUpCircle, ArrowDownCircle, 
  Calendar, CheckCircle2, Clock, PieChart, 
  Plus, TrendingDown, X, DollarSign 
} from 'lucide-react';

export const Financeiro = () => {
  const { transacoes, performance, baixarTransacao, addTransacao } = useStore();
  
  // Estado para o Modal de Nova Despesa
  const [showModal, setShowModal] = useState(false);
  const [novaDespesa, setNovaDespesa] = useState({
    descricao: '',
    valor: '',
    vencimento: new Date().toISOString().split('T')[0]
  });

  const dre = useMemo(() => {
    const receitas = performance.totalVendido;
    const despesasPagas = transacoes
      .filter((t: any) => t.tipo === 'DESPESA' && t.status === 'PAGO')
      .reduce((acc: number, t: any) => acc + t.valor, 0);
    const despesasPendentes = transacoes
      .filter((t: any) => t.tipo === 'DESPESA' && t.status === 'PENDENTE')
      .reduce((acc: number, t: any) => acc + t.valor, 0);
    
    return {
      bruto: receitas,
      liquido: receitas - despesasPagas,
      pendente: despesasPendentes
    };
  }, [transacoes, performance.totalVendido]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaDespesa.descricao || !novaDespesa.valor) return;

    addTransacao({
      tipo: 'DESPESA',
      descricao: novaDespesa.descricao,
      valor: parseFloat(novaDespesa.valor),
      vencimento: novaDespesa.vencimento,
      status: 'PENDENTE'
    });

    setShowModal(false);
    setNovaDespesa({ descricao: '', valor: '', vencimento: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen pb-32">
      
      {/* CABEÇALHO FINANCEIRO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
            <Landmark className="text-green-500" size={48} /> Finanças <span className="text-zinc-800">/ DRE</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Gestão de Fluxo e Lucratividade Real</p>
        </div>

        {/* BOTÃO ATUALIZADO */}
        <button 
          onClick={() => setShowModal(true)}
          className="bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black text-white px-8 py-5 rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={20} /> Nova Despesa
        </button>
      </div>

      {/* MODAL DE CADASTRO (RESPONSIVO) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border-2 border-zinc-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Lançar Despesa</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white"><X size={24}/></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block">Descrição da Conta</label>
                <input 
                  autoFocus
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold focus:border-blue-500 outline-none uppercase text-sm"
                  placeholder="Ex: Aluguel, Internet, Reposição..."
                  value={novaDespesa.descricao}
                  onChange={e => setNovaDespesa({...novaDespesa, descricao: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block">Valor (R$)</label>
                  <input 
                    type="number"
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold focus:border-blue-500 outline-none"
                    placeholder="0.00"
                    value={novaDespesa.valor}
                    onChange={e => setNovaDespesa({...novaDespesa, valor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block">Vencimento</label>
                  <input 
                    type="date"
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold focus:border-blue-500 outline-none text-zinc-400"
                    value={novaDespesa.vencimento}
                    onChange={e => setNovaDespesa({...novaDespesa, vencimento: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-white hover:text-black transition-all">
                Salvar Lançamento
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CARDS E LISTAGEM (Continua igual ao anterior) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border-2 border-zinc-900 relative overflow-hidden">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-2">Receita Bruta</p>
          <p className="text-4xl font-black font-mono text-white">R$ {dre.bruto.toLocaleString()}</p>
        </div>

        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border-2 border-blue-600/20 relative overflow-hidden">
          <p className="text-blue-500/50 text-[10px] font-black uppercase tracking-widest mb-2">Lucro Líquido</p>
          <p className="text-4xl font-black font-mono text-blue-500">R$ {dre.liquido.toLocaleString()}</p>
        </div>

        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border-2 border-red-900/20 relative overflow-hidden">
          <p className="text-red-500/50 text-[10px] font-black uppercase tracking-widest mb-2">Pendências</p>
          <p className="text-4xl font-black font-mono text-red-500">R$ {dre.pendente.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-zinc-900/30 rounded-[3rem] border border-zinc-900 p-6 md:p-10">
        <h3 className="text-2xl font-black italic uppercase mb-8 flex items-center gap-3">
          <Calendar className="text-zinc-500" /> Fluxo de Caixa
        </h3>

        <div className="space-y-4">
          {transacoes.map((t: any) => (
            <div key={t.id} className="bg-black border border-zinc-800 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4 hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className={`p-4 rounded-2xl ${t.tipo === 'RECEITA' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {t.tipo === 'RECEITA' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                </div>
                <div>
                  <p className="font-black uppercase text-sm text-white group-hover:text-blue-500 transition-colors">{t.descricao}</p>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase mt-1">Venc: {new Date(t.vencimento).toLocaleDateString()} • {t.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`text-2xl font-mono font-black ${t.tipo === 'RECEITA' ? 'text-green-500' : 'text-white'}`}>
                  {t.tipo === 'DESPESA' ? '-' : ''} R$ {t.valor.toLocaleString()}
                </span>
                {t.status === 'PENDENTE' && (
                  <button onClick={() => baixarTransacao(t.id)} className="bg-zinc-800 hover:bg-green-600 text-white p-3 rounded-xl transition-all">
                    <CheckCircle2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};