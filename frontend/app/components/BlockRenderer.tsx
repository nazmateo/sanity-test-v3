import CTA from '@/app/components/Cta'
import InfoSection from '@/app/components/InfoSection'
import CustomPortableText from '@/app/components/PortableText'
import type {PortableTextBlock} from 'next-sanity'
import {Button} from '@/app/components/atoms/button'
import {Heading} from '@/app/components/atoms/heading'
import {Html} from '@/app/components/atoms/html'
import {Image} from '@/app/components/atoms/image'
import {ListItem} from '@/app/components/atoms/list-item'
import {NavigationLink} from '@/app/components/atoms/navigation-link'
import {Paragraph} from '@/app/components/atoms/paragraph'
import {Buttons} from '@/app/components/molecules/buttons'
import {Column} from '@/app/components/molecules/column'
import {Group} from '@/app/components/molecules/group'
import {List} from '@/app/components/molecules/list'
import {Navigation} from '@/app/components/molecules/navigation'
import {BlockSlot} from '@/app/components/organisms/block-slot'
import {Columns} from '@/app/components/organisms/columns'
import {Cover} from '@/app/components/organisms/cover'
import HeroSectionBlock from '@/app/components/sections/hero'
import {
  type CbButton,
  type CbColumn,
  type CbCover,
  type CbGroup,
  type HeroSection,
  type CbLink,
  type CbMedia,
  type PageBuilderSection,
} from '@/sanity/lib/types'
import {getSanityDataAttribute, toArrayItemPath} from '@/sanity/lib/visual-editing'

type BlockRendererProps = {
  block: PageBuilderSection
  index: number
  pageType: string
  pageId: string
  blockPath: string
  isDraftMode: boolean
}

function resolveLinkHref(link?: CbLink | null, fallbackUrl?: string | null): string | null {
  if (
    link?.linkType === 'internal' &&
    (link.internalTargetType === 'page' || link.internalTargetType == null) &&
    link.internalPageSlug
  ) {
    return `/${link.internalPageSlug}`
  }

  if (link?.linkType === 'internal' && link.internalPath) {
    return link.internalPath.startsWith('/') ? link.internalPath : `/${link.internalPath}`
  }

  if (link?.linkType === 'external' && link.externalUrl) {
    return link.externalUrl
  }

  return fallbackUrl || null
}

function isExternalLink(link?: CbLink | null): boolean {
  return link?.linkType === 'external'
}

