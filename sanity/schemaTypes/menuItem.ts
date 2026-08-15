import {defineField, defineType} from 'sanity'
import {BottleIcon} from '@sanity/icons/Bottle'

export const menuItem = defineType({
  name: 'menuItem',
  title: '메뉴 아이템',
  type: 'document',
  icon: BottleIcon,

  fields: [
    defineField({
      name: 'category',
      title: '카테고리',
      type: 'reference',
      to: [
        {
          type: 'menuCategory',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'name',
      title: '메뉴명',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'price',
      title: '가격',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: 'summary',
      title: '요약',
      type: 'string',
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
      name: 'description',
      title: '소개',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),

    defineField({
      name: 'new',
      title: 'NEW',
      type: 'boolean',
      initialValue: true,
    }),

    defineField({
      name: 'best',
      title: 'BEST',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      category: 'category.name',
      price: 'price',
    },

    prepare({title, category, price}) {
      return {
        title,
        subtitle: `${category ?? ''} · ${price ?? ''}`,
      }
    },
  },
})