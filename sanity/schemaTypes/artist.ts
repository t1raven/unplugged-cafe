import {defineField, defineType} from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: '아티스트',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: '아티스트명',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      name: 'bio',
      title: '아티스트 소개',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),

    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
    }),

    defineField({
      name: 'youtube',
      title: 'YouTube',
      type: 'url',
    }),

    defineField({
      name: 'website',
      title: '웹사이트',
      type: 'url',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'genre',
      media: 'profileImage',
    },
  },
})