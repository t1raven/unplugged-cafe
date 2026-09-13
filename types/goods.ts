import type { Category } from './category';

export interface GoodsOption {
  name: string;
  values: string[];
}

export interface Goods {
  _id: string;
  name: string;
  slug: string;

  category: Category | null;
  
  description?: string;
  price: number;
  discountPrice: number;

  image?: string;

  options?: GoodsOption[];

  stock: number;
  newItem: boolean;
  bestItem: boolean;
  soldOut: boolean;
  isAvailable: boolean;
}