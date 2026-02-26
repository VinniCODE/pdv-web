// src/types/inventory.ts

export type ProductCategory = 'Smartphones' | 'Wearables' | 'Acessórios' | 'Serviços';

export interface Product {
  id: string; // UUID
  tenant_id: string; // UUID da empresa
  name: string;
  sku: string; // Código único (Ex: IPH-15-PRO-256)
  category: ProductCategory;
  price: number; // Preço de venda
  cost_price: number; // Preço de custo (importante para relatórios depois)
  stock_current: number;
  stock_minimum: number; // Dispara o alerta de reposição
  unit_measure: 'UN' | 'CX';
  status: 'ACTIVE' | 'INACTIVE';
}