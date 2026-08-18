import type { PortableTextBlock } from 'sanity';

export interface Artist {
  _id: string;
  name: string;
  slug?: {
    current?: string;
  };
  profileImage?: {
    asset?: {
      _ref?: string;
    };
  };
  genre?: string;
  bio?: PortableTextBlock[];
  instagram?: string;
  youtube?: string;
  website?: string;
}