import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

// 공연 자동 동기화 및 아카이브 연도별 분류에서 사용하는 카테고리 ID
const PERFORMANCE_CATEGORY_ID = 'b357b289-48b0-4924-b0ef-7ee003296edf'

function isPerformanceCategory(category: unknown): boolean {
  return (
    typeof category === 'object' &&
    category !== null &&
    '_ref' in category &&
    category._ref === PERFORMANCE_CATEGORY_ID
  )
}

export const galleryItem = defineType({
  name: 'galleryItem',
  title: '아카이브 이미지',
  type: 'document',

  orderings: [
    orderRankOrdering,
  ],

  fields: [

    orderRankField({
      type: 'galleryItem',
      newItemPosition: 'before',
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
      name: 'label',
      title: '라벨',
      type: 'string',
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
      initialValue: true,
    }),

    defineField({
      name: 'performance',
      title: '연결된 공연',
      type: 'reference',
      to: [{type: 'performance'}],
      readOnly: ({document}) => !isPerformanceCategory(document?.category),
      hidden: ({document, value}) =>
        !isPerformanceCategory(document?.category) && !value,
    }),

    defineField({
      name: 'performanceDate',
      title: '공연 일시',
      type: 'datetime',
      readOnly: ({document}) => !isPerformanceCategory(document?.category),
      hidden: ({document, value}) =>
        !isPerformanceCategory(document?.category) && !value,
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
