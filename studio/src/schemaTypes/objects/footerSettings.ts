import {defineField, defineType} from 'sanity'

export const footerSettingsFields = [
  defineField({
    name: 'positiveLogo',
    title: 'Positive logo',
    description: 'Logo used on light footer variants.',
    type: 'image',
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
        validation: (rule) => rule.required().warning('Logo alt text improves accessibility.'),
      }),
    ],
  }),
  defineField({
    name: 'negativeLogo',
    title: 'Negative logo',
    description: 'Logo used on dark footer variants.',
    type: 'image',
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
        validation: (rule) => rule.required().warning('Logo alt text improves accessibility.'),
      }),
    ],
  }),
  defineField({
    name: 'navigationGroups',
    title: 'Navigation groups',
    description: 'Column groups displayed in the main footer navigation.',
    type: 'array',
    of: [{type: 'menuGroup'}],
    validation: (rule) => rule.required().min(1),
  }),
  defineField({
    name: 'legalMenu',
    title: 'Legal menu',
    description: 'Optional legal links (privacy, terms, etc).',
    type: 'menuGroup',
    initialValue: {
      menuId: 'legal',
      title: 'Legal',
    },
    validation: (rule) =>
      rule.custom((value) => {
        const menu = value as {menuId?: string} | undefined
        if (!menu) return true
        if (menu.menuId !== 'legal') {
          return 'Legal menu must use menuId "legal".'
        }
        return true
      }),
  }),
  defineField({
    name: 'showDefaultLegalLinks',
    title: 'Show default legal links',
    description: 'Fallback to /privacy-policy and /terms-and-conditions when Legal menu is empty.',
    type: 'boolean',
    initialValue: true,
  }),
  defineField({
    name: 'copyrightText',
    title: 'Copyright text',
    type: 'string',
  }),
]

export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer Settings',
  type: 'object',
  fields: footerSettingsFields,
  preview: {
    prepare() {
      return {
        title: 'Footer Settings',
      }
    },
  },
})
