export interface CartOption {
 name: string;
 value: string;
}

export interface CartItem {
 cartId: string;

 goodsId: string;
 slug: string;

 name: string;
 
 price: number;
 salePrice?: number;

 quantityDiscounts?: {
   minQuantity: number;
   unitPrice: number;
 }[];

 image?: string;

 options: CartOption[];

 quantity: number;
 stock: number;
}