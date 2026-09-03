import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const menuCategory = defineType({
  name: 'menuCategory',
  title: '카페 카테고리',
  type: 'document',

  orderings: [
    orderRankOrdering,
  ],

  fields: [

    orderRankField({
      type: 'menuCategory',
      newItemPosition: 'before',
    }),

    defineField({
      name: 'title',
      title: '카테고리명',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
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
      name: 'visible',
      title: '노출',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
})