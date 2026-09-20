'use client';

import { useState } from 'react';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

import { useCartStore } from '@/store/cartStore';
import { getDiscountRate } from '@/lib/goodsPrice';

import type { Goods } from '@/types/goods';

interface Props {
  goods: Goods;

  onOpenOptionModal: (
    goods: Goods
  ) => void;
}

export default function GoodsCard({
  goods,
  onOpenOptionModal,
}: Props) {

  const addItem = useCartStore((state) => state.addItem);

  const [added, setAdded] = useState(false);

  const basePrice = goods.price;

  const displayPrice = goods.salePrice ?? goods.price;

  const discountRate =
    getDiscountRate(
      goods.price,
      goods.salePrice
    );

  const isSoldOut =
    goods.soldOut ||
    goods.stock <= 0;

  const hasOptions =
    Array.isArray(goods.options) &&
    goods.options.length > 0;

  const handleAddCart = () => {
    if (isSoldOut || added) return;

    /*
     * 옵션이 있으면
     * 공용 모달에 현재 상품 전달
     */
    if (hasOptions) {
      onOpenOptionModal(goods);
      return;
    }

    /*
     * 옵션이 없으면
     * 장바구니 즉시 추가
     */
    addItem({
      goodsId: goods._id,
      slug: goods.slug,
      name: goods.name,
      price: goods.price,
      salePrice: goods.salePrice ?? undefined,
      quantityDiscounts: goods.quantityDiscounts ?? undefined,
      image: goods.image,
      options: [],
      quantity: 1,
      stock: goods.stock,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <article className={`goods-card${isSoldOut ? ' soldOut' : ''}`}>
      <div className="goods-card__top">
        {(goods.newItem || goods.bestItem) && (
          <div className="goods-card__label">
            {goods.newItem && (
              <div className="goods-card__label_item new">NEW</div>
            )}
            {goods.bestItem && (
              <div className="goods-card__label_item best">BEST</div>
            )}
          </div>
        )}
        
        <div className="goods-card__image">
          {goods.image && (
            <Image
              src={urlFor(goods.image)
                .width(600)
                .url()}
              alt={goods.name}
              fill
              priority
              sizes="(max-width: 768px) 50vw, 400px"
            />
          )}
        </div>

        <button
          type="button"
          className="goods-add-cart"
          onClick={handleAddCart}
          disabled={isSoldOut}
        >
          <div className={`${added ? ' added' : ''}`}>
            {isSoldOut ?
              <>
                <span className="material-symbols-rounded icon">error</span>
                <span className="text">품절</span> 
              </>
              : added ? 
              <>
                <span className="material-symbols-rounded icon">check_circle</span>
                <span className="text">담았습니다</span> 
              </>
              : <span className="material-symbols-rounded icon">add_shopping_cart</span>
            }
          </div>
        </button>
      </div>

      <div className="goods-card__info">
        {(goods.newItem || goods.bestItem) && (
          <div className="goods-card__label">
            {goods.newItem && (
              <div className="goods-card__label_item new">NEW</div>
            )}
            {goods.bestItem && (
              <div className="goods-card__label_item best">BEST</div>
            )}
          </div>
        )}
        <div className="goods-card__title">
          <h2>{goods.name}</h2>

          {/*<strong>
            {goods.price.toLocaleString()}원
          </strong>*/}
        </div>

        <div className="goods-card__price">
          {goods.salePrice != null && goods.salePrice < goods.price && (
            <del>
              {basePrice.toLocaleString()}원
            </del>
          )}

          <strong>
            {discountRate > 0 && (
              <span className="discount-rate">
                {discountRate}%
              </span>
            )}
            {displayPrice.toLocaleString()}원
          </strong>
        </div>

        {goods.quantityDiscounts?.length ? (
          <div className="quantity-discounts">
            {goods.quantityDiscounts.map(
              (discount) => (
                <span
                  key={
                    discount.minQuantity
                  }
                >
                  {discount.minQuantity}개 이상 구매시{' '}
                  {discount.unitPrice.toLocaleString()}원
                </span>
              )
            )}
          </div>
        ) : null}

        {goods.description && (
          <p className="goods-card__description">{goods.description}</p>
        )}
      </div>
    </article>
  );
}