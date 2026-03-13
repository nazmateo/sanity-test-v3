import type {ContentLink} from '@/sanity/lib/content-link'

export type MenuLink = {
  _key?: string
  itemId?: string | null
  label?: string | null
  link?: ContentLink
  subLinks?: MenuLink[] | null
  dropdown?: MenuDropdown | null
}

export type MenuGroup = {
  _key?: string
  menuId?: string | null
  title?: string | null
  links?: MenuLink[] | null
}

export type MenuDropdownSection = {
  _key?: string
  title?: string | null
  links?: MenuLink[] | null
}

export type MenuDropdown = {
  _key?: string
  sections?: MenuDropdownSection[] | null
}

export type HeaderVariant = 'positive' | 'negative'
export type FooterVariant = 'positive' | 'negative'

export type HeaderSettings = {
  _id?: string | null
  _type?: 'header' | string | null
  positiveLogo?: {
    asset?: {_ref?: string} | null
    alt?: string | null
  } | null
  negativeLogo?: {
    asset?: {_ref?: string} | null
    alt?: string | null
  } | null
  primaryMenu?: MenuGroup | null
  secondaryMenu?: MenuGroup | null
  languageToggleLabelEn?: string | null
  languageToggleLabelAe?: string | null
}

export type FooterSettings = {
  _id?: string | null
  _type?: 'footer' | string | null
  positiveLogo?: {
    asset?: {_ref?: string} | null
    alt?: string | null
  } | null
  negativeLogo?: {
    asset?: {_ref?: string} | null
    alt?: string | null
  } | null
  navigationGroups?: MenuGroup[] | null
  legalMenu?: MenuGroup | null
  showDefaultLegalLinks?: boolean | null
  copyrightText?: string | null
}

export type LayoutSettings = {
  _id?: string | null
  _type?: 'settings' | string | null
  title?: string | null
  description?: unknown[] | null
  logo?: {
    asset?: {_ref?: string} | null
    alt?: string | null
  } | null
  officeHeading?: string | null
  officeAddresses?:
    | Array<{
        _key?: string
        address?: string | null
      }>
    | null
  contactPhone?: string | null
  contactEmail?: string | null
  gtmScript?: string | null
  gaScript?: string | null
  cookiePolicyScript?: string | null
}

export type LayoutData = {
  settings?: LayoutSettings | null
  footer?: FooterSettings | null
} | null
