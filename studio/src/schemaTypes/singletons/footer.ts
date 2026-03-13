import {defineType} from 'sanity'

import {footerSettingsFields} from '../objects/footerSettings'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: footerSettingsFields,
  preview: {
    prepare() {
      return {
        title: 'Footer',
      }
    },
  },
})
