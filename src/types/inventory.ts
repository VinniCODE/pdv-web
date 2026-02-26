// src/types/inventory.ts

export type ProductCategory = 'Smartphones' | 'Wearables' | 'Acessórios' | 'Serviços' | 'Tablets' | 'Computadores';

export interface Product {
  id: string; 
  tenant_id: string; 
  name: string;
  sku: string; 
  category: ProductCategory;
  price: number; 
  cost_price: number; 
  stock_current: number;
  stock_minimum: number; 
  unit_measure: 'UN' | 'CX';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface StockMovement {
  id: string;
  tenant_id: string;
  product_id: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  date: string;
  operator_id: string;
}

export interface Supplier {
  id: string;
  tenant_id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface User {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Operador' | 'Visualizador';
  status: 'ACTIVE' | 'BLOCKED';
}