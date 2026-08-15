import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: '갤러리 아이템',
  type: 'document',
  icon: ImageIcon,

  fields: [

    defineField({
      name: 'image',
      title: '이미지',
      type: 'image',
      options: {
        hotspot: true,
      },
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