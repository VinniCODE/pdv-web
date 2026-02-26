import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Inventory } from './views/Inventory';

// Componente temporário (Mock) para as rotas que ainda vamos fazer
const PlaceholderScreen = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex flex-col space-y-4">
    <header>
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <p className="text-gray-400 mt-2">{desc}</p>
    </header>
    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-aurora-border rounded-xl min-h-[400px]">
      <p className="text-gray-500 font-medium">Módulo em desenvolvimento...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/pdv" element={<PlaceholderScreen title="Frente de Caixa" desc="Caixa Livre - Operador: Admin" />} />
          <Route path="/relatorios" element={<PlaceholderScreen title="Relatórios Gerenciais" desc="Análise financeira e histórico de movimentações." />} />
          <Route path="/configuracoes" element={<PlaceholderScreen title="Configurações" desc="Ajustes do sistema e sincronização offline." />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}