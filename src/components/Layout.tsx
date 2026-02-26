// src/components/Layout.tsx
import { ReactNode } from 'react';
import { ShoppingCart, Package, BarChart3, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-aurora-dark text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-aurora-card border-r border-aurora-border flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-aurora-primary tracking-wider">
            PDV<span className="text-white">SIDNEY</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase font-medium">Enterprise Edition</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            to="/" 
            icon={<Package size={20} />} 
            label="Estoque" 
            active={location.pathname === '/'} 
          />
          <NavItem 
            to="/pdv" 
            icon={<ShoppingCart size={20} />} 
            label="Frente de Caixa" 
            active={location.pathname === '/pdv'} 
          />
          <NavItem 
            to="/relatorios" 
            icon={<BarChart3 size={20} />} 
            label="Relatórios" 
            active={location.pathname === '/relatorios'} 
          />
        </nav>

        <div className="p-4 border-t border-aurora-border">
          <NavItem 
            to="/configuracoes" 
            icon={<Settings size={20} />} 
            label="Configurações" 
            active={location.pathname === '/configuracoes'} 
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

// Componente auxiliar para os itens do menu
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
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-aurora-accent/20 text-aurora-primary border border-aurora-accent/50 shadow-[0_0_15px_rgba(112,0,255,0.1)]' 
          : 'text-gray-400 hover:bg-aurora-border/50 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}