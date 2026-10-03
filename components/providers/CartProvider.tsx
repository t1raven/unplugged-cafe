'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { CartItem, CartOption } from '@/types/cart';

interface CartState {
 items: CartItem[];

 isCartOpen: boolean;

 openCart: () => void;
 closeCart: () => void;
 toggleCart: () => void;

 addItem: (item: Omit<CartItem, 'cartId'>) => void;

 removeItem: (cartId: string) => void;

 increaseQuantity: (cartId: string) => void;

 decreaseQuantity: (cartId: string) => void;

 updateQuantity: (
   cartId: string,
   quantity: number
 ) => void;

 clearCart: () => void;

 getTotalQuantity: () => number;

 getTotalPrice: () => number;
}

const createCartId = (
 goodsId: string,
 options: CartOption[]
) => {
 const optionKey = options
   .map((option) => `${option.name}:${option.value}`)
   .sort()
   .join('|');

 return optionKey
   ? `${goodsId}__${optionKey}`
   : goodsId;
};

const createCartStore = () => createStore<CartState>()(
 persist(
   (set, get) => ({
     items: [],

     isCartOpen: false,

     openCart: () => {
       set({
         isCartOpen: true,
       });
     },

     closeCart: () => {
       set({
         isCartOpen: false,
       });
     },

     toggleCart: () => {
       set((state) => ({
         isCartOpen: !state.isCartOpen,
       }));
     },

     addItem: (item) => {
       const cartId = createCartId(
         item.goodsId,
         item.options
       );

       set((state) => {
         const existingItem = state.items.find(
           (cartItem) =>
             cartItem.cartId === cartId
         );

         if (existingItem) {
           return {
             items: state.items.map(
               (cartItem) =>
                 cartItem.cartId === cartId
                   ? {
                       ...cartItem,
                       quantity:
                         cartItem.quantity +
                         item.quantity,
                     }
                   : cartItem
             ),
           };
         }

         return {
           items: [
             ...state.items,
             {
               ...item,
               cartId,
             },
           ],
         };
       });
     },

     removeItem: (cartId) => {
       set((state) => ({
         items: state.items.filter(
           (item) => item.cartId !== cartId
         ),
       }));
     },

     increaseQuantity: (cartId) => {
       set((state) => ({
         items: state.items.map((item) =>
           item.cartId === cartId
             ? {
                 ...item,
                 quantity:
                   item.quantity + 1,
               }
             : item
         ),
       }));
     },

     decreaseQuantity: (cartId) => {
       set((state) => ({
         items: state.items
           .map((item) =>
             item.cartId === cartId
               ? {
                   ...item,
                   quantity:
                     item.quantity - 1,
                 }
               : item
           )
           .filter(
             (item) => item.quantity > 0
           ),
       }));
     },

     updateQuantity: (
       cartId,
       quantity
     ) => {
       if (quantity <= 0) {
         get().removeItem(cartId);
         return;
       }

       set((state) => ({
         items: state.items.map((item) =>
           item.cartId === cartId
             ? {
                 ...item,
                 quantity,
               }
             : item
         ),
       }));
     },

     clearCart: () => {
       set({
         items: [],
       });
     },

     getTotalQuantity: () => {
       return get().items.reduce(
         (total, item) =>
           total + item.quantity,
         0
       );
     },

     getTotalPrice: () => {
       return get().items.reduce(
         (total, item) =>
           total +
           item.price * item.quantity,
         0
       );
     },
   }),

   {
     name: 'unplugged-cart',
     skipHydration: true,

     partialize: (state) => ({
       items: state.items,
     }),
   }
 )
);
type CartStore = ReturnType<typeof createCartStore>;
const CartContext = createContext<CartStore | undefined>(undefined);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createCartStore);

  useEffect(() => {
    void store.persist.rehydrate();
  }, [store]);

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

type CartValue = CartState & { cartCount: number };

const withCartCount = (state: CartState): CartValue => ({
  ...state,
  cartCount: state.items.reduce((total, item) => total + item.quantity, 0),
});

export function useCart(): CartValue;
export function useCart<T>(selector: (state: CartValue) => T): T;
export function useCart<T>(selector?: (state: CartValue) => T) {
  const store = useContext(CartContext);
  if (!store) throw new Error('useCart must be used within CartProvider');
  const selected = useStore(store, (state): T | CartState =>
    selector ? selector(withCartCount(state)) : state
  );
  return useMemo(() => selector ? selected : withCartCount(selected as CartState), [selector, selected]);
}