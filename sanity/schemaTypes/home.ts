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
          title: "제목",
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

                defineField({
                  name: "position",
                  title: "위치",
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

              preview: {
                select: {
                  title: "alt",
                  media: "image",
                },
              },
            },
          ],
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