import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroPhrase',
  title: 'Hero Phrase',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'placement',
      title: 'Placement',
      type: 'string',
      initialValue: 'topLeft',
      options: {
        list: [
          {title: 'Top Left', value: 'topLeft'},
          {title: 'Middle Right', value: 'middleRight'},
          {title: 'Bottom Left', value: 'bottomLeft'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'text',
      subtitle: 'placement',
    },
  },
})
