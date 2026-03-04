import React, { createContext, useContext, useState, useMemo } from 'react';

const StoreContext = createContext<any>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [commissionRate, setCommissionRate] = useState(2);
  const [config] = useState({ 
    id: 'TRM-01', 
    name: 'iStock Pro', 
    monthlyGoal: 250000, 
    primaryColor: '#3b82f6' 
  });

  // --- DADOS FAKES: CUPONS ---
  const [coupons] = useState([
    { code: 'ISTOCK10', discount: 10, type: 'percent' }
  ]);

  // --- DADOS FAKES: ESTOQUE ---
  const [products, setProducts] = useState([
    { id: '1', name: 'iPhone 17 Pro Max', storage: '512GB', color: 'Titânio Deserto', price: 9299, stock: 12, category: 'Apple', sku: 'IP17PM-512' },
    { id: '2', name: 'MacBook Pro M4', storage: '1TB', color: 'Cinza Espacial', price: 18500, stock: 3, category: 'Computadores', sku: 'MBP-M4-1T' },
    { id: '3', name: 'AirPods Pro 2', storage: 'USB-C', color: 'Branco', price: 1899, stock: 45, category: 'Acessórios', sku: 'APP2-USBC' }
  ]);

  // --- DADOS FAKES: CLIENTES ---
  const [clientes, setClientes] = useState([
    { id: 'c1', nome: 'Malu Bezerra', cpf: '123.456.789-01', telefone: '(81) 98888-2222', totalGasto: 25400, compras: 5 },
    { id: 'c2', nome: 'Lucas Amaral', cpf: '987.654.321-00', telefone: '(81) 99999-1111', totalGasto: 12300, compras: 3 }
  ]);

  // --- DADOS FAKES: VENDAS ---
  const [sales, setSales] = useState([
    { id: '8541', vendedor: 'Vinícius', cliente: 'Malu Bezerra', clienteId: 'c1', total: 9299, metodo: 'Pix', data: new Date().toISOString(), cart: [{name: 'iPhone 17 Pro Max', price: 9299}] }
  ]);

  // --- DADOS FAKES: FINANCEIRO (O que estava faltando) ---
  const [transacoes, setTransacoes] = useState([
    { id: 't1', tipo: 'DESPESA', descricao: 'Aluguel Loja', valor: 6500, vencimento: '2026-03-10', status: 'PENDENTE' },
    { id: 't2', tipo: 'DESPESA', descricao: 'Energia Neoenergia', valor: 850, vencimento: '2026-03-05', status: 'PAGO' },
    { id: 't3', tipo: 'RECEITA', descricao: 'Serviço de Reparo', valor: 450, vencimento: '2026-03-04', status: 'PAGO' }
  ]);

  const [logs, setLogs] = useState([
    { id: 'l1', data: new Date().toISOString(), operadorNome: 'Sistema', acao: 'INICIALIZAÇÃO', detalhes: 'Sistema iStock Pro Pronto' }
  ]);

  // --- FUNÇÕES ---
  const login = (pin: string) => {
    if (pin === '7777777') setUser({ pin, role: 'admin', nome: 'Sidney (Admin)' });
    else if (pin === '1111111') setUser({ pin, role: 'operador', nome: 'Vinícius' });
    else alert("⚠️ PIN INVÁLIDO");
  };

  const logout = () => setUser(null);

  const addLog = (acao: string, detalhes: string) => {
    setLogs(prev => [{ id: Date.now().toString(), data: new Date().toISOString(), operadorNome: user?.nome || 'Sistema', acao, detalhes }, ...prev]);
  };

  const finalizeSale = (sale: any) => {
    sale.cart.forEach((item: any) => {
      setProducts(prev => prev.map(p => p.name === item.name ? { ...p, stock: Math.max(0, p.stock - 1) } : p));
    });
    const newSale = { ...sale, id: Math.floor(Math.random() * 9000 + 1000).toString(), data: new Date().toISOString() };
    setSales(prev => [newSale, ...prev]);
    addLog('VENDA', `Venda #${newSale.id} para ${sale.cliente}`);
    return newSale;
  };

  const updateProduct = (id: string, updates: any) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // Funções Financeiras
  const addTransacao = (t: any) => setTransacoes(prev => [{ ...t, id: Date.now().toString() }, ...prev]);
  
  const baixarTransacao = (id: string) => {
    setTransacoes(prev => prev.map(t => t.id === id ? { ...t, status: 'PAGO' } : t));
    addLog('FINANCEIRO', `Baixa de pagamento na transação ID: ${id}`);
  };

  const handleReturn = (saleId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;
    if (window.confirm("Estornar venda e devolver ao estoque?")) {
      sale.cart.forEach((item: any) => {
        setProducts(prev => prev.map(p => p.name === item.name ? { ...p, stock: p.stock + 1 } : p));
      });
      setSales(prev => prev.filter(s => s.id !== saleId));
      addLog('DEVOLUÇÃO', `Estorno da venda #${saleId}`);
    }
  };

  const performance = useMemo(() => {
    const stats: any = {};
    let totalVendido = 0;
    sales.forEach((sale: any) => {
      if (!stats[sale.vendedor]) stats[sale.vendedor] = { total: 0, count: 0, comissao: 0 };
      stats[sale.vendedor].total += sale.total;
      stats[sale.vendedor].count += 1;
      stats[sale.vendedor].comissao = (stats[sale.vendedor].total * commissionRate) / 100;
      totalVendido += sale.total;
    });

    return {
      ranking: Object.entries(stats).sort((a: any, b: any) => b[1].total - a[1].total),
      totalVendido,
      percentualMeta: (totalVendido / config.monthlyGoal) * 100,
      vendasPorMetodo: [['Pix', totalVendido]],
      topProdutos: [['iPhone 17 Pro Max', 1]],
      commissionRate
    };
  }, [sales, commissionRate, config.monthlyGoal]);

  return (
    <StoreContext.Provider value={{ 
      user, login, logout, config, products, updateProduct, sales, finalizeSale, 
      handleReturn, clientes, coupons, transacoes, addTransacao, baixarTransacao, 
      performance, logs, addLog, commissionRate, setCommissionRate 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);