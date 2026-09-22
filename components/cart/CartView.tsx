'use client';

import Image from 'next/image';

import type { CartItem } from '@/hooks/cartStore';
import { getGoodsUnitPrice } from '@/lib/goodsPrice';

interface Props {
  items: CartItem[];

  originalTotalPrice: number;
  discountedTotalPrice: number;
  totalDiscountPrice: number;

  removeItem: (
    cartId: string
  ) => void;

  increaseQuantity: (
    cartId: string
  ) => void;

  decreaseQuantity: (
    cartId: string
  ) => void;

  clearCart: () => void;

  closeCart: () => void;

  onOrder: () => void;
}

export default function CartView({
  items,
  originalTotalPrice,
  discountedTotalPrice,
  totalDiscountPrice,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  closeCart,
  onOrder,
}: Props) {
  return (
    <>
      <div className="cart-header">
        <h2>
          장바구니
        </h2>

        <button
          type="button"
          className="cart-close"
          onClick={closeCart}
          aria-label="닫기"
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

            {items.map((item) => {
              const unitPrice = getGoodsUnitPrice( item, item.quantity );
              const originalSubtotal = item.price * item.quantity;
              const subtotal = unitPrice * item.quantity;
              const discountPrice = originalSubtotal - subtotal;

              return (
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

                        {!!item.options.length && (
                          <div className="cart-options">
                            {item.options.map(
                              (option) => (
                                <span
                                  key={`${option.name}-${option.value}`}
                                >
                                  {option.name}: {option.value}
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
                        >
                          +
                        </button>
                      </div>

                      <strong>
                        {subtotal.toLocaleString()}
                        원
                      </strong>

                    </div>
                  </div>
                </article>
              ) 
            })}

          </div>

          <div className="cart-footer">

            {/*<div className="cart-summary">
              <span>
                총 상품금액
              </span>

              <strong>
                {totalPrice.toLocaleString()}
                원
              </strong>
            </div>*/}

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>상품금액</span>

                <strong>
                  {originalTotalPrice.toLocaleString()}
                  원
                </strong>
              </div>

              <div className="cart-summary-row discount">
                <span>할인금액</span>

                <strong>
                  -{totalDiscountPrice.toLocaleString()}
                  원
                </strong>
              </div>

              <div className="cart-summary-row total">
                <span>총 주문금액</span>

                <strong>
                  {discountedTotalPrice.toLocaleString()}
                  원
                </strong>
              </div>
            </div>

            <div className="cart-actions">

              <button
                type="button"
                className="cart-order"
                onClick={onOrder}
              >
                구매하기
              </button>

              <button
                type="button"
                className="cart-clear"
                onClick={clearCart}
              >
                전체 삭제
              </button>

            </div>

          </div>
        </>
      )}
    </>
  );
}