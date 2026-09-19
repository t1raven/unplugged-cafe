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
      name: 'business',
      title: '영업 정보',
    },
    {
      name: 'order',
      title: '주문 / 배송',
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

    // ==================================================
    // 영업 정보
    // ==================================================

    defineField({
      name: 'businessHours',
      title: '영업시간',
      type: 'string',
      group: 'business',
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