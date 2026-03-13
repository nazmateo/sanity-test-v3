import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuLink = defineType({
  name: 'menuLink',
  title: 'Menu Link',
  type: 'object',
  fields: [
    defineField({
      name: 'itemId',
      title: 'Unique ID',
      description: 'Unique key for frontend mapping (e.g. nav-services).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'cbLink',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {dropdown?: unknown} | undefined
          if (!value && !parent?.dropdown) {
            return 'Link is required when no dropdown is configured.'
          }
          return true
        }),
    }),
    defineField({
      name: 'dropdown',
      title: 'Dropdown',
      description: 'Structured dropdown content for header navigation.',
      type: 'menuDropdown',
    }),
    defineField({
      name: 'subLinks',
      title: 'Sub links',
      description: 'Legacy simple sub links. Prefer Dropdown for new header menus.',
      type: 'array',
      of: [defineArrayMember({type: 'menuSubLink'})],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'itemId',
    },
  },
})
