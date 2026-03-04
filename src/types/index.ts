export interface TenantConfig {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'blocked';
  primaryColor: string;
  logoUrl: string;
  monthlyGoal: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  batteryHealth?: number; // Específico para iPhone
  condition: 'new' | 'vitrine' | 'used';
}

export interface Sale {
  id: string;
  vendedor: string;
  total: number;
  date: string;
}