import {defineType} from 'sanity'

import {headerSettingsFields} from '../objects/headerSettings'

export const header = defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  fields: headerSettingsFields,
  preview: {
    prepare() {
      return {
        title: 'Header',
      }
    },
  },
})
