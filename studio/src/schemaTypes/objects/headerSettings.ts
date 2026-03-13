import {defineField, defineType} from 'sanity'

export const headerSettingsFields = [
  defineField({
    name: 'positiveLogo',
    title: 'Positive logo',
    description: 'Logo used on light header variants.',
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
    description: 'Logo used on dark header variants.',
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
    name: 'languageToggleLabelEn',
    title: 'Language toggle label (EN page)',
    type: 'string',
    initialValue: 'AR',
  }),
  defineField({
    name: 'languageToggleLabelAe',
    title: 'Language toggle label (AE page)',
    type: 'string',
    initialValue: 'EN',
  }),
]

export const headerSettings = defineType({
  name: 'headerSettings',
  title: 'Header Settings',
  type: 'object',
  fields: headerSettingsFields,
  preview: {
    prepare() {
      return {
        title: 'Header Settings',
      }
    },
  },
})
