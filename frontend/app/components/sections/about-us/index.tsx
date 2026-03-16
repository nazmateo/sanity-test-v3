'use client'

import {useEffect, useRef, useState} from 'react'
import {stegaClean} from '@sanity/client/stega'

import Image from '@/app/components/SanityImage'
import SplitArrowLink from '@/app/components/SplitArrowLink'
import {cn} from '@/app/lib/cn'
import type {AboutUsContent, AboutUsSection, AboutUsStat} from '@/sanity/lib/types'
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

const columnCardHeights = [
  ['lg:h-about-stat-short', 'lg:h-about-stat-short'],
  ['lg:h-about-stat-medium', 'lg:h-about-stat-medium'],
  ['lg:h-about-stat-short', 'lg:h-about-stat-tall'],
] as const

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

function AnimatedStatValue({value}: {value: string}) {
  const ref = useRef<HTMLParagraphElement | null>(null)
  const [displayValue, setDisplayValue] = useState(() => getInitialStatValue(value))

  useEffect(() => {
    const node = ref.current
    const parsed = parseStatValue(value)

    if (!node || !parsed) {
      return
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

        const animate = (currentTime: number) => {
          const progress = Math.min((currentTime - startTime) / duration, 1)
          const easedProgress = 1 - Math.pow(1 - progress, 3)
          const nextValue = parsed.numericValue * easedProgress

          setDisplayValue(formatStatValue(value, progress >= 1 ? parsed.numericValue : nextValue))

          if (progress < 1) {
            rafId = window.requestAnimationFrame(animate)
          }
        }

        rafId = window.requestAnimationFrame(animate)
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
  }, [value])

  return <p ref={ref}>{displayValue}</p>
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
            card: 'bg-accent text-primary',
            label: 'text-primary',
          }
        : {
            card: 'border border-primary/25 bg-surface text-primary',
            label: 'text-accent',
          }

  return (
    <article
      className={cn(
        'flex min-h-56 flex-col items-center justify-center rounded-card px-6 py-8 text-center sm:px-8 lg:min-h-0',
        tones.card,
        className,
      )}
      data-sanity={dataSanity}
    >
      <div className="space-y-3">
        <div className="text-stat-display leading-none font-normal tracking-tight">
          <AnimatedStatValue key={value} value={value} />
        </div>
        <p className={cn('mx-auto max-w-48 text-lg leading-tight font-normal sm:text-xl lg:text-body-lg', tones.label)}>
          {label}
        </p>
      </div>
    </article>
  )
}

function renderStatColumns(stats: AboutUsStat[]) {
  return [stats.slice(0, 2), stats.slice(2, 4), stats.slice(4, 6)]
}

function renderContentItem(item: AboutUsContent) {
  if (item._type === 'cbHeading') {
    return (
      <h2 className="text-balance text-3xl leading-tight font-normal text-foreground sm:text-4xl lg:text-heading-display">
        {stegaClean(item.content || '')}
      </h2>
    )
  }

  if (item._type === 'cbParagraph') {
    return (
      <p className="text-pretty text-lg leading-relaxed font-normal text-foreground/90 sm:text-xl lg:text-body-lg">
        {stegaClean(item.content || '')}
      </p>
    )
  }

  return <SplitArrowLink label={item.label} link={item.link} />
}

export default function AboutUsSectionBlock({
  block,
  blockPath,
  pageId,
  pageType,
  isDraftMode,
}: AboutUsSectionProps) {
  const imageRef = block.image?.media?.image?.asset?._ref
  const imageAlt = block.image?.media?.image?.alt || ''
  const imageHotspot = block.image?.media?.image?.hotspot
  const imageCrop = block.image?.media?.image?.crop
  const content = block.content || []
  const statColumns = renderStatColumns(block.stats || [])

  return (
    <section
      className="bg-surface py-10 sm:py-14 lg:py-24"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <div className="container flex flex-col gap-12 lg:gap-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div
            className="lg:col-span-5 lg:-ml-32 xl:-ml-40"
            data-sanity={getSanityDataAttribute(
              isDraftMode,
              {id: pageId, type: pageType},
              `${blockPath}.image`,
            )}
          >
            {imageRef ? (
              <div className="h-80 overflow-hidden rounded-panel sm:h-96 lg:h-about-media">
                <Image
                  id={imageRef}
                  alt={imageAlt}
                  className="h-full w-full"
                  crop={imageCrop}
                  height={1024}
                  hotspot={imageHotspot}
                  mode="cover"
                  width={1212}
                />
              </div>
            ) : null}
          </div>

          <div
            className="space-y-8 lg:col-span-6 lg:col-start-7"
            data-sanity={getSanityDataAttribute(
              isDraftMode,
              {id: pageId, type: pageType},
              `${blockPath}.content`,
            )}
          >
            {content.map((item, index) => (
              <div
                key={item._key || `about-us-content-${index}`}
                className={item._type === 'cbButton' ? 'pt-2' : item._type === 'cbParagraph' ? 'max-w-xl' : 'max-w-2xl'}
                data-sanity={getSanityDataAttribute(
                  isDraftMode,
                  {id: pageId, type: pageType},
                  toArrayItemPath(`${blockPath}.content`, item._key, index),
                )}
              >
                {renderContentItem(item)}
              </div>
            ))}
          </div>
        </div>

        <div
          className="grid gap-5 lg:grid-cols-3"
          data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, `${blockPath}.stats`)}
        >
          {statColumns.map((columnStats, columnIndex) => (
            <div
              key={`about-us-stat-column-${columnIndex}`}
              className={cn('flex flex-col gap-5', columnIndex === 0 ? 'lg:pt-20' : undefined)}
            >
              {columnStats.map((stat, statIndex) => {
                const absoluteIndex = columnIndex * 2 + statIndex

                return (
                  <AboutUsStatCard
                    key={stat._key || `about-us-stat-${absoluteIndex}`}
                    className={columnCardHeights[columnIndex]?.[statIndex]}
                    dataSanity={getSanityDataAttribute(
                      isDraftMode,
                      {id: pageId, type: pageType},
                      toArrayItemPath(`${blockPath}.stats`, stat._key, absoluteIndex),
                    )}
                    stat={stat}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
