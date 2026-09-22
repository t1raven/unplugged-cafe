import { client } from '@/sanity/lib/client';
import type { SiteSettings } from '@/types/siteSettings';

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const query = `
    *[
      _type == "siteSettings" &&
      _id == "siteSettings"
    ][0] {
      siteName,
      businessName,
      address,
      phone,
      businessHours,
      deliveryFee,
      depositAccount,

      seo {
        title,
        description,
        keywords,
        ogImage
      }
    }
  `;

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