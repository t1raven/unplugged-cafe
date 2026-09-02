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
      title: '공연 일시',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'salesOpen',
      title: '예매 오픈',
      type: 'datetime',
    }),

    defineField({
      name: 'salesClose',
      title: '예매 마감',
      type: 'datetime',
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
        source: (doc: any) => {
          const dateStr = typeof doc.date === 'string' ? doc.date.split('T')[0] : ''
          const titleStr = doc.title || ''
          return dateStr ? `${dateStr}-${titleStr}` : titleStr
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
  ],

  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'poster',
    },

    prepare({title, date, media}) {
      const getDate = new Date(date);

      const year = getDate.getFullYear();
      const month = String(
        getDate.getMonth() + 1
      ).padStart(2, '0');
      const day = String(
        getDate.getDate()
      ).padStart(2, '0');

      const weekday = [
        '일',
        '월',
        '화',
        '수',
        '목',
        '금',
        '토',
      ][getDate.getDay()];

      const hours = String(
        getDate.getHours()
      ).padStart(2, '0');

      const minutes = String(
        getDate.getMinutes()
      ).padStart(2, '0');

      return {
        title,
        subtitle: `${year}-${month}-${day} (${weekday}) ${hours}:${minutes}`,
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
      ],
    },
  ],
})