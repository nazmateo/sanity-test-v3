import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import {pageBuilderSectionBlockTypes} from '../objects/pageBuilderBlockTypes'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/studio/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'general',
      description: 'Editable on default language only. Translations inherit the same slug.',
      readOnly: ({document}) => {
        const language = (document as {language?: string} | undefined)?.language || 'en'
        return language !== 'en'
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (value?.current === 'home') {
            return 'Slug "home" is reserved for the Home Page singleton.'
          }
          return true
        }),
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: async (slug, context) => {
          const document = context.document as {_id?: string; language?: string}
          const client = context.getClient({apiVersion: '2025-09-25'})
          const id = document?._id?.replace(/^drafts\./, '')
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug,
            language: document?.language || 'en',
          }

          const query = `
            !defined(*[
              !(_id in [$draft, $published]) &&
              _type == "page" &&
              slug.current == $slug &&
              coalesce(language, "en") == $language
            ][0]._id)
          `

          return client.fetch(query, params)
        },
      },
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
      initialValue: 'en',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headerVariant',
      title: 'Header variant',
      type: 'string',
      group: 'general',
      initialValue: 'positive',
      options: {
        list: [
          {title: 'Positive', value: 'positive'},
          {title: 'Negative', value: 'negative'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerVariant',
      title: 'Footer variant',
      type: 'string',
      group: 'general',
      initialValue: 'positive',
      options: {
        list: [
          {title: 'Positive', value: 'positive'},
          {title: 'Negative', value: 'negative'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      group: 'content',
      of: pageBuilderSectionBlockTypes,
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/studio/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta title',
          type: 'string',
          validation: (Rule) => Rule.max(70).warning('Keep meta title under 70 characters.'),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (Rule) =>
            Rule.max(160).warning('Keep meta description under 160 characters.'),
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
        }),
        defineField({
          name: 'noIndex',
          title: 'No index',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'ogTitle',
          title: 'OpenGraph title',
          type: 'string',
        }),
        defineField({
          name: 'ogDescription',
          title: 'OpenGraph description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          title: 'OpenGraph image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured data (application/ld+json)',
      description: 'Paste JSON only (without <script> tags).',
      type: 'text',
      rows: 8,
      group: 'seo',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          try {
            JSON.parse(value)
            return true
          } catch {
            return 'Structured data must be valid JSON.'
          }
        }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      slug: 'slug.current',
      language: 'language',
    },
    prepare({title, slug, language}) {
      const languageLabel = (language || 'en').toUpperCase()
      const path = slug ? `/${slug}` : '(no slug)'
      return {
        title: title || 'Untitled page',
        subtitle: `[${languageLabel}] ${path}`,
      }
    },
  },
})
