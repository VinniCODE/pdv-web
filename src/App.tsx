// src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Login } from './views/Login';
import { Inventory } from './views/Inventory';
import { POS } from './views/POS';
import { Movements } from './views/Movements';
import { Reports } from './views/Reports';
import { Settings } from './views/Settings';
import { Suppliers } from './views/Suppliers';

export default function App() {
  const [operatorName, setOperatorName] = useState<string | null>(null);

  if (!operatorName) {
    return <Login onLogin={setOperatorName} />;
  }

  return (
    <StoreProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/fornecedores" element={<Suppliers />} />
            <Route path="/movimentacoes" element={<Movements />} />
            {/* O PDV agora sabe quem está logado */}
            <Route path="/pdv" element={<POS operatorName={operatorName} />} /> 
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </StoreProvider>
  );
}