import {defineField, defineType} from 'sanity'

export const headerSettings = defineType({
  name: 'headerSettings',
  title: 'Header Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'primaryMenu',
      title: 'Primary menu',
      description: 'Main header menu.',
      type: 'menuGroup',
      initialValue: {
        menuId: 'primary',
        title: 'Primary',
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          const menu = value as {menuId?: string} | undefined
          if (!menu) return true
          if (menu.menuId !== 'primary') {
            return 'Primary menu must use menuId "primary".'
          }
          return true
        }),
    }),
    defineField({
      name: 'secondaryMenu',
      title: 'Secondary menu',
      description: 'Secondary/utility header menu.',
      type: 'menuGroup',
      initialValue: {
        menuId: 'secondary',
        title: 'Secondary',
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          const menu = value as {menuId?: string} | undefined
          if (!menu) return true
          if (menu.menuId !== 'secondary') {
            return 'Secondary menu must use menuId "secondary".'
          }
          return true
        }),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Header CTA label',
      type: 'string',
      initialValue: 'createdByBlack',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Header CTA link',
      type: 'cbLink',
      initialValue: {
        linkType: 'external',
        externalUrl: 'https://createdbyblack.com',
        openInNewTab: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Header Settings',
      }
    },
  },
})
