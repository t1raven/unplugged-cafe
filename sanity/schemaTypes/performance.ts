import {defineField, defineType} from 'sanity'

export const performance = defineType({
  name: 'performance',
  title: '공연',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: '공연명',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-가-힣]+/g, '')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'date',
      title: '공연 날짜',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'startTime',
      title: '공연 시작 시간',
      type: 'string',
      description: '예: 20:00',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'endTime',
      title: '공연 종료 시간',
      type: 'string',
      description: '예: 22:00',
    }),

    defineField({
      name: 'artist',
      title: '아티스트',
      type: 'reference',
      to: [
        {
          type: 'artist',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'genre',
      title: '장르',
      type: 'string',
      options: {
        list: [
          {title: '어쿠스틱', value: 'acoustic'},
          {title: '재즈', value: 'jazz'},
          {title: '록', value: 'rock'},
          {title: '팝', value: 'pop'},
          {title: '인디', value: 'indie'},
          {title: '블루스', value: 'blues'},
          {title: '기타', value: 'etc'},
        ],
      },
    }),

    defineField({
      name: 'poster',
      title: '공연 포스터',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'description',
      title: '공연 설명',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),

    defineField({
      name: 'price',
      title: '티켓 가격',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: 'reservationOpen',
      title: '예약 가능',
      type: 'boolean',
      initialValue: true,
    }),

    defineField({
      name: 'featured',
      title: '메인 노출',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'poster',
    },

    prepare({title, date, media}) {
      return {
        title,
        subtitle: `${date ?? ''}`,
        media,
      }
    },
  },
})