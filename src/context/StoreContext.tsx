import React, { createContext, useContext, useState, useMemo } from 'react';

const StoreContext = createContext<any>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const usersDB = [
    { pin: '7777777', role: 'admin', nome: 'Sidney (Admin)' },
    { pin: '1111111', role: 'operador', nome: 'Vinícius' }
  ];

  const [user, setUser] = useState<any>(null);
  const [config] = useState({ id: 'TRM-01', name: 'iStock Pro', monthlyGoal: 250000, primaryColor: '#3b82f6' });

  // --- DADOS FAKES DE ESTOQUE ---
  const [products, setProducts] = useState([
    { id: '1', name: 'iPhone 17 Pro Max', storage: '512GB', color: 'Titânio Deserto', price: 9299, stock: 12, category: 'Apple' },
    { id: '2', name: 'iPhone 16 Pro', storage: '256GB', color: 'Titânio Natural', price: 7499, stock: 4, category: 'Apple' },
    { id: '3', name: 'AirPods Pro 2', storage: 'USB-C', color: 'Branco', price: 1899, stock: 25, category: 'Acessórios' },
    { id: '4', name: 'Apple Watch Ultra 2', storage: '49mm', color: 'Laranja', price: 5999, stock: 2, category: 'Apple' },
    { id: '5', name: 'Capa MagSafe Leather', storage: 'N/A', color: 'Preto', price: 499, stock: 50, category: 'Acessórios' }
  ]);

  // --- DADOS FAKES DE CLIENTES ---
  const [clientes, setClientes] = useState([
    { id: 'c1', nome: 'Malu Bezerra', cpf: '123.456.789-01', telefone: '(81) 98888-2222', debito: 0, totalGasto: 15400 },
    { id: 'c2', nome: 'Lucas Amaral', cpf: '987.654.321-00', telefone: '(81) 99999-1111', debito: 4500, totalGasto: 12300 },
    { id: 'c3', nome: 'João Ferreira', cpf: '444.555.666-77', telefone: '(81) 97777-8888', debito: 0, totalGasto: 5999 }
  ]);

  // --- DADOS FAKES DE VENDAS ---
  const [sales, setSales] = useState([
    { id: '101', vendedor: 'Vinícius', cliente: 'Malu Bezerra', total: 9299, metodo: 'Pix', data: '2026-03-04T10:30:00Z', cart: [{name: 'iPhone 17 Pro Max'}] },
    { id: '102', vendedor: 'Sidney', cliente: 'Lucas Amaral', total: 7499, metodo: 'Crédito', data: '2026-03-04T11:15:00Z', cart: [{name: 'iPhone 16 Pro'}] },
    { id: '103', vendedor: 'Vinícius', cliente: 'João Ferreira', total: 5999, metodo: 'Pix', data: '2026-03-03T16:20:00Z', cart: [{name: 'Apple Watch Ultra 2'}] },
    { id: '104', vendedor: 'Vinícius', cliente: 'Malu Bezerra', total: 1899, metodo: 'Dinheiro', data: '2026-03-02T14:00:00Z', cart: [{name: 'AirPods Pro 2'}] }
  ]);

  // --- DADOS FAKES FINANCEIROS ---
  const [transacoes, setTransacoes] = useState([
    { id: 't1', tipo: 'DESPESA', descricao: 'Aluguel Loja', valor: 5500, vencimento: '2026-03-10', status: 'PENDENTE' },
    { id: 't2', tipo: 'DESPESA', descricao: 'Energia Neoenergia', valor: 450, vencimento: '2026-03-05', status: 'PAGO' },
    { id: 't3', tipo: 'RECEITA', descricao: 'Reembolso Fornecedor', valor: 1200, vencimento: '2026-03-01', status: 'PAGO' }
  ]);

  // --- DADOS FAKES DE AUDITORIA ---
  const [logs, setLogs] = useState([
    { id: 'l1', data: '2026-03-04T09:00:00Z', operadorNome: 'Sidney (Admin)', acao: 'LOGIN', detalhes: 'Início de turno' },
    { id: 'l2', data: '2026-03-04T09:15:00Z', operadorNome: 'Sidney (Admin)', acao: 'ESTOQUE_ADD', detalhes: 'Entrada de 10x iPhone 17' }
  ]);

  const login = (pin: string) => {
    const f = usersDB.find(u => u.pin === pin);
    if (f) setUser(f); else alert("PIN INVÁLIDO");
  };

  const logout = () => setUser(null);
  const finalizeSale = (s: any) => setSales(prev => [{...s, id: Date.now().toString(), data: new Date().toISOString()}, ...prev]);
  const addLog = (a: string, d: string) => setLogs(prev => [{id: Date.now().toString(), data: new Date().toISOString(), operadorNome: user?.nome, acao: a, detalhes: d}, ...prev]);

  const performance = useMemo(() => {
    const totalVendido = sales.reduce((acc, s) => acc + s.total, 0);
    const methodCount: any = {};
    sales.forEach(s => methodCount[s.metodo] = (methodCount[s.metodo] || 0) + s.total);
    
    return {
      totalVendido,
      percentualMeta: (totalVendido / config.monthlyGoal) * 100,
      vendasPorMetodo: Object.entries(methodCount),
      topProdutos: [['iPhone 17 Pro Max', 3], ['iPhone 16 Pro', 1], ['AirPods Pro 2', 1]],
      ranking: [['Vinícius', {total: 17197, count: 3}], ['Sidney', {total: 7499, count: 1}]]
    };
  }, [sales]);

  return (
    <StoreContext.Provider value={{ user, login, logout, config, products, sales, performance, finalizeSale, clientes, transacoes, logs, addLog }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);