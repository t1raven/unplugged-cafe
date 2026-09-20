import type { DeliveryMethod } from '@/types/order';
import { getSiteSettings } from '@/sanity/lib/siteSettings';

const settings = await getSiteSettings();

export function getDeliveryFee(
  method: DeliveryMethod
) {
  return method === 'delivery'
    ? settings?.deliveryFee ?? 3000
    : 0;
}