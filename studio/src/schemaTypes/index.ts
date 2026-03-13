import {page} from './documents/page'
import {legalPage} from './documents/legalPage'
import {settings} from './singletons/settings'
import {homePage} from './singletons/homePage'
import {header} from './singletons/header'
import {footer} from './singletons/footer'
import {blockContent} from './objects/blockContent'
import {blockContentTextOnly} from './objects/blockContentTextOnly'
import cbButton from './objects/button'
import cbButtons from './objects/buttons'
import cbColumn from './objects/column'
import cbColumns from './objects/columns'
import cbCover from './objects/cover'
import cbGroup from './objects/group'
import cbHeading from './objects/heading'
import cbHtml from './objects/html'
import cbImage from './objects/image'
import cbLink from './objects/link'
import cbListItem from './objects/list-item'
import cbList from './objects/list'
import cbMedia from './objects/media'
import {menuGroup} from './objects/menuGroup'
import {menuDropdown} from './objects/menuDropdown'
import {menuDropdownSection} from './objects/menuDropdownSection'
import {menuLink} from './objects/menuLink'
import {menuSubLink} from './objects/menuSubLink'
import cbNavigationLink from './objects/navigation-link'
import cbNavigation from './objects/navigation'
import cbParagraph from './objects/paragraph'
import cbWysiwyg from './objects/wysiwyg'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  homePage,
  header,
  footer,
  // Documents
  page,
  legalPage,
  // Objects
  cbButton,
  cbButtons,
  cbColumn,
  cbColumns,
  cbCover,
  cbGroup,
  cbHeading,
  cbHtml,
  cbImage,
  cbLink,
  cbListItem,
  cbList,
  cbMedia,
  menuGroup,
  menuDropdown,
  menuDropdownSection,
  menuLink,
  menuSubLink,
  cbNavigationLink,
  cbNavigation,
  cbParagraph,
  cbWysiwyg,
  blockContent,
  blockContentTextOnly,
]
