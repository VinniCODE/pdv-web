// src/components/Layout.tsx
import type { ReactNode } from 'react';
import { ShoppingCart, Package, BarChart3, Settings, ArrowRightLeft, Apple, Truck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-aurora-dark text-[#F5F5F7] font-sans">
      <aside className="w-64 bg-aurora-card border-r border-aurora-border flex flex-col">
        <div className="p-7">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
            <Apple className="text-aurora-primary mb-1" size={28} />
            iStock <span className="text-aurora-primary font-light">Pro</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Enterprise OS</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <NavItem to="/" icon={<Package size={20} />} label="Inventário" active={location.pathname === '/'} />
          <NavItem to="/fornecedores" icon={<Truck size={20} />} label="Fornecedores" active={location.pathname === '/fornecedores'} />
          <NavItem to="/movimentacoes" icon={<ArrowRightLeft size={20} />} label="Movimentações" active={location.pathname === '/movimentacoes'} />
          <NavItem to="/pdv" icon={<ShoppingCart size={20} />} label="Ponto de Venda" active={location.pathname === '/pdv'} />
          <NavItem to="/relatorios" icon={<BarChart3 size={20} />} label="Performance" active={location.pathname === '/relatorios'} />
        </nav>

        <div className="p-4 border-t border-aurora-border">
          <NavItem to="/configuracoes" icon={<Settings size={20} />} label="Ajustes" active={location.pathname === '/configuracoes'} />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link 
      to={to}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active ? 'bg-aurora-primary text-white shadow-md' : 'text-gray-400 hover:bg-aurora-border hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}