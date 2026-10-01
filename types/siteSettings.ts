import type { SanityImage } from './images';

export interface General {
  siteName: string;
  businessName: string;
  phone?: string;
  address: string;
  businessHours: string;
}

export interface OrderDelivery {
  deliveryFee: number;
  depositAccount?: string;
  pickupAddress?: string;
  pickupHours?: string;
}

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: SanityImage;
}

export interface SiteSettings {
  general?: General;
  orderDelivery?: OrderDelivery;
  seo?: SEO;
}