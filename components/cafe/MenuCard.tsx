'use client';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

import type { Cafe } from '@/types/cafe'

interface Props {
  item: Cafe;
}

export default function GoodsCard({
  item,
}: Props) {

  return (
    <article className="menu-card">
      <div className="menu-card__image">
        {(item.newItem || item.bestItem) && (
          <div className="menu-card__label">
            {item.newItem && (
              <div className="menu-card__label_item new">NEW</div>
            )}
            {item.bestItem && (
              <div className="menu-card__label_item best">BEST</div>
            )}
          </div>
        )}
          
        {item.imageUrl && (
          <Image
            src={urlFor(item.imageUrl)
              .width(600)
              .url()}
            alt={item.name}
            fill
            priority
            sizes="(max-width: 768px) 50vw, 400px"
          />
        )}
      </div>
      
      <div className="menu-card__info">
        {(item.newItem || item.bestItem) && (
          <div className="menu-card__label">
            {item.newItem && (
              <div className="menu-card__label_item new">NEW</div>
            )}
            {item.bestItem && (
              <div className="menu-card__label_item best">BEST</div>
            )}
          </div>
        )}
        <div className="menu-card__title">
          <h2>{item.name}</h2>

          <strong>
            {item.price.toLocaleString()}원
          </strong>
        </div>

        {item.description && (
          <p>{item.description}</p>
        )}
      </div>
    </article>
  );
}