'use client'

import {useEffect, useRef, useState} from 'react'
import {stegaClean} from '@sanity/client/stega'

import BlockRenderer from '@/app/components/BlockRenderer'
import Image from '@/app/components/SanityImage'
import SplitArrowLink from '@/app/components/SplitArrowLink'
import {Heading} from '@/app/components/atoms/heading'
import {Paragraph} from '@/app/components/atoms/paragraph'
import {cn} from '@/app/lib/cn'
import type {
  AboutUsContentRow,
  AboutUsSection,
  AboutUsStat,
  CbHeading,
  CbImage,
  CbParagraph,
  ComposablePageBuilderBlock,
  PageBuilderSection,
  SplitArrowButton,
} from '@/sanity/lib/types'
import {getSanityDataAttribute, toArrayItemPath} from '@/sanity/lib/visual-editing'

type AboutUsSectionProps = {
  block: AboutUsSection
  blockPath: string
  pageId: string
  pageType: string
  isDraftMode: boolean
}

type ParsedStatValue = {
  prefix: string
  numericValue: number
  suffix: string
  maximumFractionDigits: number
}

const statColumnLayouts = [
  {
    containerClassName: 'lg:justify-center',
    cardHeights: ['lg:h-about-stat-short', 'lg:h-about-stat-short'],
  },
  {
    containerClassName: 'lg:justify-end',
    cardHeights: ['lg:h-about-stat-medium', 'lg:h-about-stat-medium'],
  },
  {
    containerClassName: '',
    cardHeights: ['lg:h-about-stat-short', 'lg:h-about-stat-tall'],
  },
] as const

