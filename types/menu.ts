import type { Category } from './category';

export interface Menu {
  _id: string
  name: string
  description?: string
  price: number
  category: Category | null
  imageUrl: string
}