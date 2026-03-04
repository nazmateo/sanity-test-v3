import {defineField, defineType} from 'sanity'

export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Brand logo',
    }),
    defineField({
      name: 'menu',
      title: 'Footer menu',
      description: 'Main footer links.',
      type: 'menuGroup',
      initialValue: {
        menuId: 'footer',
        title: 'Footer',
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          const menu = value as {menuId?: string} | undefined
          if (!menu) return true
          if (menu.menuId !== 'footer') {
            return 'Footer menu must use menuId "footer".'
          }
          return true
        }),
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
      description:
        'Fallback to /privacy-policy and /terms-and-conditions when Legal menu is empty.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright text',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer Settings',
      }
    },
  },
})
