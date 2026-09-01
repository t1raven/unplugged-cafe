import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const galleryCategory = defineType({
  name: 'galleryCategory',
  title: '기록 카테고리',
  type: 'document',

  orderings: [
    orderRankOrdering,
  ],

  fields: [

    orderRankField({
      type: 'galleryCategory',
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
      visible: 'visible',
    },

    prepare({ title, visible }) {
      return {
        title,
        subtitle: `${visible ? '노출' : '숨김'}`,
      };
    },
  },
})