import { Product } from '@prisma/client';

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: {
    categories: Array<{ id: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
  };
}
