import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutUsSection',
  title: 'About Us Section',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      description:
        'Each row owns a draggable content array. Keep fixed section configuration outside these rows.',
      type: 'array',
      of: [defineArrayMember({type: 'aboutUsContentRow'})],
      validation: (Rule) =>
        Rule.custom((value) => {
          const rows = (value as Array<{_type?: string; layout?: string}> | undefined) || []

          if (rows.length < 1) {
            return 'Rows are required.'
          }

          if (rows.length !== 2) {
            return 'About Us section must contain exactly 2 rows.'
          }

          const introRows = rows.filter((row) => row?._type === 'aboutUsContentRow' && row?.layout === 'intro')
          const statsRows = rows.filter((row) => row?._type === 'aboutUsContentRow' && row?.layout === 'stats')

          if (introRows.length !== 1) {
            return 'About Us section must include exactly one intro row.'
          }

          if (statsRows.length !== 1) {
            return 'About Us section must include exactly one stats row.'
          }

          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'rows.0.content.0.content',
    },
    prepare({title}) {
      return {
        title: title || 'About Us Section',
        subtitle: 'Homepage',
      }
    },
  },
})
