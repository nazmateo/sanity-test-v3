import type {PageBuilderSection, PageDocumentForBuilder} from '@/sanity/lib/types'

export type RoutePageParams = {
  params: Promise<{segments?: string[]}>
}

export type SeoFields = {
  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
  noIndex?: boolean | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: unknown
} | null

export type BuilderPageData = NonNullable<PageDocumentForBuilder> & {
  name?: string
  pageBuilder?: PageBuilderSection[] | null
  structuredData?: string | null
  seo?: SeoFields
}

export type LegalPageData = {
  _id?: string
  title?: string
  headerVariant?: 'positive' | 'negative' | null
  footerVariant?: 'positive' | 'negative' | null
  content?: unknown[]
  seo?: SeoFields
}

export type OptimisticPageDocument = {
  _id: string
  _type: string
  pageBuilder?: PageBuilderSection[] | null
}
