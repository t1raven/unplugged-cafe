import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const goodsItem = defineType({
  name: 'goodsItem',
  title: '굿즈 아이템',
  type: 'document',

  orderings: [
    orderRankOrdering,
  ],

  fields: [

    orderRankField({
      type: 'goodsItem',
      newItemPosition: 'before',
    }),

    defineField({
      name: 'name',
      title: '상품명',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
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
      name: 'category',
      title: '카테고리',
      type: 'reference',
      to: [
        {
          type: 'goodsCategory',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: '상품 이미지',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'price',
      title: '판매가',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: 'discountPrice',
      title: '할인가',
      type: 'number',
    }),

    defineField({
      name: 'description',
      title: '상품 설명',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'options',
      title: '상품 옵션',
      type: 'array',
      description: '사이즈, 색상 등 구매 시 선택할 옵션',
      of: [
        {
          type: 'object',
          name: 'goodsOption',
          title: '옵션',
          fields: [
            {
              name: 'name',
              title: '옵션명',
              type: 'string',
              description: '예: 사이즈, 색상',
              validation: (Rule) => Rule.required(),
            },

            {
              name: 'values',
              title: '옵션값',
              type: 'array',
              of: [
                {
                  type: 'string',
                },
              ],
              validation: (Rule) => Rule.min(1),
            },
          ],

          preview: {
            select: {
              name: 'name',
              values: 'values',
            },
            prepare({ name, values }) {
              return {
                title: name,
                subtitle: Array.isArray(values)
                  ? values.join(', ')
                  : '',
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: 'stock',
      title: '재고',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.required().integer().min(0),
    }),

    defineField({
      name: 'newItem',
      title: 'NEW',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'bestItem',
      title: 'BEST',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'soldOut',
      title: '품절',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'isAvailable',
      title: '판매중',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
      category: 'category.title',
      price: 'price',
      isAvailable: 'isAvailable',
      soldOut: 'soldOut',
    },

    prepare({title, media, category, price, isAvailable, soldOut}) {
      let status = '판매중';

      if (!isAvailable) status = '판매중지';
      if (soldOut) status = '품절';

      return {
        title,
        subtitle: `${category ?? ''} · ${price?.toLocaleString() ?? 0}원 · ${status}`,
        media,
      }
    },
  },
})