import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {IBM_Plex_Mono, Noto_Sans_Arabic, SUSE} from 'next/font/google'
import {draftMode} from 'next/headers'
import Script from 'next/script'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import LocaleDocumentController from '@/app/components/LocaleDocumentController'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import type {LayoutSettings} from '@/sanity/lib/settings-types'
import {normalizeInlineScript, resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from '@/app/client-utils'
import {buildLanguageAlternates, SUPPORTED_LANGUAGES} from '@/sanity/lib/i18n'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    alternates: metadataBase
      ? {
          canonical: metadataBase.toString().replace(/\/$/, ''),
          languages: {
            ...buildLanguageAlternates(metadataBase.toString(), '/', [...SUPPORTED_LANGUAGES]),
            'x-default': metadataBase.toString().replace(/\/$/, ''),
          },
        }
      : undefined,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      type: 'website',
      title,
      description: toPlainText(description),
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: toPlainText(description),
      images: ogImage ? [ogImage.url] : [],
    },
    icons: {
      icon: [{url: '/images/logo-black.svg', sizes: 'any'}],
    },
  }
}

const suse = SUSE({
  variable: '--font-suse',
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

const notoSansArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  display: 'swap',
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const [{isEnabled: isDraftMode}, {data: settings}] = await Promise.all([
    draftMode(),
    sanityFetch({
      query: settingsQuery,
    }),
  ])

  const layoutSettings = (settings as LayoutSettings | null) || null
  const lang = 'en-US'
  const gtmScript = normalizeInlineScript(layoutSettings?.gtmScript)
  const gaScript = normalizeInlineScript(layoutSettings?.gaScript)
  const cookiePolicyScript = normalizeInlineScript(layoutSettings?.cookiePolicyScript)

  return (
      <html
        lang={lang}
        dir="ltr"
        className={`${suse.variable} ${ibmPlexMono.variable} ${notoSansArabic.variable} bg-background text-foreground`}
      >
      <body className="bg-background text-foreground">
        <LocaleDocumentController />
        {gtmScript ? <Script id="settings-gtm-script" strategy="afterInteractive">{gtmScript}</Script> : null}
        {gaScript ? <Script id="settings-ga-script" strategy="afterInteractive">{gaScript}</Script> : null}
        {cookiePolicyScript ? (
          <Script id="settings-cookie-policy-script" strategy="afterInteractive">
            {cookiePolicyScript}
          </Script>
        ) : null}
        <section className="min-h-screen pt-24">
          {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
          <Toaster />
          {isDraftMode && (
            <>
              <DraftModeToast />
              {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
              <VisualEditing />
            </>
          )}
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
          <SanityLive onError={handleError} />
          <main>{children}</main>
        </section>
        <SpeedInsights />
      </body>
    </html>
  )
}
