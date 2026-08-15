import {defineField, defineType} from 'sanity'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: '갤러리 아이템',
  type: 'document',

  fields: [
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
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: '설명',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),

    defineField({
      name: 'view',
      title: '공개',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category.name',
    },
  },
})