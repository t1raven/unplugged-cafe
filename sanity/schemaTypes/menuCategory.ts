import {defineField, defineType} from 'sanity'

export const menuCategory = defineType({
  name: 'menuCategory',
  title: '메뉴 카테고리',
  type: 'document',

  fields: [

    defineField({
      name: 'name',
      title: '카테고리명',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'name',
    },
  },
})