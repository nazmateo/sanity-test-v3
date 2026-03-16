import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbButtons',
  title: 'Content Buttons Group',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'cbButton'}, {type: 'splitArrowButton'}],
    }),
  ],
})
