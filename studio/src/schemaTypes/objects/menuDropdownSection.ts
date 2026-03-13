import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuDropdownSection = defineType({
  name: 'menuDropdownSection',
  title: 'Menu Dropdown Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'menuSubLink'})],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
