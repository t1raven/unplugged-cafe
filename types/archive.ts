import type { Category } from './category';

export interface Archive {
  _id: string;
  title: string;
  description?: string;
  category: Category | null;
  imageUrl: string;
}