import {defineField, defineType} from 'sanity'
import {MarkerIcon} from '@sanity/icons/Marker'

export const place = defineType({
  name: 'place',
  title: '공연 장소',
  type: 'document',
  icon: MarkerIcon,

  fields: [
    defineField({
      name: 'name',
      title: '장소명',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'address',
      title: '주소',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'naverMap',
      title: '네이버 지도 URL',
      type: 'url',
    }),

    defineField({
      name: 'kakaomMap',
      title: '카카오 지도 URL',
      type: 'url',
    }),

    defineField({
      name: 'googleMap',
      title: '구글 지도 URL',
      type: 'url',
    }),

    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-가-힣]+/g, '')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    })
  ],

  preview: {
    select: {
      title: 'name',
    },
  },
})