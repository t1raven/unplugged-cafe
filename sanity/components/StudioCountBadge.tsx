'use client'

import {Badge} from '@sanity/ui'

import {useStudioCounts} from '../providers/StudioCountProvider'

type CategoryType =
  | 'menuItem'
  | 'galleryItem'
  | 'goodsItem'

type PerformanceType =
  | 'today'
  | 'upcoming'
  | 'past'

type OrderStatus =
  | 'all'
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'inTransit'
  | 'completed'
  | 'cancelled'

function BadgeUI({
  count,
}: {
  count: number
}) {
  return (
    <Badge
      tone={
        count > 0
          ? 'primary'
          : 'default'
      }
      fontSize={1}
      padding={2}
      radius={6}
      style={{
        minWidth: '28px',
        width: 'auto',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        fontVariantNumeric:
          'tabular-nums',
      }}
    >
      {count}
    </Badge>
  )
}

export function PerformanceCountBadge({
  type,
}: {
  type: PerformanceType
}) {
  const counts =
    useStudioCounts()

  return (
    <BadgeUI
      count={
        counts.performance[type]
      }
    />
  )
}

export function CategoryCountBadge({
  type,
  categoryId,
}: {
  type: CategoryType
  categoryId: string
}) {
  const counts =
    useStudioCounts()

  return (
    <BadgeUI
      count={
        counts[type][categoryId]
        ?? 0
      }
    />
  )
}

export function OrderCountBadge({
  status,
}: {
  status: OrderStatus
}) {
  const counts =
    useStudioCounts()

  return (
    <BadgeUI
      count={
        counts.orders[status]
      }
    />
  )
}