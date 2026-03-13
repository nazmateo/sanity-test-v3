import {CogIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = ['settings', 'header', 'footer', 'assist.instruction.context']
const DEFAULT_LANGUAGE = 'en'

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      ...S.documentTypeListItems()
        // Remove the "assist.instruction.context" and "settings" content  from the list of content types
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        // Show only default-language page documents in the main Pages list.
        .map((listItem) => {
          if (listItem.getId() === 'page') {
            return S.listItem()
              .id('page')
              .title('Pages')
              .schemaType('page')
              .child(
                S.documentList()
                  .title('Pages')
                  .schemaType('page')
                  .filter('_type == "page" && coalesce(language, "en") == $defaultLanguage')
                  .params({defaultLanguage: DEFAULT_LANGUAGE}),
              )
          }
          if (listItem.getId() === 'homePage') {
            return S.listItem()
              .id('homePage')
              .title('Home Page')
              .schemaType('homePage')
              .child(
                S.documentList()
                  .title('Home Page')
                  .schemaType('homePage')
                  .filter('_type == "homePage" && coalesce(language, "en") == $defaultLanguage')
                  .params({defaultLanguage: DEFAULT_LANGUAGE}),
              )
          }

          return listItem
        })
        // Pluralize the title of each document type. This is not required but just an option to consider.
        .map((listItem) => {
          return listItem.title(pluralize(listItem.getTitle() as string))
        }),
      // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
      S.listItem().title('Header').child(S.document().schemaType('header').documentId('siteHeader')),
      S.listItem().title('Footer').child(S.document().schemaType('footer').documentId('siteFooter')),
    ])
