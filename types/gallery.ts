import type { Category } from './category';

export interface Gallery {
  _id: string;
  title: string;
  description?: string;
  category: Category | null;
  imageUrl: string;
}