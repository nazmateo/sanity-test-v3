import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import * as demo from '../../lib/initialValues'

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'navigation', title: 'Navigation'},
    {name: 'seo', title: 'SEO'},
    {name: 'scripts', title: 'Scripts & Tracking'},
  ],
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your website.',
      title: 'Title',
      type: 'string',
      initialValue: demo.title,
      group: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description: 'Used on the Homepage',
      title: 'Description',
      type: 'array',
      initialValue: demo.description,
      group: 'general',
      of: [
        // Define a minified block content field for the description. https://www.sanity.io/docs/block-content
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'linkType',
                    title: 'Link Type',
                    type: 'string',
                    initialValue: 'href',
                    options: {
                      list: [
                        {title: 'URL', value: 'href'},
                        {title: 'Page', value: 'page'},
                      ],
                      layout: 'radio',
                    },
                  }),
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    hidden: ({parent}) => parent?.linkType !== 'href' && parent?.linkType != null,
                    validation: (Rule) =>
                      Rule.custom((value, context) => {
                        const parent = context.parent as {linkType?: string} | undefined
                        if (parent?.linkType === 'href' && !value) {
                          return 'URL is required when Link Type is URL'
                        }
                        return true
                      }),
                  }),
                  defineField({
                    name: 'page',
                    title: 'Page',
                    type: 'reference',
                    to: [{type: 'page'}],
                    hidden: ({parent}) => parent?.linkType !== 'page',
                    validation: (Rule) =>
                      Rule.custom((value, context) => {
                        const parent = context.parent as {linkType?: string} | undefined
                        if (parent?.linkType === 'page' && !value) {
                          return 'Page reference is required when Link Type is Page'
                        }
                        return true
                      }),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
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
      name: 'header',
      title: 'Header',
      description: 'Default global header configuration.',
      type: 'headerSettings',
      group: 'navigation',
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      description: 'Default global footer configuration.',
      type: 'footerSettings',
      group: 'navigation',
    }),
    defineField({
      name: 'primaryMenu',
      title: 'Primary menu',
      description: 'Legacy field. Prefer Header > Primary menu.',
      type: 'menuGroup',
      group: 'navigation',
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
      description: 'Legacy field. Prefer Header > Secondary menu.',
      type: 'menuGroup',
      group: 'navigation',
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
      name: 'menuGroups',
      title: 'Additional menu groups',
      description: 'Legacy field. Create extra menu groups (e.g. footer, sidebar, mobile).',
      type: 'array',
      group: 'navigation',
      of: [defineArrayMember({type: 'menuGroup'})],
      validation: (rule) =>
        rule.custom((value) => {
          if (!Array.isArray(value)) {
            return true
          }

          const menuIds = (value as Array<{menuId?: string}>)
            .map((group) => group?.menuId)
            .filter(Boolean)
          const duplicates = menuIds.filter((id, index) => menuIds.indexOf(id) !== index)
          if (duplicates.length > 0) {
            return `Duplicate menu IDs found: ${Array.from(new Set(duplicates)).join(', ')}`
          }

          if (menuIds.includes('primary') || menuIds.includes('secondary')) {
            return 'Use reserved IDs "primary" and "secondary" only in Primary menu / Secondary menu fields.'
          }

          return true
        }),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      group: 'seo',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              const document = context.document as {ogImage?: {asset?: {_ref?: string}}}
              if (document?.ogImage?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    defineField({
      name: 'gtmScript',
      title: 'GTM script',
      description: 'Inline Google Tag Manager script snippet (without <script> tags preferred).',
      type: 'text',
      rows: 6,
      group: 'scripts',
    }),
    defineField({
      name: 'gaScript',
      title: 'GA script',
      description: 'Inline Google Analytics script snippet (without <script> tags preferred).',
      type: 'text',
      rows: 6,
      group: 'scripts',
    }),
    defineField({
      name: 'cookiePolicyScript',
      title: 'Cookie policy script',
      description: 'Inline cookie consent/cookie policy script snippet.',
      type: 'text',
      rows: 6,
      group: 'scripts',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
