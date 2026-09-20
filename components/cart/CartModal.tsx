'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Image from 'next/image';

import { useCartStore } from '@/store/cartStore';
import { getGoodsUnitPrice } from '@/lib/goodsPrice';

import CartView from './CartView';
import OrderView from './OrderView';
import CompleteView from './CompleteView';

import './CartModal.scss';

type CartStep =
  | 'cart'
  | 'order'
  | 'complete';

export default function CartModal() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCartStore();

  const [step, setStep] =
    useState<CartStep>('cart');

  const [orderNumber, setOrderNumber] =
    useState<string | null>(null);

  const originalTotalPrice =
    items.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  const discountedTotalPrice =
    items.reduce(
      (total, item) => {
        const unitPrice =
          getGoodsUnitPrice(
            item,
            item.quantity
          );

        return (
          total +
          unitPrice * item.quantity
        );
      },
      0
    );

  const totalDiscountPrice = originalTotalPrice - discountedTotalPrice;

  const totalPrice = 
    items.reduce(
      (total, item) => {
        const unitPrice =
          getGoodsUnitPrice(
            item,
            item.quantity
          );

        return (
          total +
          unitPrice *
            item.quantity
        );
      },
      0
    );

  useEffect(() => {
    if (!isCartOpen) return;

    // 모달을 새로 열면 장바구니 화면부터
    setStep('cart');
    setOrderNumber(null);

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    const handleKeydown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeydown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        'keydown',
        handleKeydown
      );
    };
  }, [
    isCartOpen,
    closeCart,
  ]);

  if (!isCartOpen) {
    return null;
  }

  const handleComplete = (
    orderNumber: string
  ) => {
    setOrderNumber(orderNumber);

    clearCart();

    setStep('complete');
  };

  return (
    <div
      className="cart-modal"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="cart-backdrop"
        onClick={closeCart}
        aria-label="닫기"
      />

      <div className="cart-panel">

        {step === 'cart' && (
          <CartView
            items={items}
            originalTotalPrice={originalTotalPrice}
            discountedTotalPrice={discountedTotalPrice}
            totalDiscountPrice={totalDiscountPrice}
            removeItem={removeItem}
            increaseQuantity={
              increaseQuantity
            }
            decreaseQuantity={
              decreaseQuantity
            }
            clearCart={clearCart}
            closeCart={closeCart}
            onOrder={() =>
              setStep('order')
            }
          />
        )}

        {step === 'order' && (
          <OrderView
            items={items}
            totalPrice={totalPrice}
            onBack={() =>
              setStep('cart')
            }
            onComplete={
              handleComplete
            }
          />
        )}

        {step === 'complete' && (
          <CompleteView
            orderNumber={
              orderNumber
            }
            onClose={closeCart}
          />
        )}

      </div>
    </div>
  );
}