function normalizeHeadingLevel(level?: string | number | null): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  if (typeof level === 'string') {
    if (level === 'h1' || level === 'h2' || level === 'h3' || level === 'h4' || level === 'h5' || level === 'h6') {
      return level
    }

    return 'h2'
  }

  if (typeof level === 'number' && level >= 1 && level <= 6) {
    return `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }

  return 'h2'
}

function parseStatValue(value: string): ParsedStatValue | null {
  const match = value.match(/-?\d[\d,]*(?:\.\d+)?/)

  if (!match || typeof match.index !== 'number') {
    return null
  }

  const numericValue = Number(match[0].replace(/,/g, ''))

  if (!Number.isFinite(numericValue)) {
    return null
  }

  return {
    prefix: value.slice(0, match.index),
    numericValue,
    suffix: value.slice(match.index + match[0].length),
    maximumFractionDigits: match[0].includes('.') ? match[0].split('.')[1].length : 0,
  }
}

function formatStatValue(value: string, progressValue: number): string {
  const parsed = parseStatValue(value)

  if (!parsed) {
    return value
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: parsed.maximumFractionDigits,
    maximumFractionDigits: parsed.maximumFractionDigits,
  })

  return `${parsed.prefix}${formatter.format(progressValue)}${parsed.suffix}`
}

function getInitialStatValue(value: string): string {
  const parsed = parseStatValue(value)

  if (!parsed) {
    return value
  }

  return formatStatValue(value, 0)
}

function AnimatedStatValue({animate = true, value}: {animate?: boolean; value: string}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [displayValue, setDisplayValue] = useState(() => getInitialStatValue(value))

  useEffect(() => {
    const node = ref.current
    const parsed = parseStatValue(value)

    if (!node || !parsed || !animate) {
      const frameId = window.requestAnimationFrame(() => {
        setDisplayValue(value)
      })

      return () => {
        window.cancelAnimationFrame(frameId)
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frameId = window.requestAnimationFrame(() => {
        setDisplayValue(value)
      })

      return () => {
        window.cancelAnimationFrame(frameId)
      }
    }

    let rafId = 0

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return
        }

        observer.disconnect()

        const startTime = performance.now()
        const duration = 1400

        const animateValue = (currentTime: number) => {
          const progress = Math.min((currentTime - startTime) / duration, 1)
          const easedProgress = 1 - Math.pow(1 - progress, 3)
          const nextValue = parsed.numericValue * easedProgress

          setDisplayValue(formatStatValue(value, progress >= 1 ? parsed.numericValue : nextValue))

          if (progress < 1) {
            rafId = window.requestAnimationFrame(animateValue)
          }
        }

        rafId = window.requestAnimationFrame(animateValue)
      },
      {threshold: 0.35},
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [animate, value])

  return <span ref={ref}>{displayValue}</span>
}

function AboutUsStatCard({
  stat,
  className,
  dataSanity,
}: {
  stat: AboutUsStat
  className?: string
  dataSanity?: string
}) {
  const value = stegaClean(stat.value || '')
  const label = stegaClean(stat.label || '')
  const variant = stat.variant || 'outline'

  const tones =
    variant === 'dark'
      ? {
          card: 'bg-primary text-white',
          label: 'text-accent',
        }
      : variant === 'accent'
        ? {
            card: 'bg-accent text-white',
            label: 'text-primary',
          }
        : {
            card: 'border border-primary/25 bg-surface text-primary',
            label: 'text-accent',
          }

  return (
    <article
      className={cn(
        'flex min-h-48 flex-col items-center justify-center rounded-card px-6 py-8 text-center sm:px-10 sm:py-10 lg:min-h-0 lg:px-20 lg:py-[3.75rem]',
        tones.card,
        className,
      )}
      data-sanity={dataSanity}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="text-stat-display font-normal tracking-normal">
          <AnimatedStatValue animate={stat.animateValue !== false} key={value} value={value} />
        </div>
        <p className={cn('text-base leading-tight font-normal tracking-normal sm:text-xl lg:text-body-lg', tones.label)}>
          {label}
        </p>
      </div>
    </article>
  )
}

function renderStatColumns(stats: Array<{item: AboutUsStat; originalIndex: number}>) {
  return [stats.slice(0, 2), stats.slice(2, 4), stats.slice(4, 6)]
}

function renderIntroContentItem(
  child: Exclude<ComposablePageBuilderBlock, AboutUsStat>,
  childPath: string,
  index: number,
  pageId: string,
  pageType: string,
  isDraftMode: boolean,
) {
  const dataSanity = getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, childPath)

  if (child._type === 'cbHeading') {
    const heading = child as CbHeading

    return (
      <div key={child._key || `about-us-content-${index}`} data-sanity={dataSanity}>
        <Heading
          as={normalizeHeadingLevel(heading.level)}
          className="max-w-about-grid-width text-3xl leading-tight font-normal tracking-normal text-primary sm:text-[2rem] lg:text-heading-display"
          unstyled
        >
          {stegaClean(heading.content) || ''}
        </Heading>
      </div>
    )
  }

  if (child._type === 'cbParagraph') {
    const paragraph = child as CbParagraph

    return (
      <div key={child._key || `about-us-content-${index}`} data-sanity={dataSanity}>
        <Paragraph
          className="max-w-about-grid-width text-base leading-relaxed font-normal tracking-normal text-primary sm:text-xl lg:text-body-lg"
          unstyled
        >
          {stegaClean(paragraph.content) || ''}
        </Paragraph>
      </div>
    )
  }

  if (child._type === 'splitArrowButton') {
    const button = child as SplitArrowButton

    return (
      <div key={child._key || `about-us-content-${index}`} data-sanity={dataSanity}>
        <SplitArrowLink className="max-w-full" label={button.label} link={button.link} />
      </div>
    )
  }

  return (
    <BlockRenderer
      key={child._key || `about-us-content-${index}`}
      block={child as PageBuilderSection}
      blockPath={childPath}
      index={index}
      isDraftMode={isDraftMode}
      pageId={pageId}
      pageType={pageType}
    />
  )
}

function renderIntroRow({
  row,
  rowPath,
  pageId,
  pageType,
  isDraftMode,
}: {
  row: AboutUsContentRow
  rowPath: string
  pageId: string
  pageType: string
  isDraftMode: boolean
}) {
  const content = row.content || []
  const imageItem = content.find((item): item is CbImage => item._type === 'cbImage')
  const imageRef = imageItem?.media?.image?.asset?._ref
  const textContent = content
    .map((item, originalIndex) => ({item, originalIndex}))
    .filter(
      (entry): entry is {item: Exclude<ComposablePageBuilderBlock, AboutUsStat>; originalIndex: number} =>
        entry.item._type !== 'cbImage' && entry.item._type !== 'aboutUsStat',
    )
  const imageIndex = imageItem ? content.indexOf(imageItem) : -1
  const imagePath = imageItem ? toArrayItemPath(`${rowPath}.content`, imageItem._key, imageIndex) : ''

  return (
    <div
      className="grid gap-8 lg:grid-cols-[var(--spacing-about-media-width)_minmax(0,var(--spacing-about-grid-width))] lg:items-center lg:justify-end lg:gap-about-row-gap"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, `${rowPath}.content`)}
    >
      <div className="lg:-ml-about-media-offset lg:w-about-media-width">
        {imageItem && imageRef ? (
          <div
            className="h-80 overflow-hidden rounded-r-panel sm:h-[28rem] lg:h-about-media"
            data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, imagePath)}
          >
            <Image
              id={imageRef}
              alt={imageItem.media?.image?.alt || ''}
              className="h-full w-full object-cover"
              crop={imageItem.media?.image?.crop}
              height={1024}
              hotspot={imageItem.media?.image?.hotspot}
              mode="cover"
              width={1212}
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-about-content lg:w-about-grid-width">
        {textContent.map(({item: child, originalIndex}, index) => {
          return renderIntroContentItem(
            child,
            toArrayItemPath(`${rowPath}.content`, child._key, originalIndex),
            index,
            pageId,
            pageType,
            isDraftMode,
          )
        })}
      </div>
    </div>
  )
}

function renderStatsRow({
  row,
  rowPath,
  pageId,
  pageType,
  isDraftMode,
}: {
  row: AboutUsContentRow
  rowPath: string
  pageId: string
  pageType: string
  isDraftMode: boolean
}) {
  const content = row.content || []
  const stats = content
    .map((item, originalIndex) => ({item, originalIndex}))
    .filter((entry): entry is {item: AboutUsStat; originalIndex: number} => entry.item._type === 'aboutUsStat')
  const statColumns = renderStatColumns(stats)

  return (
    <div
      className="grid gap-5 lg:mx-auto lg:w-about-stat-grid lg:grid-cols-3 lg:gap-about-stat-gap"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, `${rowPath}.content`)}
    >
      {statColumns.map((columnStats, columnIndex) => (
        <div
          key={`about-us-stat-column-${columnIndex}`}
          className={cn('flex flex-col gap-5 lg:gap-about-stat-gap', statColumnLayouts[columnIndex]?.containerClassName)}
        >
          {columnStats.map(({item: stat, originalIndex}, statIndex) => {

            return (
              <AboutUsStatCard
                key={stat._key || `about-us-stat-${columnIndex}-${statIndex}`}
                className={statColumnLayouts[columnIndex]?.cardHeights[statIndex]}
                dataSanity={getSanityDataAttribute(
                  isDraftMode,
                  {id: pageId, type: pageType},
                  toArrayItemPath(`${rowPath}.content`, stat._key, originalIndex),
                )}
                stat={stat}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function AboutUsSectionBlock({
  block,
  blockPath,
  pageId,
  pageType,
  isDraftMode,
}: AboutUsSectionProps) {
  const rows = block.rows || []

  return (
    <section
      className="overflow-hidden bg-surface"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-12 px-5 py-10 sm:px-8 sm:py-14 lg:gap-about-section-gap lg:px-about-section-x lg:pt-about-section-top lg:pb-about-section-bottom">
        <div
          className="flex flex-col gap-12 lg:gap-about-section-gap"
          data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, `${blockPath}.rows`)}
        >
          {rows.map((row, index) => {
            const rowPath = toArrayItemPath(`${blockPath}.rows`, row._key, index)

            return (
              <div key={row._key || `about-us-row-${index}`} data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, rowPath)}>
                {row.layout === 'stats'
                  ? renderStatsRow({row, rowPath, pageId, pageType, isDraftMode})
                  : renderIntroRow({row, rowPath, pageId, pageType, isDraftMode})}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
