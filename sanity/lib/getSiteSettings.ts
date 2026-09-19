import { client } from '@/sanity/lib/client';
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries';

import type { SiteSettings } from '@/types/siteSettings';

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch<SiteSettings | null>(
    SITE_SETTINGS_QUERY,
    {},
    {
      next: {
        revalidate: 60,
        tags: ['siteSettings'],
      },
    }
  );
}