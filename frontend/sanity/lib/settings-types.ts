import type {ContentLink} from '@/sanity/lib/content-link'

export type MenuLink = {
  _key?: string
  itemId?: string | null
  label?: string | null
  link?: ContentLink
  subLinks?: MenuLink[] | null
}

export type MenuGroup = {
  menuId?: string | null
  title?: string | null
  links?: MenuLink[] | null
}

export type LayoutSettings = {
  title?: string | null
  logo?: {
    asset?: {_ref?: string} | null
    alt?: string | null
  } | null
  header?: {
    primaryMenu?: MenuGroup | null
    secondaryMenu?: MenuGroup | null
    ctaLabel?: string | null
    ctaLink?: ContentLink
  } | null
  footer?: {
    heading?: string | null
    menu?: MenuGroup | null
    legalMenu?: MenuGroup | null
    showDefaultLegalLinks?: boolean | null
    copyrightText?: string | null
  } | null
  gtmScript?: string | null
  gaScript?: string | null
  cookiePolicyScript?: string | null
}
