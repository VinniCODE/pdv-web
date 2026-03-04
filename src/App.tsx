import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthScreen } from './components/AuthScreen';
import { PDV } from './components/PDV';
import { Dashboard } from './components/Dashboard';
import { Customers } from './components/Customers';
import { Financeiro } from './components/Financeiro';
import { Auditoria } from './components/Auditoria';
import { Comissoes } from './components/Comissoes';
import { Inventory } from './components/Inventory';
import { Cupons } from './components/Cupons';
import { 
  ShoppingBag, 
  LayoutGrid, 
  BarChart3, 
  LogOut, 
  Users, 
  Landmark, 
  ShieldAlert, 
  Smartphone, 
  Menu, 
  X,
  Wallet,
  Ticket
} from 'lucide-react';

const AppContent = () => {
  const { user, logout } = useStore();
  const [tab, setTab] = useState('dash');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Se não houver usuário logado, mostra a tela de PIN puro
  if (!user) return <AuthScreen />;

  // Componente de Item da Navegação (Navbar Lateral/Mobile)
  const NavItem = ({ id, icon: Icon, label, adminOnly = false }: any) => {
    // Trava de segurança para abas exclusivas do Sidney
    if (adminOnly && user.role !== 'admin') return null;

    const isActive = tab === id;
    return (
      <button 
        onClick={() => { setTab(id); setIsMobileMenuOpen(false); }}
        className={`flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full py-4 md:py-5 px-6 transition-all relative group ${
          isActive ? 'text-blue-500' : 'text-zinc-500 hover:text-white'
        }`}
      >
        <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-blue-600/10 shadow-lg shadow-blue-600/20' : ''}`}>
          <Icon size={24} />
        </div>
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">
          {label}
        </span>
        {isActive && (
          <div className="absolute bottom-0 md:bottom-auto md:right-0 w-full md:w-1 h-1 md:h-12 bg-blue-500 rounded-t-full md:rounded-l-full shadow-[0_0_15px_#2563eb]" />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans">
      
      {/* HEADER MOBILE (Aparece apenas em smartphones) */}
      <div className="md:hidden flex justify-between items-center p-5 bg-zinc-950 border-b border-zinc-900 sticky top-0 z-[100]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Smartphone size={18} />
          </div>
          <span className="font-black italic text-sm tracking-tighter uppercase">iStock Pro</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* NAVBAR RESPONSIVA (Lateral no PC, Slide-in no Mobile) */}
      <nav className={`
        fixed md:sticky top-0 left-0 w-full md:w-32 lg:w-64 bg-zinc-950 border-r border-zinc-900 h-screen 
        flex flex-col items-center justify-between py-8 z-[90] transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col items-center w-full gap-1 overflow-y-auto custom-scrollbar">
          {/* Logo visível no Desktop */}
          <div className="hidden md:flex w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center shadow-2xl shadow-blue-600/30 mb-8 border border-white/10">
            <Smartphone size={32} />
          </div>

          <NavItem id="dash" icon={BarChart3} label="Dashboard" />
          <NavItem id="pdv" icon={ShoppingBag} label="PDV / Caixa" />
          <NavItem id="estoque" icon={LayoutGrid} label="Estoque" />
          <NavItem id="financeiro" icon={Landmark} label="Finanças" />
          <NavItem id="clientes" icon={Users} label="Clientes" />
          <NavItem id="cupons" icon={Ticket} label="Cupons" adminOnly={true} />
          <NavItem id="comissoes" icon={Wallet} label="Comissões" adminOnly={true} />
          <NavItem id="auditoria" icon={ShieldAlert} label="Auditoria" />
        </div>

        {/* Botão Logout */}
        <button onClick={logout} className="flex flex-col items-center gap-1 text-zinc-700 hover:text-red-500 transition-colors px-6 pb-20 md:pb-0">
          <LogOut size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest">Sair</span>
        </button>
      </nav>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 min-h-screen overflow-x-hidden relative bg-black">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {tab === 'dash' && <Dashboard />}
          {tab === 'pdv' && <PDV />}
          {tab === 'estoque' && <Inventory />}
          {tab === 'financeiro' && <Financeiro />}
          {tab === 'clientes' && <Customers />}
          {tab === 'cupons' && <Cupons />}
          {tab === 'comissoes' && <Comissoes />}
          {tab === 'auditoria' && <Auditoria />}
        </div>
      </main>
    </div>
  );
};

// --- EXPORTAÇÃO PADRÃO (Obrigatória para o Vite/Main.tsx) ---
const App = () => (
  <StoreProvider>
    <AppContent />
  </StoreProvider>
);

export default App;