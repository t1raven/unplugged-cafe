import type { DeliveryMethod } from '@/types/order';
import { getSiteSettings } from '@/sanity/lib/getSiteSettings';

const settings = await getSiteSettings();

export const DELIVERY_FEE = settings?.deliveryFee ?? 3000;

export function getDeliveryFee(
  method: DeliveryMethod
) {
  return method === 'delivery'
    ? DELIVERY_FEE
    : 0;
}