import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Users, UserPlus, ShieldAlert, BadgeDollarSign, CreditCard, Edit3, X } from 'lucide-react';

export const Customers = () => {
  const { clientes, addCliente, updateCliente } = useStore();
  const [search, setSearch] = useState('');
  const [modalNovo, setModalNovo] = useState(false);
  const [novoCli, setNovoCli] = useState({ nome: '', cpf: '', telefone: '', limiteCredito: 2000 });
  const [selectedCli, setSelectedCli] = useState<any>(null);

  const filtered = clientes.filter((c: any) => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpf.includes(search));

  const totalInadimplencia = clientes.reduce((acc: number, c: any) => acc + c.debito, 0);

  const handleSalvar = () => {
    if (!novoCli.nome) return alert('Nome é obrigatório');
    addCliente(novoCli);
    setModalNovo(false);
    setNovoCli({ nome: '', cpf: '', telefone: '', limiteCredito: 2000 });
    alert('Cliente cadastrado com sucesso!');
  };

  const quitarDebito = (cliente: any) => {
    const valor = Number(prompt(`Dívida total: R$ ${cliente.debito}\nQuanto o cliente está pagando agora?`, cliente.debito.toString()));
    if (valor && valor > 0 && valor <= cliente.debito) {
      updateCliente(cliente.id, { debito: cliente.debito - valor });
      alert(`Pagamento de R$ ${valor} registrado. Dívida atualizada!`);
      setSelectedCli(null);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-zinc-950 text-white min-h-screen pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <Users className="text-blue-500" size={36} /> Base de Clientes
          </h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">CRM e Gestão de Crediário</p>
        </div>
        <button onClick={() => setModalNovo(true)} className="bg-blue-600 hover:bg-white hover:text-black text-white px-6 py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all shadow-xl flex items-center gap-2">
          <UserPlus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 flex items-center gap-2"><BadgeDollarSign size={12}/> Total em Fiado (A Receber)</p>
            <p className="text-4xl font-mono font-black text-red-500">R$ {totalInadimplencia.toLocaleString()}</p>
          </div>
          <ShieldAlert size={60} className="text-red-500/10" />
        </div>
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 flex items-center gap-2"><Users size={12}/> Clientes Ativos</p>
            <p className="text-4xl font-mono font-black text-blue-500">{clientes.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <input 
            placeholder="Pesquisar por nome ou CPF..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white font-bold outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 text-[10px] font-black uppercase border-b border-zinc-800 pb-4">
                <th className="pb-4">Cliente / Contato</th>
                <th className="pb-4 text-center">Compras</th>
                <th className="pb-4 text-right">Total Gasto</th>
                <th className="pb-4 text-right">Dívida (Fiado)</th>
                <th className="pb-4 text-center">Gestão</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-all">
                  <td className="py-6">
                    <p className="font-bold uppercase italic text-sm">{c.nome}</p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-1">{c.cpf || 'Sem CPF'} • {c.telefone || 'Sem Fone'}</p>
                  </td>
                  <td className="py-6 text-center font-mono font-bold text-zinc-400">{c.compras}</td>
                  <td className="py-6 text-right font-mono font-bold text-green-500">R$ {c.totalGasto.toLocaleString()}</td>
                  <td className="py-6 text-right">
                    <span className={`font-mono font-black ${c.debito > 0 ? 'text-red-500' : 'text-zinc-600'}`}>
                      R$ {c.debito.toLocaleString()}
                    </span>
                    <br />
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Limite: R$ {c.limiteCredito.toLocaleString()}</span>
                  </td>
                  <td className="py-6 text-center">
                    <button onClick={() => setSelectedCli(c)} className="p-4 bg-zinc-800 rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl">
                      <Edit3 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOVO CLIENTE */}
      {modalNovo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in">
            <h2 className="text-2xl font-black italic uppercase mb-6 flex items-center gap-2"><UserPlus className="text-blue-500"/> Cadastrar Cliente</h2>
            <div className="space-y-4">
              <input placeholder="Nome Completo" value={novoCli.nome} onChange={e => setNovoCli({...novoCli, nome: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold uppercase outline-none focus:border-blue-500" />
              <input placeholder="CPF" value={novoCli.cpf} onChange={e => setNovoCli({...novoCli, cpf: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold uppercase outline-none focus:border-blue-500" />
              <input placeholder="Telefone / WhatsApp" value={novoCli.telefone} onChange={e => setNovoCli({...novoCli, telefone: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold uppercase outline-none focus:border-blue-500" />
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase">Limite de Crédito (Fiado) R$</label>
                <input type="number" value={novoCli.limiteCredito} onChange={e => setNovoCli({...novoCli, limiteCredito: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-mono font-bold outline-none focus:border-blue-500 mt-1" />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setModalNovo(false)} className="flex-1 py-4 text-zinc-500 font-black uppercase text-xs italic">Cancelar</button>
                <button onClick={handleSalvar} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase italic text-xs shadow-xl hover:bg-white hover:text-black transition-all">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PERFIL DO CLIENTE (QUITAR DÍVIDA) */}
      {selectedCli && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black italic uppercase text-white leading-tight">{selectedCli.nome}</h2>
                <p className="text-xs font-mono text-zinc-500 mt-1">{selectedCli.cpf} • {selectedCli.telefone}</p>
              </div>
              <button onClick={() => setSelectedCli(null)} className="p-2 bg-zinc-800 rounded-full hover:bg-red-500 transition-colors"><X size={20} /></button>
            </div>

            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 mb-6">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Dívida Atual</p>
              <p className={`text-4xl font-mono font-black ${selectedCli.debito > 0 ? 'text-red-500' : 'text-green-500'}`}>
                R$ {selectedCli.debito.toLocaleString()}
              </p>
              <div className="w-full bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${Math.min(100, (selectedCli.debito / selectedCli.limiteCredito) * 100)}%` }} />
              </div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase mt-2 text-right">Limite de R$ {selectedCli.limiteCredito}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => quitarDebito(selectedCli)} disabled={selectedCli.debito <= 0} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase italic text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform disabled:opacity-30 disabled:cursor-not-allowed">
                <CreditCard size={18} /> Registrar Pagamento de Dívida
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};