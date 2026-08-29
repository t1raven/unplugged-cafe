import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: '기록 이미지',
  type: 'document',

  orderings: [
    orderRankOrdering,
  ],

  fields: [

    orderRankField({
      type: 'galleryItem',
    }),

    defineField({
      name: 'image',
      title: '이미지',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: '카테고리',
      type: 'reference',
      to: [
        {
          type: 'galleryCategory',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: '설명',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'display',
      title: '공개',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      media: 'image',
    },

    prepare({ title, category, media }) {
      return {
        title,
        subtitle: category,
        media,
      };
    },
  },
})