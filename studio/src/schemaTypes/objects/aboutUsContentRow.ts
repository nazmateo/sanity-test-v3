import {defineField, defineType} from 'sanity'

import {pageBuilderComposableBlockTypes} from './pageBuilderBlockTypes'

export default defineType({
  name: 'aboutUsContentRow',
  title: 'About Us Content Row',
  type: 'object',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      description: 'Describes how this row should be rendered in the About Us section.',
      type: 'string',
      initialValue: 'intro',
      options: {
        list: [
          {title: 'Intro', value: 'intro'},
          {title: 'Stats', value: 'stats'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      description:
        'Reusable nested content for the section. Use composable blocks only, not other sections.',
      type: 'array',
      of: pageBuilderComposableBlockTypes,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const items = (value as Array<{_type?: string}> | undefined) || []
          const layout = (context.parent as {layout?: string} | undefined)?.layout

          if (items.length < 1) {
            return 'Content is required.'
          }

          if (layout === 'intro' && !items.some((item) => item?._type === 'cbImage')) {
            return 'Intro row must include an image item.'
          }

          if (layout === 'stats' && !items.every((item) => item?._type === 'aboutUsStat')) {
            return 'Stats row must contain only About Us stat items.'
          }

          return true
        }),
    }),
  ],
  preview: {
    select: {
      layout: 'layout',
      title: 'content.0.content',
      value: 'content.0.value',
      label: 'content.0.label',
    },
    prepare({layout, title, value, label}) {
      const previewTitle = title || value || label || 'About Us Content Row'

      return {
        title: previewTitle,
        subtitle: layout === 'stats' ? 'Stats row' : 'Intro row',
      }
    },
  },
})
