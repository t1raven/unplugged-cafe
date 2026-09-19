import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '사이트 설정',
  type: 'document',

  groups: [
    {
      name: 'general',
      title: '기본 정보',
    },
    {
      name: 'order',
      title: '주문 / 배송',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],

  fields: [
    // ==================================================
    // 기본 정보
    // ==================================================

    defineField({
      name: 'siteName',
      title: '사이트명',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'address',
      title: '주소',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'phone',
      title: '전화번호',
      type: 'string',
      group: 'general',
    }),

    defineField({
      name: 'businessHours',
      title: '영업시간',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),

    // ==================================================
    // 주문 / 배송
    // ==================================================

    defineField({
      name: 'deliveryFee',
      title: '배송비',
      type: 'number',
      group: 'order',
      initialValue: 3000,
      validation: (Rule) =>
        Rule.required()
          .min(0)
          .integer(),
    }),

    defineField({
      name: 'depositAccount',
      title: '입금계좌',
      type: 'string',
      group: 'order',
    }),

    // ==================================================
    // SEO
    // ==================================================

    defineField({
      name: 'seo',
      title: 'SEO 설정',
      type: 'object',
      group: 'seo',

      fields: [
        defineField({
          name: 'title',
          title: '기본 SEO 제목',
          type: 'string',
          description: '예: UNPLUGGED LOUNGE | 홍대 라이브 카페',
          validation: (Rule) =>
            Rule.max(60).warning('검색 노출을 고려하면 60자 이하를 권장합니다.'),
        }),

        defineField({
          name: 'description',
          title: '기본 SEO 설명',
          type: 'text',
          rows: 3,
          description: '검색엔진 및 SNS 공유에 사용되는 사이트 설명',
          validation: (Rule) =>
            Rule.max(160).warning('160자 이하를 권장합니다.'),
        }),

        defineField({
          name: 'keywords',
          title: '키워드',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
          },
          description: '예: 홍대 라이브카페, 홍대 공연, 언플러그드',
        }),

        defineField({
          name: 'ogImage',
          title: '공유 이미지',
          type: 'image',
          description: 'Open Graph / SNS 공유 기본 이미지',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: '사이트 설정',
        subtitle: '사이트 공통 정보',
      };
    },
  },
});