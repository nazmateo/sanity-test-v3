import type {CropData, HotspotData} from 'sanity-image'

export type CbButton = {
  _key?: string
  _type: 'cbButton'
  label?: string | null
  actionType?: 'button' | 'link' | null
  link?: CbLink | null
  // Legacy fields
  text?: string | null
  url?: string | null
}

export type SplitArrowButton = {
  _key?: string
  _type: 'splitArrowButton'
  label?: string | null
  link?: CbLink | null
}

export type CbButtons = {
  _key?: string
  _type: 'cbButtons'
  items?: Array<CbButton | SplitArrowButton> | null
}

export type HeroPhrase = {
  _key?: string
  _type: 'heroPhrase'
  text?: string | null
  placement?: 'topLeft' | 'middleRight' | 'bottomLeft' | null
}

export type CbHeading = {
  _key?: string
  _type: 'cbHeading'
  content?: string | null
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | number | null
}

export type CbParagraph = {
  _key?: string
  _type: 'cbParagraph'
  content?: string | null
}

export type CbWysiwyg = {
  _key?: string
  _type: 'cbWysiwyg'
  content?: unknown[] | null
}

export type CbMedia = {
  _key?: string
  _type: 'cbMedia'
  mediaType?: 'image' | 'video' | null
  image?: {
    asset?: {_ref?: string} | null
    alt?: string | null
    crop?: CropData
    hotspot?: HotspotData
  } | null
  videoFile?: {
    asset?: {_ref?: string} | null
  } | null
}

export type CbLink = {
  _key?: string
  _type: 'cbLink'
  linkType?: 'external' | 'internal' | null
  internalTargetType?: 'page' | 'path' | null
  internalPage?: {_ref?: string} | null
  internalPageSlug?: string | null
  externalUrl?: string | null
  internalPath?: string | null
  openInNewTab?: boolean | null
}

export type CbHtml = {
  _key?: string
  _type: 'cbHtml'
  content?: string | null
}

export type CbImage = {
  _key?: string
  _type: 'cbImage'
  media?: CbMedia | null
  // Legacy fields
  url?: string | null
  alt?: string | null
}

export type CbListItem = {
  _key?: string
  _type: 'cbListItem'
  content?: string | null
}

export type CbList = {
  _key?: string
  _type: 'cbList'
  ordered?: boolean | null
  items?: CbListItem[] | null
}

export type CbNavigationLink = {
  _key?: string
  _type: 'cbNavigationLink'
  label?: string | null
  link?: CbLink | null
  // Legacy field
  url?: string | null
}

export type CbNavigation = {
  _key?: string
  _type: 'cbNavigation'
  links?: CbNavigationLink[] | null
}

export type LegacyCallToAction = {
  _key?: string
  _type: 'callToAction'
  eyebrow?: string
  heading?: string
  body?: unknown[]
  button?: {
    buttonText?: string
    link?: DereferencedLink | null
  } | null
  image?: {
    asset?: {_ref?: string}
    crop?: CropData
  } | null
  theme?: 'dark' | 'light' | null
  contentAlignment?: 'imageFirst' | 'textFirst' | null
}

export type LegacyInfoSection = {
  _key?: string
  _type: 'infoSection'
  heading?: string
  subheading?: string
  content?: unknown[] | null
}

export type HeroSection = {
  _key?: string
  _type: 'heroSection'
  backgroundMedia?: CbMedia | null
  content?: Array<CbHeading | CbParagraph> | null
  phrases?: HeroPhrase[] | null
  cta?: CbButton | null
}

export type AboutUsStat = {
  _key?: string
  _type: 'aboutUsStat'
  value?: string | null
  label?: string | null
  variant?: 'outline' | 'dark' | 'accent' | null
  animateValue?: boolean | null
}

export type ComposablePageBuilderBlock =
  | AboutUsStat
  | PageBuilderAtom
  | CbButton
  | SplitArrowButton
  | PageBuilderContainer

export type AboutUsContentRow = {
  _key?: string
  _type: 'aboutUsContentRow'
  layout?: 'intro' | 'stats' | null
  content?: ComposablePageBuilderBlock[] | null
}

export type AboutUsSection = {
  _key?: string
  _type: 'aboutUsSection'
  rows?: AboutUsContentRow[] | null
}

export type PageBuilderSection =
  | PageBuilderAtom
  | CbButton
  | SplitArrowButton
  | PageBuilderContainer
  | HeroSection
  | AboutUsSection
  | LegacyCallToAction
  | LegacyInfoSection

export type PageBuilderAtom = CbHeading | CbParagraph | CbWysiwyg | CbHtml | CbImage

export type PageBuilderContainer =
  | CbButtons
  | CbList
  | CbNavigation
  | CbGroup
  | CbColumn
  | CbColumns
  | CbCover

export type CbGroup = {
  _key?: string
  _type: 'cbGroup'
  children?: ComposablePageBuilderBlock[] | null
}

export type CbColumn = {
  _key?: string
  _type: 'cbColumn'
  children?: ComposablePageBuilderBlock[] | null
}

export type CbColumns = {
  _key?: string
  _type: 'cbColumns'
  columns?: CbColumn[] | null
}

export type CbCover = {
  _key?: string
  _type: 'cbCover'
  backgroundMedia?: CbMedia | null
  // Legacy field
  url?: string | null
  content?: ComposablePageBuilderBlock[] | null
}

export type ExtractPageBuilderType<T extends string> = Extract<PageBuilderSection, {_type: T}>

export type PageDocumentForBuilder = {
  _id: string
  _type: string
  name?: string | null
  slug?: {current?: string | null} | null
  headerVariant?: 'positive' | 'negative' | null
  footerVariant?: 'positive' | 'negative' | null
  pageBuilder?: PageBuilderSection[] | null
} | null

// Represents a Link after GROQ dereferencing (page references become slug strings)
export type DereferencedLink = {
  _type: 'link'
  linkType?: 'href' | 'page'
  href?: string
  page?: string | null
  openInNewTab?: boolean
}
