import React, { createContext, useContext, useState, useMemo } from 'react';

const StoreContext = createContext<any>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [config] = useState({
    id: 'TRM-001',
    name: 'iStock Pro - Sidney',
    status: 'active',
    primaryColor: '#007AFF',
    monthlyGoal: 150000,
  });

  const [products, setProducts] = useState([
    { id: 'a1', name: 'iPhone 15 Pro Max 256GB', sku: 'IP15PM-256', price: 7299, cost: 5800, stock: 12, category: 'Apple' },
    { id: 's1', name: 'Samsung S24 Ultra 512GB', sku: 'S24U-512', price: 6899, cost: 5500, stock: 5, category: 'Android' },
    { id: 'acc1', name: 'Fonte Apple 20W Original', sku: 'PWR-20W', price: 199, cost: 45, stock: 50, category: 'Acessório' },
  ]);

  const [sales, setSales] = useState([
    { id: '5001', vendedor: 'Leandro Lima', total: 7299, metodo: 'Crédito', parcelas: 12, cupom: 'NENHUM', itens: ['iPhone 15 Pro Max'], data: '2026-02-28' },
  ]);

  const performance = useMemo(() => {
    const stats = sales.reduce((acc: any, sale) => {
      if (!acc[sale.vendedor]) acc[sale.vendedor] = { total: 0, count: 0, history: [] };
      acc[sale.vendedor].total += sale.total;
      acc[sale.vendedor].count += 1;
      acc[sale.vendedor].history.push(sale);
      return acc;
    }, {});
    const totalVendido = Object.values(stats).reduce((a: any, b: any) => a + (b.total || 0), 0) as number;
    return {
      ranking: Object.entries(stats).sort((a: any, b: any) => b[1].total - a[1].total),
      totalVendido,
      percentualMeta: (totalVendido / config.monthlyGoal) * 100
    };
  }, [sales, config.monthlyGoal]);

  const updateProduct = (id: string, updates: any) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addProduct = (newP: any) => {
    setProducts(prev => [...prev, { ...newP, id: Date.now().toString() }]);
  };

  return (
    <StoreContext.Provider value={{ config, products, performance, updateProduct, addProduct }}>
      <div style={{ '--primary-color': config.primaryColor } as React.CSSProperties}>
        {children}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);