import {dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {createDataAttribute, CreateDataAttributeProps} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {DereferencedLink} from '@/sanity/lib/types'

const builder = imageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

// Create an image URL builder using the client
// Export a function that can be used to get image URLs
function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

export function resolveOpenGraphImage(
  image?: SanityImageSource | null,
  width = 1200,
  height = 627,
) {
  if (!image) return
  const url = urlForImage(image)?.width(1200).height(627).fit('crop').url()
  if (!url) return
  return {url, alt: (image as {alt?: string})?.alt || '', width, height}
}

// Depending on the type of link, we need to fetch the corresponding page or URL. Otherwise return null.
type LinkValue = {
  linkType?: 'href' | 'page'
  href?: string
  page?: string | null
  openInNewTab?: boolean
}

export function linkResolver(link: LinkValue | DereferencedLink | undefined) {
  if (!link) return null

  // If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
  if (!link.linkType && link.href) {
    link.linkType = 'href'
  }

  switch (link.linkType) {
    case 'href':
      return link.href || null
    case 'page':
      if (link?.page && typeof link.page === 'string') {
        return `/${link.page}`
      }
    default:
      return null
  }
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, 'id' | 'type' | 'path'>>

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config)
}

type ContentLink = {
  linkType?: 'external' | 'internal' | null
  internalTargetType?: 'page' | 'path' | null
  internalPageSlug?: string | null
  externalUrl?: string | null
  internalPath?: string | null
  openInNewTab?: boolean | null
} | null

export function resolveContentLinkHref(link?: ContentLink): string | null {
  if (!link) {
    return null
  }

  if (
    link.linkType === 'internal' &&
    (link.internalTargetType === 'page' || link.internalTargetType == null) &&
    link.internalPageSlug
  ) {
    return `/${link.internalPageSlug}`
  }

  if (link.linkType === 'internal' && link.internalPath) {
    return link.internalPath.startsWith('/') ? link.internalPath : `/${link.internalPath}`
  }

  if (link.linkType === 'external' && link.externalUrl) {
    return link.externalUrl
  }

  return null
}

export function isExternalContentLink(link?: ContentLink): boolean {
  return link?.linkType === 'external'
}

export function normalizeInlineScript(script?: string | null): string {
  if (!script) {
    return ''
  }

  const trimmed = script.trim()
  return trimmed.replace(/<\/?script[^>]*>/gi, '').trim()
}

export function parseJsonObject(value?: string | null): Record<string, unknown> | null {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
  } catch {
    return null
  }
}

export function ensureAbsoluteUrl(value?: string | null, fallback = 'http://localhost:3000'): string {
  if (value) {
    try {
      return new URL(value).toString().replace(/\/$/, '')
    } catch {
      // Ignore invalid absolute URL and use fallback.
    }
  }

  return fallback
}
