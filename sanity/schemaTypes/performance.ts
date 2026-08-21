import {defineField, defineType} from 'sanity'

export const performance = defineType({
  name: 'performance',
  title: '공연 일정',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: '공연명',
      type: 'string',
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
      title: '공연 시간',
      type: 'string',
      description: '예: 20:00',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'place',
      title: '장소',
      type: 'reference',
      to: [
        {
          type: 'place',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      options: {
        source: (doc) => {
          return `${doc.date || ''}-${doc.title || ''}`
        },
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-가-힣]/g, '')
            .replace(/-+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
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
      name: 'artists',
      title: '라인업',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'artist',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'price1',
      title: '사전 예매 가격',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: 'price2',
      title: '현장 예매 가격',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: 'description',
      title: '공연 소개',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),

    defineField({
      name: 'notice',
      title: '공지 사항',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),

    defineField({
      name: 'admissionType',
      title: '입장 방식',
      type: 'string',
      options: {
        list: [
          {title: '입장번호순', value: '1'},
          {title: '공연장대기순', value: '2'},
        ],
      },
    }),

    defineField({
      name: 'viewingType',
      title: '관람 방식',
      type: 'string',
      options: {
        list: [
          {title: '좌석', value: '1'},
          {title: '입석', value: '2'},
        ],
      },
    }),

    defineField({
      name: 'reservationUrl',
      title: '예매 신청 URL',
      type: 'url',
    }),

    defineField({
      name: 'reservationOpen',
      title: '예매 가능',
      type: 'boolean',
      initialValue: false,
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
      time: 'startTime',
      media: 'poster',
    },

    prepare({title, date, time, media}) {
      return {
        title,
        subtitle: `${date ?? ''} ${time ?? ''}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: '공연 날짜 순',
      name: 'orderDesc',
      by: [
        {
          field: 'date', 
          direction: 'desc'
        },
        {
          field: 'startTime', 
          direction: 'asc'
        },
      ],
    },
  ],
})