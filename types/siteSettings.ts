export interface SanityImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SiteSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: SanityImage;
}

export interface SiteSettings {
  siteName: string;
  phone?: string;
  address: string;
  businessHours: string;
  deliveryFee: number;
  depositAccount: string;
  seo?: SiteSEO;
}