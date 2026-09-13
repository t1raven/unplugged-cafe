'use client';

import {
  useEffect,
  useMemo,
} from 'react';

import Image from 'next/image';

import { useCartStore } from '@/store/cartStore';

import './CartModal.scss';

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

  const totalPrice = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  }, [items]);

  useEffect(() => {
    if (!isCartOpen) return;

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

  return (
    <div
      className="cart-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-modal-title"
    >
      <button
        type="button"
        className="cart-backdrop"
        onClick={closeCart}
        aria-label="장바구니 닫기"
      />

      <div className="cart-panel">
        <div className="cart-header">
          <h2 id="cart-modal-title">
            장바구니
          </h2>

          <button
            type="button"
            className="cart-close"
            onClick={closeCart}
            aria-label="장바구니 닫기"
          >
            <span className="material-symbols-rounded">
              close
            </span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            장바구니가 비어 있습니다.
          </div>
        ) : (
          <>
            <div className="cart-list">
              {items.map((item) => (
                <article
                  key={item.cartId}
                  className="cart-item"
                >
                  {item.image && (
                    <div className="cart-image">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                      />
                    </div>
                  )}

                  <div className="cart-info">
                    <div className="cart-item-head">
                      <div>
                        <h3>
                          {item.name}
                        </h3>

                        {item.options.length >
                          0 && (
                          <div className="cart-options">
                            {item.options.map(
                              (option) => (
                                <span
                                  key={`${option.name}-${option.value}`}
                                >
                                  {
                                    option.name
                                  }
                                  :{' '}
                                  {
                                    option.value
                                  }
                                </span>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() =>
                          removeItem(
                            item.cartId
                          )
                        }
                        aria-label={`${item.name} 삭제`}
                      >
                        <span className="material-symbols-rounded">
                          delete
                        </span>
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.cartId
                            )
                          }
                          disabled={
                            item.quantity <= 1
                          }
                          aria-label="수량 감소"
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              item.cartId
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.stock
                          }
                          aria-label="수량 증가"
                        >
                          +
                        </button>
                      </div>

                      <strong>
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                        원
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-summary">
                <span>
                  총 상품금액
                </span>

                <strong>
                  {totalPrice.toLocaleString()}
                  원
                </strong>
              </div>

              <div className="cart-actions">
                <button
                  type="button"
                  className="cart-clear"
                  onClick={clearCart}
                >
                  전체 삭제
                </button>

                <button
                  type="button"
                  className="cart-order"
                >
                  구매 신청
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}