import type {Metadata, ResolvingMetadata} from 'next'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import type {PortableTextBlock} from 'next-sanity'
import {notFound} from 'next/navigation'

import type {BuilderPageData, LegalPageData, RoutePageParams} from '@/app/lib/page-types'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import {PageOnboarding} from '@/app/components/Onboarding'
import PageBuilderPage from '@/app/components/PageBuilder'
import PortableText from '@/app/components/PortableText'
import {buildCatchAllStaticParams, resolveCatchAllRoute, routePath, type SitemapRow} from '@/app/lib/catch-all-route'
import {buildSeoMetadata} from '@/app/lib/seo-metadata'
import {sanityFetch} from '@/sanity/lib/live'
import {
  homePageLanguagesQuery,
  homePageQuery,
  headerQuery,
  getPageQuery,
  legalPageBySlugQuery,
  legalPageLanguagesBySlugQuery,
  layoutQuery,
  pageLanguagesBySlugQuery,
  sitemapData,
} from '@/sanity/lib/queries'
import {DEFAULT_LANGUAGE} from '@/sanity/lib/i18n'
import type {HeaderSettings, LayoutData} from '@/sanity/lib/settings-types'
import {parseJsonObject, resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateStaticParams(): Promise<Array<{segments?: string[]}>> {
  const {data} = await sanityFetch({
    query: sitemapData,
    perspective: 'published',
    stega: false,
  })

  return buildCatchAllStaticParams((data as SitemapRow[] | null) || [])
}

export async function generateMetadata(props: RoutePageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const match = resolveCatchAllRoute(params.segments)
  if (!match) {
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
  const fallbackCanonical = metadataBase ? `${metadataBase}${routePath(match)}` : undefined

  if (match.kind === 'home') {
    const [{data: page}, {data: languageRows}] = await Promise.all([
      sanityFetch({
        query: homePageQuery,
        params: {language: match.language},
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

    const discoveredLanguages =
      ((languageRows as Array<{language?: string}> | null) || []).map((row) => row.language || DEFAULT_LANGUAGE)
    const ogImage = resolveOpenGraphImage((pageWithSeo?.seo?.ogImage as SanityImageSource | null) || undefined)
    const title = pageWithSeo?.seo?.metaTitle || pageWithSeo?.name
    const description = pageWithSeo?.seo?.metaDescription || pageWithSeo?.name

    return buildSeoMetadata({
      title,
      description,
      seo: pageWithSeo.seo,
      previousImages: normalizedPreviousImages,
      newImage: ogImage,
      metadataBase,
      fallbackCanonical,
      alternatePath: '/',
      discoveredLanguages,
      xDefault: metadataBase,
      ogType: 'website',
    })
  }

  if (match.kind === 'legal') {
    const [{data: page}, {data: languageRows}] = await Promise.all([
      sanityFetch({
        query: legalPageBySlugQuery,
        params: {slug: match.slug, language: match.language},
        stega: false,
      }),
      sanityFetch({
        query: legalPageLanguagesBySlugQuery,
        params: {slug: match.slug},
        stega: false,
      }),
    ])

    const legalPage = page as LegalPageData | null
    if (!legalPage?._id) {
      return {}
    }

    const title = legalPage?.title || (match.slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms and Conditions')
    const description =
      legalPage?.seo?.metaDescription || (match.slug === 'privacy-policy' ? 'Privacy policy' : 'Terms and conditions')
    const discoveredLanguages =
      ((languageRows as Array<{language?: string}> | null) || []).map((row) => row.language || DEFAULT_LANGUAGE)
    const ogImage = resolveOpenGraphImage((legalPage?.seo?.ogImage as SanityImageSource | null) || undefined)

    return buildSeoMetadata({
      title,
      description,
      seo: legalPage.seo,
      previousImages: normalizedPreviousImages,
      newImage: ogImage,
      metadataBase,
      fallbackCanonical,
      alternatePath: `/${match.slug}`,
      discoveredLanguages,
      xDefault: metadataBase ? `${metadataBase}/${match.slug}` : undefined,
      ogType: 'article',
    })
  }

  const [{data: page}, {data: languageRows}] = await Promise.all([
    sanityFetch({
      query: getPageQuery,
      params: {slug: match.slug, language: match.language},
      stega: false,
    }),
    sanityFetch({
      query: pageLanguagesBySlugQuery,
      params: {slug: match.slug},
      stega: false,
    }),
  ])

  const pageWithSeo = page as BuilderPageData | null
  if (!pageWithSeo?._id) {
    return {}
  }

  const discoveredLanguages =
    ((languageRows as Array<{language?: string}> | null) || []).map((row) => row.language || DEFAULT_LANGUAGE)
  const ogImage = resolveOpenGraphImage((pageWithSeo?.seo?.ogImage as SanityImageSource | null) || undefined)
  const title = pageWithSeo?.seo?.metaTitle || pageWithSeo?.name
  const description = pageWithSeo?.seo?.metaDescription || pageWithSeo?.name

  return buildSeoMetadata({
    title,
    description,
    seo: pageWithSeo.seo,
    previousImages: normalizedPreviousImages,
    newImage: ogImage,
    metadataBase,
    fallbackCanonical,
    alternatePath: `/${match.slug}`,
    discoveredLanguages,
    xDefault: metadataBase ? `${metadataBase}/${match.slug}` : undefined,
    ogType: 'website',
  })
}

export default async function CatchAllPage(props: RoutePageParams) {
  const params = await props.params
  const match = resolveCatchAllRoute(params.segments)
  if (!match) {
    return notFound()
  }

  if (match.kind === 'home') {
    const [{data: page}, {data: header}, {data: layout}] = await Promise.all([
      sanityFetch({
        query: homePageQuery,
        params: {language: match.language},
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
        <div className="my-12 lg:my-24">
          <div className="container">
            <div className="border-b border-border pb-6">
              <div className="max-w-3xl">
                <h1 className="text-4xl text-foreground sm:text-5xl lg:text-7xl">{pageWithSeo.name}</h1>
              </div>
            </div>
        </div>
        <PageBuilderPage page={page as BuilderPageData} />
      </div>
      <Footer
        footer={layoutData?.footer || null}
        settings={layoutData?.settings || null}
        variant={pageWithSeo.footerVariant || 'negative'}
      />
    </>
  )
}

  if (match.kind === 'legal') {
    const [{data}, {data: header}, {data: layout}] = await Promise.all([
      sanityFetch({
        query: legalPageBySlugQuery,
        params: {slug: match.slug, language: match.language},
      }),
      sanityFetch({
        query: headerQuery,
      }),
      sanityFetch({
        query: layoutQuery,
      }),
    ])
    const page = data as LegalPageData | null
    const headerData = header as HeaderSettings | null
    const layoutData = layout as LayoutData
    if (!page?._id) {
      return notFound()
    }

    return (
      <>
        <Header header={headerData} variant={page.headerVariant || 'positive'} />
        <div className="container py-16 lg:py-24">
          <article className="prose prose-gray max-w-3xl">
            <h1>{page.title || (match.slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms and Conditions')}</h1>
            {page.content?.length ? <PortableText value={page.content as PortableTextBlock[]} /> : null}
          </article>
        </div>
        <Footer
          footer={layoutData?.footer || null}
          settings={layoutData?.settings || null}
          variant={page.footerVariant || 'positive'}
        />
      </>
    )
  }

  const [{data: page}, {data: header}, {data: layout}] = await Promise.all([
    sanityFetch({
      query: getPageQuery,
      params: {slug: match.slug, language: match.language},
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
    if (match.kind === 'page' && match.language === DEFAULT_LANGUAGE) {
      return (
        <div className="py-40">
          <PageOnboarding />
        </div>
      )
    }
    return notFound()
  }

  return (
    <>
      {customStructuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(customStructuredData)}} />
      ) : null}
      <Header header={headerData} variant={pageWithSeo.headerVariant || 'positive'} />
      <div className="my-12 lg:my-24">
        <div className="container">
          <div className="border-b border-border pb-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl text-foreground sm:text-5xl lg:text-7xl">{pageWithSeo.name}</h1>
            </div>
          </div>
        </div>
        <PageBuilderPage page={page as BuilderPageData} />
      </div>
      <Footer
        footer={layoutData?.footer || null}
        settings={layoutData?.settings || null}
        variant={pageWithSeo.footerVariant || 'positive'}
      />
    </>
  )
}
