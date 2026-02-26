// src/context/StoreContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product, StockMovement, Supplier, User } from '../types/inventory';

interface CartItem extends Product {
  cart_quantity: number;
}

interface StoreContextData {
  products: Product[];
  cart: CartItem[];
  movements: StockMovement[];
  suppliers: Supplier[];
  users: User[];
  addToCartBySku: (sku: string) => boolean;
  removeFromCart: (productId: string) => void;
  checkout: (operatorName: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'tenant_id' | 'status'>) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'tenant_id' | 'status'>) => void;
  deleteSupplier: (id: string) => void;
  registerMovement: (movement: Omit<StockMovement, 'id' | 'tenant_id' | 'date' | 'operator_id'>, operator: string) => void;
}

const StoreContext = createContext<StoreContextData>({} as StoreContextData);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Catálogo Gigante e Realista
  const [products, setProducts] = useState<Product[]>([
    { id: '1', tenant_id: 'sidney-001', name: 'iPhone 15 Pro Max 256GB - Titânio', sku: 'IPH15PM-256', category: 'Smartphones', price: 7499.00, cost_price: 6200.00, stock_current: 5, stock_minimum: 3, unit_measure: 'UN', status: 'ACTIVE' },
    { id: '2', tenant_id: 'sidney-001', name: 'iPhone 13 128GB - Meia-Noite', sku: 'IPH13-128', category: 'Smartphones', price: 3599.00, cost_price: 2900.00, stock_current: 0, stock_minimum: 5, unit_measure: 'UN', status: 'ACTIVE' }, // EM FALTA
    { id: '3', tenant_id: 'sidney-001', name: 'MacBook Pro M3 14" 512GB', sku: 'MACM3-14', category: 'Computadores', price: 12999.00, cost_price: 10500.00, stock_current: 2, stock_minimum: 2, unit_measure: 'UN', status: 'ACTIVE' },
    { id: '4', tenant_id: 'sidney-001', name: 'iPad Air 5ª Geração 64GB', sku: 'IPADAIR-64', category: 'Tablets', price: 4599.00, cost_price: 3800.00, stock_current: 12, stock_minimum: 4, unit_measure: 'UN', status: 'ACTIVE' },
    { id: '5', tenant_id: 'sidney-001', name: 'AirPods Pro (2ª geração)', sku: 'AIRPODS-PRO2', category: 'Wearables', price: 1899.00, cost_price: 1300.00, stock_current: 3, stock_minimum: 5, unit_measure: 'UN', status: 'ACTIVE' }, // BAIXO ESTOQUE
    { id: '6', tenant_id: 'sidney-001', name: 'Apple Watch Ultra 2', sku: 'WATCH-U2', category: 'Wearables', price: 6799.00, cost_price: 5500.00, stock_current: 0, stock_minimum: 2, unit_measure: 'UN', status: 'ACTIVE' }, // EM FALTA
    { id: '7', tenant_id: 'sidney-001', name: 'Fonte de Alimentação 20W Original', sku: 'FONTE-20W', category: 'Acessórios', price: 179.00, cost_price: 85.00, stock_current: 85, stock_minimum: 20, unit_measure: 'UN', status: 'ACTIVE' },
    { id: '8', tenant_id: 'sidney-001', name: 'Cabo USB-C para Lightning', sku: 'CABO-LGT', category: 'Acessórios', price: 149.00, cost_price: 70.00, stock_current: 42, stock_minimum: 15, unit_measure: 'UN', status: 'ACTIVE' },
    { id: '9', tenant_id: 'sidney-001', name: 'Capa MagSafe Silicone - iPhone 15', sku: 'CAPA-SIL-15', category: 'Acessórios', price: 250.00, cost_price: 90.00, stock_current: 1, stock_minimum: 5, unit_measure: 'UN', status: 'ACTIVE' }, // BAIXO ESTOQUE
    { id: '10', tenant_id: 'sidney-001', name: 'Apple Care+ (Serviço de Garantia)', sku: 'SRV-CARE', category: 'Serviços', price: 899.00, cost_price: 0.00, stock_current: 999, stock_minimum: 0, unit_measure: 'UN', status: 'ACTIVE' }, // SERVIÇO INTANGÍVEL
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'sup1', tenant_id: 'sidney-001', name: 'Apple Brasil (Oficial)', document: '00.000.000/0001-00', email: 'vendas@apple.com', phone: '0800-761-0880', status: 'ACTIVE' },
    { id: 'sup2', tenant_id: 'sidney-001', name: 'Ipeças Distribuidora', document: '11.111.111/0001-11', email: 'contato@ipecas.com', phone: '(11) 99999-9999', status: 'ACTIVE' }
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: 'u1', tenant_id: 'sidney-001', name: 'Sidney Diretor', email: 'admin@istock.pro', role: 'Administrador', status: 'ACTIVE' },
    { id: 'u2', tenant_id: 'sidney-001', name: 'Vinícius Caixa', email: 'caixa@istock.pro', role: 'Operador', status: 'ACTIVE' },
  ]);

  // Histórico Falso para gerar os Relatórios de cara
  const [movements, setMovements] = useState<StockMovement[]>([
    { id: 'm1', tenant_id: 'sidney-001', product_id: 'iPhone 15 Pro Max 256GB - Titânio', type: 'OUT', quantity: 2, date: new Date(Date.now() - 86400000).toISOString(), operator_id: 'Vinícius Caixa' },
    { id: 'm2', tenant_id: 'sidney-001', product_id: 'Fonte de Alimentação 20W Original', type: 'OUT', quantity: 15, date: new Date(Date.now() - 40000000).toISOString(), operator_id: 'Vinícius Caixa' },
    { id: 'm3', tenant_id: 'sidney-001', product_id: 'MacBook Pro M3 14" 512GB', type: 'IN', quantity: 5, date: new Date(Date.now() - 200000000).toISOString(), operator_id: 'Sidney Diretor' },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCartBySku = (sku: string) => {
    const product = products.find(p => p.sku.toUpperCase() === sku.toUpperCase());
    if (!product) return false; 
    if (product.category !== 'Serviços' && product.stock_current <= 0) return false; 

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, cart_quantity: item.cart_quantity + 1 } : item);
      return [...prev, { ...product, cart_quantity: 1 }];
    });
    return true; 
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId));

  const checkout = (operatorName: string) => {
    if (cart.length === 0) return;
    const newMovements: StockMovement[] = [];
    
    setProducts(prevProducts => 
      prevProducts.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
          newMovements.push({
            id: crypto.randomUUID(), tenant_id: 'sidney-001', product_id: p.name, type: 'OUT', quantity: cartItem.cart_quantity, date: new Date().toISOString(), operator_id: operatorName
          });
          if (p.category !== 'Serviços') {
            return { ...p, stock_current: p.stock_current - cartItem.cart_quantity };
          }
        }
        return p;
      })
    );
    
    setMovements(prev => [...newMovements, ...prev]);
    setCart([]);
    alert("Venda finalizada com sucesso!");
  };

  const addProduct = (productData: Omit<Product, 'id' | 'tenant_id' | 'status'>) => setProducts(prev => [{ ...productData, id: crypto.randomUUID(), tenant_id: 'sidney-001', status: 'ACTIVE' }, ...prev]);
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'tenant_id' | 'status'>) => setSuppliers(prev => [{ ...supplierData, id: crypto.randomUUID(), tenant_id: 'sidney-001', status: 'ACTIVE' }, ...prev]);
  const deleteSupplier = (id: string) => setSuppliers(prev => prev.filter(s => s.id !== id));
  
  const registerMovement = (movData: Omit<StockMovement, 'id' | 'tenant_id' | 'date' | 'operator_id'>, operator: string) => {
    setMovements(prev => [{ ...movData, id: crypto.randomUUID(), tenant_id: 'sidney-001', date: new Date().toISOString(), operator_id: operator }, ...prev]);
    setProducts(prevProducts => prevProducts.map(p => {
      if (p.sku === movData.product_id || p.name === movData.product_id) {
        return { ...p, stock_current: movData.type === 'IN' ? p.stock_current + movData.quantity : p.stock_current - movData.quantity };
      }
      return p;
    }));
  };

  return (
    <StoreContext.Provider value={{ products, cart, movements, suppliers, users, addToCartBySku, removeFromCart, checkout, addProduct, deleteProduct, addSupplier, deleteSupplier, registerMovement }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);