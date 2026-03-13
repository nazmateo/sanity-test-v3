'use client'

import Link from 'next/link'
import {stegaClean} from '@sanity/client/stega'

import {Image} from '@/app/components/atoms/image'
import {cn} from '@/app/lib/cn'
import type {CbHeading, CbParagraph, HeroPhrase, HeroSection} from '@/sanity/lib/types'
import {getSanityDataAttribute, toArrayItemPath} from '@/sanity/lib/visual-editing'
import {isExternalContentLink, resolveContentLinkHref} from '@/sanity/lib/utils'

import styles from './HeroSection.module.css'

type HeroSectionProps = {
  block: HeroSection
  blockPath: string
  pageId: string
  pageType: string
  isDraftMode: boolean
}

function imageAssetRefToUrl(ref?: string | null): string | null {
  if (!ref) {
    return null
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  if (!projectId || !dataset) {
    return null
  }

  const match = ref.match(/^image-([^-]+-\d+x\d+)-([a-z0-9]+)$/i)
  if (!match) {
    return null
  }

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${match[1]}.${match[2]}`
}

function fileAssetRefToUrl(ref?: string | null): string | null {
  if (!ref) {
    return null
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  if (!projectId || !dataset) {
    return null
  }

  const match = ref.match(/^file-([^-]+)-([a-z0-9]+)$/i)
  if (!match) {
    return null
  }

  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${match[1]}.${match[2]}`
}

function resolvePhrasePosition(placement?: HeroPhrase['placement']) {
  switch (stegaClean(placement)) {
    case 'middleRight':
      return styles.middleRight
    case 'bottomLeft':
      return styles.bottomLeft
    case 'topLeft':
    default:
      return styles.topLeft
  }
}

function resolvePhraseDelay(index: number) {
  switch (index) {
    case 1:
      return styles.delayTwo
    case 2:
      return styles.delayThree
    default:
      return styles.delayOne
  }
}

function ArrowDownIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 20 20" fill="none">
      <path d="M10 4v10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="m5.5 10.5 4.5 4.5 4.5-4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function renderContentItem(item: CbHeading | CbParagraph) {
  if (item._type === 'cbHeading') {
    return (
      <h1 className="max-w-4xl text-6xl leading-none text-white sm:text-7xl lg:text-hero-display">
        {stegaClean(item.content) || ''}
      </h1>
    )
  }

  return (
    <p className="max-w-md text-xl leading-tight text-white/92 sm:text-2xl lg:text-body-lg">
      {stegaClean(item.content) || ''}
    </p>
  )
}

export default function HeroSectionBlock({
  block,
  blockPath,
  pageId,
  pageType,
  isDraftMode,
}: HeroSectionProps) {
  const imageUrl = imageAssetRefToUrl(block.backgroundMedia?.image?.asset?._ref)
  const videoUrl = fileAssetRefToUrl(block.backgroundMedia?.videoFile?.asset?._ref)
  const backgroundAlt = block.backgroundMedia?.image?.alt || ''
  const ctaHref = resolveContentLinkHref(block.cta?.link)
  const ctaIsExternal = isExternalContentLink(block.cta?.link) && block.cta?.link?.openInNewTab
  const phrases = block.phrases || []
  const content = block.content || []

  return (
    <section
      className="-mt-24 relative isolate min-h-screen overflow-hidden bg-primary pt-24 text-white"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <div className="absolute inset-0">
        {videoUrl ? (
          <video
            aria-hidden="true"
            autoPlay
            className="size-full object-cover"
            loop
            muted
            playsInline
          >
            <source src={videoUrl} />
          </video>
        ) : imageUrl ? (
          <Image
            alt={backgroundAlt}
            aria-hidden={backgroundAlt ? undefined : true}
            className="size-full object-cover"
            src={imageUrl}
            unstyled
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/20 to-black/80" />
      </div>

      <div className="container relative z-10 flex min-h-screen flex-col justify-end pb-10 pt-16 sm:pb-14 lg:pb-20">
        <div className="flex flex-col gap-6 lg:hidden">
          {phrases.map((phrase, index) => (
            <div
              key={phrase._key || `${phrase.text || 'phrase'}-${index}`}
              className={cn(
                styles.phrase,
                resolvePhraseDelay(index),
                'inline-flex w-fit items-center rounded-full border border-white/60 bg-white/12 px-4 py-3 text-sm font-medium uppercase tracking-widest text-white backdrop-blur-sm',
              )}
              data-sanity={getSanityDataAttribute(
                isDraftMode,
                {id: pageId, type: pageType},
                toArrayItemPath(`${blockPath}.phrases`, phrase._key, index),
              )}
            >
              {stegaClean(phrase.text) || ''}
            </div>
          ))}
        </div>

        <div
          className="grid items-end gap-8 py-12 lg:grid-cols-12 lg:py-20"
          data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, `${blockPath}.content`)}
        >
          {content.map((item, index) => {
            const layoutClass =
              index === 0 ? 'lg:col-span-7' : index === 1 ? 'lg:col-span-4 lg:col-start-9' : 'lg:col-span-12'

            return (
              <div
                key={item._key || `${item._type}-${index}`}
                className={layoutClass}
                data-sanity={getSanityDataAttribute(
                  isDraftMode,
                  {id: pageId, type: pageType},
                  toArrayItemPath(`${blockPath}.content`, item._key, index),
                )}
              >
                {renderContentItem(item)}
              </div>
            )
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 inset-y-0 hidden lg:block">
          {phrases.map((phrase, index) => (
            <div
              key={phrase._key || `${phrase.text || 'phrase'}-${index}`}
              className={cn(
                styles.phrase,
                resolvePhraseDelay(index),
                resolvePhrasePosition(phrase.placement),
                'pointer-events-auto absolute inline-flex items-center rounded-full border border-white/60 bg-white/12 px-5 py-4 text-label-caps uppercase text-white backdrop-blur-sm',
              )}
              data-sanity={getSanityDataAttribute(
                isDraftMode,
                {id: pageId, type: pageType},
                toArrayItemPath(`${blockPath}.phrases`, phrase._key, index),
              )}
            >
              {stegaClean(phrase.text) || ''}
            </div>
          ))}
        </div>

        {block.cta?.label && ctaHref ? (
          <div
            className="absolute bottom-6 right-6 z-20 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10"
            data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, `${blockPath}.cta`)}
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:bg-white/25"
              rel={ctaIsExternal ? 'noopener noreferrer' : undefined}
              target={ctaIsExternal ? '_blank' : undefined}
            >
              <span>{stegaClean(block.cta.label) || ''}</span>
              <ArrowDownIcon />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
