import {defineField, defineType} from 'sanity'

export const galleryCategory = defineType({
  name: 'galleryCategory',
  title: '갤러리 카테고리',
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