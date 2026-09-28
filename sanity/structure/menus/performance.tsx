import type {MenuFactory} from '../types'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {MarkerIcon} from '@sanity/icons/Marker'
import {StarIcon} from '@sanity/icons/Star'
import {PerformanceCountBadge} from '../../components/StudioCountBadge'
export const createPerformanceMenu: MenuFactory = (S) => {
  return S.listItem()
    .id('performances')
    .title('공연 일정')
    .icon(CalendarIcon)
    .child(async () => {
      const now = new Date()

      const todayStart = new Date(now)
      todayStart.setHours(0, 0, 0, 0)

      const tomorrowStart = new Date(todayStart)
      tomorrowStart.setDate(tomorrowStart.getDate() + 1)

      const todayStartISO = todayStart.toISOString()
      const tomorrowStartISO = tomorrowStart.toISOString()

      return S.list()
        .id('performance-list')
        .title('공연 일정')
        .items([
          S.listItem()
            .id('performance-today')
            .title(`오늘 공연`)
            .icon(() => PerformanceCountBadge({ type: 'today' }))
            .child(
              S.documentList()
                .id('performance-today-list')
                .title('오늘 공연')
                .schemaType('performance')
                .filter(`
                  _type == "performance"
                  && date >= $todayStart
                  && date < $tomorrowStart
                `)
                .params({
                  todayStart: todayStartISO,
                  tomorrowStart: tomorrowStartISO,
                })
                .defaultOrdering([
                  {
                    field: 'date',
                    direction: 'desc',
                  },
                ])
            ),

          S.listItem()
            .id('performance-upcoming')
            .title(`다가오는 공연`)
            .icon(() => PerformanceCountBadge({ type: 'upcoming' }))
            .child(
              S.documentList()
                .id('performance-upcoming-list')
                .title('다가오는 공연')
                .schemaType('performance')
                .filter(`
                  _type == "performance"
                  && date >= $tomorrowStart
                `)
                .params({
                  tomorrowStart: tomorrowStartISO,
                })
                .defaultOrdering([
                  {
                    field: 'date',
                    direction: 'desc',
                  },
                ])
            ),

          S.listItem()
            .id('performance-past')
            .title(`이전 공연`)
            .icon(() => PerformanceCountBadge({ type: 'past' }))
            .child(
              S.documentList()
                .id('performance-past-list')
                .title('이전 공연')
                .schemaType('performance')
                .filter(`
                  _type == "performance"
                  && date < $todayStart
                `)
                .params({
                  todayStart: todayStartISO,
                })
                .defaultOrdering([
                  {
                    field: 'date',
                    direction: 'desc',
                  },
                ])
            ),
        ]);
    })
}
export const createPlaceMenu: MenuFactory = (S) => {
  return S.documentTypeListItem('place').title('공연 장소').icon(MarkerIcon)
}
export const createArtistMenu: MenuFactory = (S) => {
  return S.documentTypeListItem('artist').title('아티스트').icon(StarIcon)
}
