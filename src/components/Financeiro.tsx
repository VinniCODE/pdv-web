import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Landmark, TrendingUp, TrendingDown, DollarSign, PlusCircle, CheckCircle, AlertCircle, X } from 'lucide-react';

export const Financeiro = () => {
  const { sales, transacoes, addTransacao, baixarTransacao } = useStore();
  const [modalNova, setModalNova] = useState(false);
  const [novaTransacao, setNovaTransacao] = useState({ tipo: 'DESPESA', descricao: '', valor: '', vencimento: '' });

  // --- CÁLCULOS DO DRE (Demonstração do Resultado do Exercício) ---
  
  // 1. Receita Bruta (Tudo que foi vendido)
  const receitaBruta = sales.reduce((acc: number, sale: any) => acc + sale.total, 0);
  
  // 2. CMV (Custo da Mercadoria Vendida) - Quanto custou os iPhones que saíram
  const cmv = sales.reduce((acc: number, sale: any) => {
    return acc + sale.cart.reduce((itemAcc: number, item: any) => itemAcc + (item.cost || 0), 0);
  }, 0);

  // 3. Lucro Bruto
  const lucroBruto = receitaBruta - cmv;

  // 4. Despesas Operacionais (Aluguel, Luz, etc - apenas as do tipo DESPESA)
  const despesasOperacionais = transacoes
    .filter((t: any) => t.tipo === 'DESPESA')
    .reduce((acc: number, t: any) => acc + t.valor, 0);

  // 5. Receitas Extras (Cashback de fornecedor, juros recebidos, etc)
  const receitasExtras = transacoes
    .filter((t: any) => t.tipo === 'RECEITA')
    .reduce((acc: number, t: any) => acc + t.valor, 0);

  // 6. Lucro Líquido Real (O que sobra no bolso do Sidney)
  const lucroLiquido = lucroBruto + receitasExtras - despesasOperacionais;
  const margemLiquida = receitaBruta > 0 ? (lucroLiquido / receitaBruta) * 100 : 0;

  // --- AÇÕES ---
  const handleSalvar = () => {
    if (!novaTransacao.descricao || !novaTransacao.valor || !novaTransacao.vencimento) return alert("Preencha todos os campos.");
    addTransacao({
      ...novaTransacao,
      valor: Number(novaTransacao.valor),
      status: 'PENDENTE'
    });
    setModalNova(false);
    setNovaTransacao({ tipo: 'DESPESA', descricao: '', valor: '', vencimento: '' });
  };

  return (
    <div className="p-4 md:p-8 bg-zinc-950 text-white min-h-screen pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <Landmark className="text-blue-500" size={36} /> Gestão Financeira
          </h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">DRE Simplificado & Contas a Pagar</p>
        </div>
        <button onClick={() => setModalNova(true)} className="bg-blue-600 hover:bg-white hover:text-black text-white px-6 py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all shadow-xl flex items-center gap-2">
          <PlusCircle size={18} /> Novo Lançamento
        </button>
      </div>

      {/* DRE - DEMONSTRAÇÃO DE RESULTADO DO EXERCÍCIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800">
          <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 flex items-center gap-2"><TrendingUp size={14}/> Receita Bruta (Vendas)</p>
          <p className="text-2xl font-mono font-black text-white">R$ {receitaBruta.toLocaleString()}</p>
        </div>
        
        <div className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800">
          <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 flex items-center gap-2"><TrendingDown size={14}/> Custos Prod. (CMV)</p>
          <p className="text-2xl font-mono font-black text-red-400">- R$ {cmv.toLocaleString()}</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800">
          <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 flex items-center gap-2"><TrendingDown size={14}/> Despesas Operacionais</p>
          <p className="text-2xl font-mono font-black text-red-500">- R$ {despesasOperacionais.toLocaleString()}</p>
        </div>

        <div className={`p-6 rounded-[2rem] border ${lucroLiquido >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <p className={`text-[10px] font-black uppercase mb-2 flex items-center gap-2 ${lucroLiquido >= 0 ? 'text-green-500' : 'text-red-500'}`}><DollarSign size={14}/> Lucro Líquido</p>
          <p className={`text-3xl font-mono font-black ${lucroLiquido >= 0 ? 'text-green-400' : 'text-red-500'}`}>R$ {lucroLiquido.toLocaleString()}</p>
          <p className="text-[10px] font-bold uppercase mt-2 text-zinc-400 tracking-widest">Margem: {margemLiquida.toFixed(1)}%</p>
        </div>
      </div>

      {/* PAINEL DE CONTAS A PAGAR / RECEBER */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-zinc-800">
          <h3 className="text-xl font-black italic uppercase tracking-tight">Lançamentos / Contas a Pagar</h3>
        </div>
        <div className="p-8 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 text-[10px] font-black uppercase border-b border-zinc-800 pb-4">
                <th className="pb-4">Descrição</th>
                <th className="pb-4 text-center">Vencimento</th>
                <th className="pb-4 text-center">Status</th>
                <th className="pb-4 text-right">Valor</th>
                <th className="pb-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((t: any) => (
                <tr key={t.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-all">
                  <td className="py-6">
                    <p className="font-bold uppercase italic text-sm">{t.descricao}</p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md mt-1 inline-block ${t.tipo === 'DESPESA' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className="py-6 text-center font-mono text-zinc-400 text-xs">
                    {new Date(t.vencimento).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-6 text-center">
                    {t.status === 'PAGO' ? (
                      <span className="flex items-center justify-center gap-1 text-[10px] text-green-500 font-black uppercase"><CheckCircle size={12}/> Pago</span>
                    ) : (
                      <span className="flex items-center justify-center gap-1 text-[10px] text-orange-500 font-black uppercase"><AlertCircle size={12}/> Pendente</span>
                    )}
                  </td>
                  <td className={`py-6 text-right font-mono font-bold text-lg ${t.tipo === 'DESPESA' ? 'text-red-400' : 'text-green-400'}`}>
                    R$ {t.valor.toLocaleString()}
                  </td>
                  <td className="py-6 text-center">
                    {t.status === 'PENDENTE' && (
                      <button onClick={() => { if(window.confirm('Confirmar pagamento desta conta?')) baixarTransacao(t.id) }} className="px-4 py-2 bg-zinc-800 rounded-xl hover:bg-white hover:text-black transition-all text-[9px] font-black uppercase italic tracking-widest shadow-xl">
                        Baixar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOVO LANÇAMENTO */}
      {modalNova && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in">
            <h2 className="text-2xl font-black italic uppercase mb-6 flex items-center gap-2"><DollarSign className="text-blue-500"/> Novo Lançamento</h2>
            <div className="space-y-4">
              <select value={novaTransacao.tipo} onChange={e => setNovaTransacao({...novaTransacao, tipo: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold uppercase outline-none focus:border-blue-500 text-white">
                <option value="DESPESA">Despesa (A Pagar)</option>
                <option value="RECEITA">Receita Extra (A Receber)</option>
              </select>
              <input placeholder="Descrição (Ex: Conta de Luz)" value={novaTransacao.descricao} onChange={e => setNovaTransacao({...novaTransacao, descricao: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold uppercase outline-none focus:border-blue-500" />
              <input type="number" placeholder="Valor (R$)" value={novaTransacao.valor} onChange={e => setNovaTransacao({...novaTransacao, valor: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-mono font-bold outline-none focus:border-blue-500" />
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase">Data de Vencimento</label>
                <input type="date" value={novaTransacao.vencimento} onChange={e => setNovaTransacao({...novaTransacao, vencimento: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-mono font-bold outline-none focus:border-blue-500 mt-1 uppercase text-zinc-400" />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setModalNova(false)} className="flex-1 py-4 text-zinc-500 font-black uppercase text-xs italic">Cancelar</button>
                <button onClick={handleSalvar} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase italic text-xs shadow-xl hover:bg-white hover:text-black transition-all">Lançar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};