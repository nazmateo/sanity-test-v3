import type {Metadata, ResolvingMetadata} from 'next'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import type {BuilderPageData} from '@/app/lib/page-types'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import {PageOnboarding} from '@/app/components/Onboarding'
import PageBuilderPage from '@/app/components/PageBuilder'
import {buildSeoMetadata} from '@/app/lib/seo-metadata'
import {sanityFetch} from '@/sanity/lib/live'
import {DEFAULT_LANGUAGE} from '@/sanity/lib/i18n'
import {headerQuery, homePageLanguagesQuery, homePageQuery, layoutQuery} from '@/sanity/lib/queries'
import type {HeaderSettings, LayoutData} from '@/sanity/lib/settings-types'
import {parseJsonObject, resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const [{data: page}, {data: languageRows}] = await Promise.all([
    sanityFetch({
      query: homePageQuery,
      params: {language: DEFAULT_LANGUAGE},
      stega: false,
    }),
    sanityFetch({
      query: homePageLanguagesQuery,
      stega: false,
    }),
  ])

  const pageWithSeo = page as BuilderPageData | null
  if (!pageWithSeo?._id) {
    return {}
  }

  const parentMetadata = await parent
  const metadataBase = parentMetadata.metadataBase?.toString().replace(/\/$/, '')
  const previousImages = parentMetadata.openGraph?.images
  const normalizedPreviousImages = previousImages
    ? Array.isArray(previousImages)
      ? previousImages
      : [previousImages]
    : []
  const ogImage = resolveOpenGraphImage((pageWithSeo?.seo?.ogImage as SanityImageSource | null) || undefined)
  const title = pageWithSeo?.seo?.metaTitle || pageWithSeo?.name
  const description = pageWithSeo?.seo?.metaDescription || pageWithSeo?.name
  const discoveredLanguages =
    ((languageRows as Array<{language?: string}> | null) || []).map((row) => row.language || DEFAULT_LANGUAGE)

  return buildSeoMetadata({
    title,
    description,
    seo: pageWithSeo.seo,
    previousImages: normalizedPreviousImages,
    newImage: ogImage,
    metadataBase,
    fallbackCanonical: metadataBase || undefined,
    alternatePath: '/',
    discoveredLanguages,
    xDefault: metadataBase,
    ogType: 'website',
  })
}

export default async function HomePage() {
  const [{data: page}, {data: header}, {data: layout}] = await Promise.all([
    sanityFetch({
      query: homePageQuery,
      params: {language: DEFAULT_LANGUAGE},
    }),
    sanityFetch({
      query: headerQuery,
    }),
    sanityFetch({
      query: layoutQuery,
    }),
  ])
  const pageWithSeo = page as BuilderPageData | null
  const headerData = header as HeaderSettings | null
  const layoutData = layout as LayoutData
  const customStructuredData = parseJsonObject(pageWithSeo?.structuredData)

  if (!pageWithSeo?._id) {
    return (
      <div className="py-40">
        <PageOnboarding />
      </div>
    )
  }

  return (
    <>
      {customStructuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(customStructuredData)}} />
      ) : null}
      <Header header={headerData} variant={pageWithSeo.headerVariant || 'negative'} />
      <PageBuilderPage page={page as BuilderPageData} />
      <Footer
        footer={layoutData?.footer || null}
        settings={layoutData?.settings || null}
        variant={pageWithSeo.footerVariant || 'negative'}
      />
    </>
  )
}
