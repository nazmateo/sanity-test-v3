import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutUsSection',
  title: 'About Us Section',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'cbImage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      description:
        'Keep heading, paragraph, and CTA as separate draggable items for Presentation Tool.',
      type: 'array',
      of: [
        defineArrayMember({type: 'cbHeading'}),
        defineArrayMember({type: 'cbParagraph'}),
        defineArrayMember({type: 'cbButton'}),
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          const items = (value as Array<{_type?: string; actionType?: string; link?: unknown}> | undefined) || []

          if (items.length < 1) {
            return 'Content is required.'
          }

          const hasHeading = items.some((item) => item?._type === 'cbHeading')
          const hasParagraph = items.some((item) => item?._type === 'cbParagraph')
          const ctas = items.filter((item) => item?._type === 'cbButton')

          if (!hasHeading) {
            return 'Content must include a heading.'
          }

          if (!hasParagraph) {
            return 'Content must include a paragraph.'
          }

          if (ctas.length < 1) {
            return 'Content must include a CTA button.'
          }

          const invalidCta = ctas.find((item) => item.actionType !== 'link' || !item.link)
          if (invalidCta) {
            return 'CTA buttons in content must use the link action type and include a link.'
          }

          return true
        }),
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      description: 'Enter the cards in visual order: left column top-to-bottom, then middle, then right.',
      type: 'array',
      of: [defineArrayMember({type: 'aboutUsStat'})],
      validation: (Rule) => Rule.min(1).max(6).required(),
    }),
  ],
  preview: {
    select: {
      title: 'content.0.content',
    },
    prepare({title}) {
      return {
        title: title || 'About Us Section',
        subtitle: 'Homepage',
      }
    },
  },
})
