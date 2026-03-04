import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthScreen } from './components/AuthScreen';
import { PDV } from './components/PDV';
import { Inventory } from './components/Inventory';
import { Dashboard } from './components/Dashboard';
import { Customers } from './components/Customers';
import { Financeiro } from './components/Financeiro';
import { Auditoria } from './components/Auditoria';
import { ShoppingBag, LayoutGrid, BarChart3, LogOut, Users, Landmark, ShieldAlert, Smartphone } from 'lucide-react';

const AppContent = () => {
  const { user, logout } = useStore();
  const [tab, setTab] = useState('dash');

  if (!user) return <AuthScreen />;

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => setTab(id)}
      className={`w-full flex flex-col items-center justify-center py-5 transition-all relative group ${
        tab === id ? 'text-blue-500' : 'text-zinc-600 hover:text-zinc-400'
      }`}
    >
      <div className={`p-3 rounded-2xl transition-all ${tab === id ? 'bg-blue-600/10 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : ''}`}>
        <Icon size={28} strokeWidth={tab === id ? 2.5 : 2} />
      </div>
      <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-2 ${tab === id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
        {label}
      </span>
      {tab === id && <div className="absolute right-0 w-1 h-12 bg-blue-500 rounded-l-full shadow-[0_0_15px_#2563eb]" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans selection:bg-blue-500">
      {/* NAVBAR ICÔNICA */}
      <nav className="w-28 bg-zinc-950 border-r border-zinc-900 h-screen sticky top-0 flex flex-col items-center justify-between py-8 z-50">
        <div className="flex flex-col items-center w-full gap-2">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-8 border border-white/10">
            <Smartphone size={32} />
          </div>

          <NavItem id="dash" icon={BarChart3} label="Dashboard" />
          <NavItem id="pdv" icon={ShoppingBag} label="Caixa" />
          <NavItem id="estoque" icon={LayoutGrid} label="Estoque" />
          <NavItem id="financeiro" icon={Landmark} label="Financeiro" />
          <NavItem id="clientes" icon={Users} label="Clientes" />
          <NavItem id="auditoria" icon={ShieldAlert} label="Logs" />
        </div>

        <button 
          onClick={logout}
          className="w-full flex flex-col items-center group text-zinc-700 hover:text-red-500 transition-colors"
        >
          <LogOut size={24} />
          <span className="text-[8px] font-black uppercase mt-1 opacity-40">Sair</span>
        </button>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 h-screen overflow-y-auto bg-black">
        <div className="animate-in fade-in duration-500 h-full">
          {tab === 'dash' && <Dashboard />}
          {tab === 'estoque' && <Inventory />}
          {tab === 'pdv' && <PDV />}
          {tab === 'financeiro' && <Financeiro />}
          {tab === 'clientes' && <Customers />}
          {tab === 'auditoria' && <Auditoria />}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}