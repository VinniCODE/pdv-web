import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Users, Search, UserPlus, Phone, Edit3, 
  Trash2, AlertCircle, X, User as UserIcon, Fingerprint 
} from 'lucide-react';

export const Customers = () => {
  const { clientes, setClientes, addLog } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para Modais
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [form, setForm] = useState({ nome: '', cpf: '', telefone: '', email: '' });

  const filteredClientes = clientes.filter((c: any) => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cpf.includes(searchTerm)
  );

  const handleOpenEdit = (cliente: any) => {
    setEditingClient(cliente);
    setForm({ nome: cliente.nome, cpf: cliente.cpf, telefone: cliente.telefone, email: cliente.email || '' });
    setShowModal(true);
  };

  const handleDelete = (id: string, nome: string) => {
    if (window.confirm(`⚠️ ATENÇÃO: Deseja excluir o cadastro de ${nome}? Esta ação não pode ser desfeita.`)) {
      setClientes(clientes.filter((c: any) => c.id !== id));
      addLog('EXCLUSAO_CLIENTE', `Cadastro de ${nome} removido do sistema.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.cpf) return alert("Nome e CPF são obrigatórios!");

    if (editingClient) {
      // Lógica de Edição
      setClientes(clientes.map((c: any) => c.id === editingClient.id ? { ...c, ...form } : c));
      addLog('EDICAO_CLIENTE', `Dados de ${form.nome} atualizados.`);
    } else {
      // Lógica de Novo Cadastro
      setClientes([...clientes, { ...form, id: `c${Date.now()}`, totalGasto: 0, compras: 0 }]);
      addLog('CADASTRO_CLIENTE', `Novo cliente: ${form.nome} registrado.`);
    }

    setShowModal(false);
    setEditingClient(null);
    setForm({ nome: '', cpf: '', telefone: '', email: '' });
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen pb-32">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
            <Users className="text-blue-500" size={48} /> Clientes
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Gestão de Base de Dados</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-5 top-5 text-zinc-600" size={20} />
            <input 
              type="text" 
              placeholder="BUSCAR NOME OU CPF..."
              className="w-full bg-zinc-900 border-2 border-zinc-800 p-5 pl-14 rounded-2xl font-bold focus:border-blue-500 outline-none uppercase text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setEditingClient(null); setForm({nome:'', cpf:'', telefone:'', email:''}); setShowModal(true); }}
            className="bg-blue-600 hover:bg-white hover:text-black text-white px-8 py-5 rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
          >
            <UserPlus size={20} /> Novo Cadastro
          </button>
        </div>
      </div>

      {/* MODAL ÚNICO (CADASTRO/EDIÇÃO) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border-2 border-zinc-800 w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-white">
                {editingClient ? <Edit3 className="text-blue-500" /> : <UserPlus className="text-blue-500" />}
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={28}/></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block tracking-widest">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-4 text-zinc-700" size={18} />
                  <input 
                    autoFocus required
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-xl font-bold focus:border-blue-500 outline-none uppercase text-sm text-white"
                    value={form.nome}
                    onChange={e => setForm({...form, nome: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block tracking-widest">CPF / Identidade</label>
                  <input 
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold focus:border-blue-500 outline-none text-sm text-white"
                    value={form.cpf}
                    onChange={e => setForm({...form, cpf: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block tracking-widest">Telefone</label>
                  <input 
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold focus:border-blue-500 outline-none text-sm text-white"
                    value={form.telefone}
                    onChange={e => setForm({...form, telefone: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase italic tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95">
                {editingClient ? 'Salvar Alterações' : 'Confirmar Registro'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GRADE DE CLIENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClientes.map((c: any) => (
          <div key={c.id} className="bg-zinc-950 border-2 border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500 transition-all shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-blue-500 transition-colors">
                <UserIcon size={28} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(c)} className="p-3 bg-zinc-900 rounded-xl text-zinc-500 hover:text-blue-500 hover:bg-zinc-800 transition-all">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDelete(c.id, c.nome)} className="p-3 bg-zinc-900 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-zinc-800 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase italic leading-none mb-1 text-white">{c.nome}</h3>
            <p className="text-zinc-600 text-xs font-mono tracking-widest mb-6">{c.cpf}</p>

            <div className="flex items-center gap-3 text-zinc-400 mb-6">
              <Phone size={14} />
              <span className="text-xs font-bold font-mono">{c.telefone}</span>
            </div>

            <div className="flex justify-between items-end border-t border-zinc-900 pt-6">
               <div className="text-blue-500 font-black text-xl font-mono">R$ {c.totalGasto.toLocaleString()}</div>
               <div className="text-[9px] font-black text-zinc-700 uppercase">Total Gasto</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};