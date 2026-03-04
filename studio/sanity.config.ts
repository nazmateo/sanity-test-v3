/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {documentInternationalization} from '@sanity/document-internationalization'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// Define the home location for the presentation tool
const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation

// resolveHref() is a convenience function that resolves the URL
// path for different document types and used in the presentation tool.
function resolveHref(documentType?: string, slug?: string, language?: string): string | undefined {
  const basePath = !language || language === 'en' ? '' : `/${language}`
  switch (documentType) {
    case 'homePage':
      return basePath || '/'
    case 'page':
      return slug ? `${basePath}/${slug}` : undefined
    case 'legalPage':
      return slug ? `${basePath}/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'Sanity + Next.js Starter Template',

  projectId,
  dataset,

  plugins: [
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/visual-editing/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "homePage" && coalesce(language, "en") == "en"`,
          },
          {
            route: '/:language',
            filter: `_type == "homePage" && coalesce(language, "en") == $language`,
          },
          {
            route: '/:slug',
            filter: `_type == "page" && (slug.current == $slug || _id == $slug) && coalesce(language, "en") == "en"`,
          },
          {
            route: '/:language/:slug',
            filter:
              `_type == "page" && (slug.current == $slug || _id == $slug) && coalesce(language, "en") == $language`,
          },
          {
            route: '/privacy-policy',
            filter: `_type == "legalPage" && slug == "privacy-policy" && coalesce(language, "en") == "en"`,
          },
          {
            route: '/terms-and-conditions',
            filter: `_type == "legalPage" && slug == "terms-and-conditions" && coalesce(language, "en") == "en"`,
          },
          {
            route: '/:language/privacy-policy',
            filter: `_type == "legalPage" && slug == "privacy-policy" && coalesce(language, "en") == $language`,
          },
          {
            route: '/:language/terms-and-conditions',
            filter:
              `_type == "legalPage" && slug == "terms-and-conditions" && coalesce(language, "en") == $language`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/visual-editing/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          homePage: defineLocations({
            select: {
              language: 'language',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: 'Home',
                  href: resolveHref('homePage', undefined, doc?.language)!,
                },
              ],
            }),
          }),
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {
              name: 'name',
              slug: 'slug.current',
              language: 'language',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href: resolveHref('page', doc?.slug, doc?.language)!,
                },
              ],
            }),
          }),
          legalPage: defineLocations({
            select: {
              title: 'title',
              slug: 'slug',
              language: 'language',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('legalPage', doc?.slug, doc?.language)!,
                },
              ],
            }),
          }),
        },
      },
    }),
    documentInternationalization({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'ae', title: 'UAE'},
      ],
      schemaTypes: ['page', 'legalPage', 'homePage'],
      languageField: 'language',
      weakReferences: true,
      bulkPublish: true,
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    unsplashImageAsset(),
    assist(),
    visionTool(),
  ],
  document: {
    // Hide base templates so editors use the language-aware creation options from i18n.
    newDocumentOptions: (prev) =>
      prev.filter((templateItem) => !['page', 'legalPage', 'homePage'].includes(templateItem.templateId)),
  },

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
  },
})
