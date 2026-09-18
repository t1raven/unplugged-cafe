import type { DeliveryMethod } from '@/types/order';

export const DELIVERY_FEE = 3000;

export function getDeliveryFee(
  method: DeliveryMethod
) {
  return method === 'delivery'
    ? DELIVERY_FEE
    : 0;
}