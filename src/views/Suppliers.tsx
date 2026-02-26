// src/views/Suppliers.tsx
import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, Building2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Supplier } from '../types/inventory';

export function Suppliers() {
  const { suppliers, addSupplier, deleteSupplier } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<Omit<Supplier, 'id' | 'tenant_id' | 'status'>>({
    name: '', document: '', email: '', phone: ''
  });

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.document.includes(searchQuery)
  );

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier(formData);
    setIsModalOpen(false); 
    setFormData({ name: '', document: '', email: '', phone: '' }); 
  };

  return (
    <div className="flex flex-col space-y-6 h-full relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Fornecedores</h2>
          <p className="text-gray-400 mt-1">Gestão de parceiros comerciais e distribuidores.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-aurora-primary hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-colors shadow-lg">
          <Plus size={20} />
          Novo Fornecedor
        </button>
      </div>

      <div className="bg-aurora-card p-4 rounded-2xl border border-aurora-border flex items-center gap-4 shadow-sm">
        <div className="bg-aurora-dark p-3 rounded-xl border border-aurora-border">
          <Search className="text-aurora-primary" size={20} />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar fornecedor por nome ou CNPJ..." 
          className="flex-1 bg-transparent text-white focus:outline-none placeholder-gray-500 font-mono"
        />
      </div>

      <div className="bg-aurora-card rounded-2xl border border-aurora-border flex-1 overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-aurora-border bg-black/20">
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Empresa</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">CNPJ / NIF</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">E-mail</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Telefone</th>
                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aurora-border">
              {filteredSuppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-[#2C2C2E] transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/40 rounded-lg flex items-center justify-center border border-aurora-border">
                      <Building2 size={18} className="text-aurora-primary" />
                    </div>
                    <span className="font-bold text-white">{sup.name}</span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm font-mono">{sup.document}</td>
                  <td className="p-4 text-gray-300">{sup.email}</td>
                  <td className="p-4 text-gray-300">{sup.phone}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button className="text-gray-500 hover:text-aurora-primary transition-colors p-2 bg-black/30 rounded-lg border border-transparent hover:border-aurora-primary/30" title="Editar">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteSupplier(sup.id)} className="text-gray-500 hover:text-red-400 transition-colors p-2 bg-black/30 rounded-lg border border-transparent hover:border-red-400/30" title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-aurora-card border border-aurora-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-aurora-border bg-black/20">
              <h3 className="text-xl font-bold text-white">Cadastrar Fornecedor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveSupplier} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Razão Social / Nome *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">CNPJ / NIF *</label>
                <input required type="text" value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-aurora-primary transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">E-mail</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Telefone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/40 border border-aurora-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-aurora-primary transition-colors" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-aurora-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#3A3A3C] transition-colors font-bold">Cancelar</button>
                <button type="submit" className="bg-aurora-primary hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg"><Save size={20} /> Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}