function normalizeHeadingLevel(
  level?: string | number | null,
): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  if (typeof level === 'string') {
    if (
      level === 'h1' ||
      level === 'h2' ||
      level === 'h3' ||
      level === 'h4' ||
      level === 'h5' ||
      level === 'h6'
    ) {
      return level
    }
    return 'h2'
  }

  if (typeof level === 'number' && level >= 1 && level <= 6) {
    return `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }

  return 'h2'
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

function resolveMediaUrls(media?: CbMedia | null) {
  const imageRef = media?.image?.asset?._ref
  const videoRef = media?.videoFile?.asset?._ref

  return {
    imageUrl: imageAssetRefToUrl(imageRef),
    videoUrl: fileAssetRefToUrl(videoRef),
    alt: media?.image?.alt || '',
    mediaType: media?.mediaType || 'image',
  }
}

function renderMedia(
  media?: CbMedia | null,
  fallbackUrl?: string | null,
  fallbackAlt?: string | null,
) {
  const resolved = resolveMediaUrls(media)
  const mediaType = resolved.mediaType
  const url = (mediaType === 'video' ? resolved.videoUrl : resolved.imageUrl) || fallbackUrl || ''
  const alt = resolved.alt || fallbackAlt || ''

  if (!url) {
    return null
  }

  if (mediaType === 'video') {
    return <video src={url} controls className="h-auto max-w-full rounded-md" />
  }

  return <Image src={url} alt={alt} className="h-auto max-w-full" />
}

function renderButton(button: CbButton, key?: string) {
  const text = button.label || button.text || 'Button'
  const href = resolveLinkHref(button.link, button.url)

  if (button.actionType === 'link' || href) {
    return (
      <NavigationLink
        key={key}
        href={href || '#'}
        className="inline-flex"
        target={isExternalLink(button.link) && button.link?.openInNewTab ? '_blank' : undefined}
        rel={
          isExternalLink(button.link) && button.link?.openInNewTab
            ? 'noopener noreferrer'
            : undefined
        }
      >
        <Button>{text}</Button>
      </NavigationLink>
    )
  }

  return <Button key={key}>{text}</Button>
}

function renderColumnContent(
  column: CbColumn,
  pageId: string,
  pageType: string,
  columnPath: string,
  isDraftMode: boolean,
) {
  return (
    <div
      data-sanity={
        getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, `${columnPath}.children`)
      }
    >
      {(column.children || []).map((child, childIndex) => (
        <BlockRenderer
          key={child._key || `${column._key || 'column'}-${childIndex}`}
          block={child}
          index={childIndex}
          pageId={pageId}
          pageType={pageType}
          blockPath={toArrayItemPath(`${columnPath}.children`, child._key, childIndex)}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>
  )
}

function renderGroupContent(
  group: CbGroup,
  pageId: string,
  pageType: string,
  groupPath: string,
  isDraftMode: boolean,
) {
  return (
    <div
      data-sanity={
        getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, `${groupPath}.children`)
      }
    >
      {(group.children || []).map((child, childIndex) => (
        <BlockRenderer
          key={child._key || `${group._key || 'group'}-${childIndex}`}
          block={child}
          index={childIndex}
          pageId={pageId}
          pageType={pageType}
          blockPath={toArrayItemPath(`${groupPath}.children`, child._key, childIndex)}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>
  )
}

function renderCoverContent(
  cover: CbCover,
  pageId: string,
  pageType: string,
  coverPath: string,
  isDraftMode: boolean,
) {
  return (
    <div
      data-sanity={
        getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, `${coverPath}.content`)
      }
    >
      {(cover.content || []).map((child, childIndex) => (
        <BlockRenderer
          key={child._key || `${cover._key || 'cover'}-${childIndex}`}
          block={child}
          index={childIndex}
          pageId={pageId}
          pageType={pageType}
          blockPath={toArrayItemPath(`${coverPath}.content`, child._key, childIndex)}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>
  )
}

export default function BlockRenderer({
  block,
  index,
  pageType,
  pageId,
  blockPath,
  isDraftMode,
}: BlockRendererProps) {
  const key = block._key || `${block._type}-${index}`
  const blockDataAttr = isDraftMode
    ? getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)
    : undefined

  switch (block._type) {
    case 'cbHeading': {
      const as = normalizeHeadingLevel(block.level)
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Heading as={as}>{block.content || ''}</Heading>
        </BlockSlot>
      )
    }
    case 'cbParagraph':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Paragraph>{block.content || ''}</Paragraph>
        </BlockSlot>
      )
    case 'cbWysiwyg':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <div className="prose">
            <CustomPortableText
              value={Array.isArray(block.content) ? (block.content as PortableTextBlock[]) : []}
            />
          </div>
        </BlockSlot>
      )
    case 'cbHtml':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Html html={block.content || ''} />
        </BlockSlot>
      )
    case 'cbImage':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          {renderMedia(block.media, block.url, block.alt)}
        </BlockSlot>
      )
    case 'cbButton':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          {renderButton(block)}
        </BlockSlot>
      )
    case 'cbButtons':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Buttons>
            {(block.items || []).map((item, i) => (
              <span
                key={item._key || `${key}-${i}`}
                data-sanity={
                  getSanityDataAttribute(
                    isDraftMode,
                    {id: pageId, type: pageType},
                    toArrayItemPath(`${blockPath}.items`, item._key, i),
                  )
                }
              >
                {renderButton(item, item._key || `${key}-${i}`)}
              </span>
            ))}
          </Buttons>
        </BlockSlot>
      )
    case 'cbList':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <List kind={block.ordered ? 'ordered' : 'unordered'}>
            {(block.items || []).map((item, i) => (
              <ListItem
                key={item._key || `${key}-${i}`}
                data-sanity={
                  getSanityDataAttribute(
                    isDraftMode,
                    {id: pageId, type: pageType},
                    toArrayItemPath(`${blockPath}.items`, item._key, i),
                  )
                }
              >
                {item.content || ''}
              </ListItem>
            ))}
          </List>
        </BlockSlot>
      )
    case 'cbNavigation':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Navigation>
            <div className="flex flex-wrap gap-3">
              {(block.links || []).map((link, i) => (
                <NavigationLink
                  key={link._key || `${key}-${i}`}
                  data-sanity={
                    getSanityDataAttribute(
                      isDraftMode,
                      {id: pageId, type: pageType},
                      toArrayItemPath(`${blockPath}.links`, link._key, i),
                    )
                  }
                  href={resolveLinkHref(link.link, link.url) || '#'}
                  target={
                    isExternalLink(link.link) && link.link?.openInNewTab ? '_blank' : undefined
                  }
                  rel={
                    isExternalLink(link.link) && link.link?.openInNewTab
                      ? 'noopener noreferrer'
                      : undefined
                  }
                >
                  {link.label || 'Link'}
                </NavigationLink>
              ))}
            </div>
          </Navigation>
        </BlockSlot>
      )
    case 'cbGroup':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Group className="flex flex-wrap items-start gap-4">
            {renderGroupContent(block, pageId, pageType, blockPath, isDraftMode)}
          </Group>
        </BlockSlot>
      )
    case 'cbColumn':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Column className="space-y-4">
            {renderColumnContent(block, pageId, pageType, blockPath, isDraftMode)}
          </Column>
        </BlockSlot>
      )
    case 'cbColumns':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Columns>
            {(block.columns || []).map((column, i) => (
              <Column
                key={column._key || `${key}-${i}`}
                className="col-span-12 md:col-span-6 space-y-4"
                data-sanity={
                  getSanityDataAttribute(
                    isDraftMode,
                    {id: pageId, type: pageType},
                    toArrayItemPath(`${blockPath}.columns`, column._key, i),
                  )
                }
              >
                {renderColumnContent(
                  column,
                  pageId,
                  pageType,
                  toArrayItemPath(`${blockPath}.columns`, column._key, i),
                  isDraftMode,
                )}
              </Column>
            ))}
          </Columns>
        </BlockSlot>
      )
    case 'cbCover': {
      const coverMedia = resolveMediaUrls(block.backgroundMedia)
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Cover
            backgroundMedia={
              coverMedia.videoUrl
                ? {mediaType: 'video', url: coverMedia.videoUrl}
                : coverMedia.imageUrl
                  ? {mediaType: 'image', url: coverMedia.imageUrl}
                  : undefined
            }
            imageUrl={block.url || undefined}
            contentClassName="space-y-4 text-white"
          >
            {renderCoverContent(block, pageId, pageType, blockPath, isDraftMode)}
          </Cover>
        </BlockSlot>
      )
    }
    case 'heroSection':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled
        >
          <HeroSectionBlock
            block={block as HeroSection}
            blockPath={blockPath}
            isDraftMode={isDraftMode}
            pageId={pageId}
            pageType={pageType}
          />
        </BlockSlot>
      )
    case 'callToAction':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <CTA block={block as never} index={index} pageId={pageId} pageType={pageType} />
        </BlockSlot>
      )
    case 'infoSection':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <InfoSection block={block as never} index={index} pageId={pageId} pageType={pageType} />
        </BlockSlot>
      )
    default:
      return null
  }
}
