interface QuantityDiscount {
  minQuantity: number;
  unitPrice: number;
}

interface PriceInput {
  price: number;
  salePrice?: number | null;

  quantityDiscounts?: {
    minQuantity: number;
    unitPrice: number;
  }[] | null;
}

export function getGoodsUnitPrice(
  goods: PriceInput,
  quantity: number
) {
  if (!goods) {
    return 0;
  }

  let unitPrice =
    typeof goods.salePrice === 'number' &&
    goods.salePrice < goods.price
      ? goods.salePrice
      : goods.price;

  const discounts =
    [...(goods.quantityDiscounts ?? [])]
      .sort(
        (a, b) =>
          a.minQuantity -
          b.minQuantity
      );

  for (const discount of discounts) {
    if (
      quantity >=
      discount.minQuantity
    ) {
      unitPrice =
        discount.unitPrice;
    }
  }

  return unitPrice;
}

export function getGoodsSubtotal(
  goods: PriceInput,
  quantity: number
) {
  return (
    getGoodsUnitPrice(
      goods,
      quantity
    ) * quantity
  );
}

export function getDiscountRate(
  price: number,
  salePrice?: number | null
) {
  if (
    typeof salePrice !== 'number' ||
    price <= 0 ||
    salePrice >= price
  ) {
    return 0;
  }

  return Math.round(
    ((price - salePrice) / price) * 100
  );
}