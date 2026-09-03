import { defineField, defineType } from "sanity";

export const home = defineType({
  name: "home",
  title: "홈",
  type: "document",

  fields: [
    defineField({
      name: "about",
      title: "About",
      type: "object",

      fields: [
        defineField({
          name: "title",
          title: "타이틀",
          type: "text",
          rows: 3,
        }),

        defineField({
          name: "images",
          title: "이미지",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "image",
                  title: "이미지",
                  type: "image",
                  options: {
                    hotspot: true,
                  },
                  validation: (Rule) => Rule.required(),
                }),

                defineField({
                  name: "alt",
                  title: "대체 텍스트",
                  type: "string",
                }),
              ],

              preview: {
                select: {
                  title: "alt",
                  media: "image",
                },
              },
            },
          ],
          validation: Rule => Rule.min(1).max(4).error('이미지는 최소 1개, 최대 4개까지만 등록 가능합니다.')
        }),

        defineField({
          name: "description",
          title: "설명",
          type: "object",

          fields: [
            defineField({
              name: "text",
              title: "텍스트",
              type: "text",
              rows: 5,
            }),

            defineField({
              name: "align",
              title: "정렬",
              type: "string",
              options: {
                list: [
                  { title: "Left", value: "left" },
                  { title: "Center", value: "center" },
                  { title: "Right", value: "right" },
                ],
              },
            }),
          ],
        }),

        defineField({
          name: "caution",
          title: "주의사항",
          type: "object",

          fields: [
            defineField({
              name: "title",
              title: "타이틀",
              type: "string",
            }),

            defineField({
              name: "texts",
              title: "텍스트",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "text",
                      title: "텍스트",
                      type: "text",
                      rows: 2,
                    }),
                  ],

                  preview: {
                    select: {
                      title: "text",
                    },
                  },
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "홈",
      };
    },
  },
});