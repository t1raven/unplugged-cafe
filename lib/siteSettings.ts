import { client } from '@/sanity/lib/client';
import type { SiteSettings } from '@/types/siteSettings';

const query = `
    *[
      _type == "siteSettings" &&
      _id == "siteSettings"
    ][0] {
      general {
        siteName,
        businessName,
        address,
        phone,
        businessHours
      },

      orderDelivery {
        deliveryFee,
        depositAccount,
        pickupAddress,
        pickupHours
      },

      seo {
        title,
        description,
        keywords,
        ogImage
      }
    }
  `;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const settings = client.fetch<SiteSettings | null>(
    query,
    {},
    {
      next: {
        revalidate: 60,
        tags: ['siteSettings'],
      },
    }
  );

  return settings;
}