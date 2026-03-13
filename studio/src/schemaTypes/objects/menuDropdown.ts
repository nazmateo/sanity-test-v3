import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuDropdown = defineType({
  name: 'menuDropdown',
  title: 'Menu Dropdown',
  type: 'object',
  fields: [
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [defineArrayMember({type: 'menuDropdownSection'})],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Menu Dropdown',
      }
    },
  },
})
