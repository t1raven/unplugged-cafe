import {defineField, defineType} from 'sanity'
import {SchemaIcon} from '@sanity/icons/Schema'

export const galleryCategory = defineType({
  name: 'galleryCategory',
  title: '갤러리 카테고리',
  type: 'document',
  icon: SchemaIcon,

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