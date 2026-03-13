import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundMedia',
      title: 'Background media',
      type: 'cbMedia',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Hero content',
      description: 'Keep the heading and paragraph as separate draggable items for Presentation.',
      type: 'array',
      of: [defineArrayMember({type: 'cbHeading'}), defineArrayMember({type: 'cbParagraph'})],
      validation: (Rule) => Rule.min(1).required(),
    }),
    defineField({
      name: 'phrases',
      title: 'Hero phrases',
      type: 'array',
      of: [defineArrayMember({type: 'heroPhrase'})],
      validation: (Rule) => Rule.min(1).max(3).required(),
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'cbButton',
    }),
  ],
  preview: {
    select: {
      title: 'content.0.content',
    },
    prepare({title}) {
      return {
        title: title || 'Hero Section',
        subtitle: 'Homepage',
      }
    },
  },
})
