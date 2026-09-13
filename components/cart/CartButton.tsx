'use client';

import { useEffect, useState } from 'react';

import { useCartStore } from '@/store/cartStore';

export default function CartButton() {
  const [mounted, setMounted] =
    useState(false);

  const items = useCartStore(
    (state) => state.items
  );

  const openCart = useCartStore(
    (state) => state.openCart
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted
    ? items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      )
    : 0;

  return (
    <div className="goods_gnb_cart">
      <nav>
        <button type="button" className="gnb_btn" onClick={openCart} aria-label="장바구니 열기">
          <div className="cart_icon">
            <span className="material-symbols-rounded icon">local_mall</span>
            {count > 0 && (
              <span className="cnt">{count}</span>
            )}
          </div>
          <div className="cart_text">장바구니</div>
        </button>
      </nav>
    </div>
  );
}