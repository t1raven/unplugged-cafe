import type { PortableTextBlock } from 'sanity';
import type { Artist } from './artist';
import type { Place } from './place';

export interface Performance {
  _id: string;
  title: string;
  slug?: {
    current?: string;
  };
  date: string;
  salesOpen?: string;
  salesClose?: string;
  poster?: {
    asset?: {
      _ref?: string;
      _id?: string;
    };
  };
  description?: PortableTextBlock[];
  notice?: PortableTextBlock[];
  price1?: number;
  price2?: number;
  admissionType?: string;
  viewingType?: string;
  reservationOpen?: boolean;
  reservationUrl?: string;
  artists?: Artist[];
  place?: Place;
}