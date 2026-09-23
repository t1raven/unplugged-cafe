import type { PortableTextBlock } from 'sanity';

export interface Artist {
  _id: string;
  name: string;
  slug?: {
    current?: string;
  };
  bio?: PortableTextBlock[];
  instagram?: string;
  youtube?: string;
  website?: string;
}