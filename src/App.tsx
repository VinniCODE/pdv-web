import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { PDV } from './components/PDV';
import { Inventory } from './components/Inventory';
import { Dashboard } from './components/Dashboard';
import { ShoppingBag, LayoutGrid, BarChart3 } from 'lucide-react';

const AppContent = () => {
  const [tab, setTab] = useState('pdv');

  const nav = [
    { id: 'pdv', label: 'Vendas', icon: ShoppingBag },
    { id: 'estoque', label: 'Estoque', icon: LayoutGrid },
    { id: 'dash', label: 'Metas', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      <nav className="hidden md:flex flex-col w-24 bg-zinc-900 border-r border-zinc-800 h-screen sticky top-0 py-10 items-center gap-10 z-50">
        {nav.map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} className="flex flex-col items-center gap-2 transition-all" style={{ color: tab === item.id ? 'var(--primary-color)' : '#3f3f46' }}>
            <item.icon size={26} />
            <span className="text-[8px] font-black uppercase italic tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-zinc-900/90 border-t border-zinc-800 flex justify-around items-center z-[100]">
        {nav.map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} className="flex flex-col items-center gap-1" style={{ color: tab === item.id ? 'var(--primary-color)' : '#52525b' }}>
            <item.icon size={20} />
            <span className="text-[8px] font-black uppercase italic tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
      <main className="flex-1 overflow-x-hidden">
        {tab === 'pdv' && <PDV />}
        {tab === 'estoque' && <Inventory />}
        {tab === 'dash' && <Dashboard />}
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