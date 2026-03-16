import Link from 'next/link'
import {stegaClean} from '@sanity/client/stega'

import {cn} from '@/app/lib/cn'
import type {ContentLink} from '@/sanity/lib/content-link'
import {isExternalContentLink, resolveContentLinkHref} from '@/sanity/lib/utils'

type SplitArrowLinkProps = {
  label?: string | null
  link?: ContentLink
  className?: string
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" className="size-5 sm:size-6 lg:size-7" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="m13 5 7 7-7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

export default function SplitArrowLink({label, link, className}: SplitArrowLinkProps) {
  const cleanedLabel = stegaClean(label || '')
  const href = resolveContentLinkHref(link)

  if (!cleanedLabel || !href) {
    return null
  }

  const isExternal = isExternalContentLink(link) && link?.openInNewTab

  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex w-full max-w-full items-stretch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-fit',
        className,
      )}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      <span className="inline-flex h-16 min-w-0 flex-1 items-center justify-center rounded-l-[var(--radius-split-button)] bg-primary px-5 text-center text-sm leading-none font-medium uppercase tracking-normal text-primary-foreground transition-colors duration-200 group-hover:bg-primary/92 group-focus-visible:bg-primary/92 sm:h-split-button-height sm:w-split-button-label sm:flex-none sm:px-6 sm:text-base lg:text-action-lg">
        {cleanedLabel}
      </span>
      <span className="inline-flex h-16 w-14 items-center justify-center rounded-r-[var(--radius-split-button)] bg-cta text-cta-foreground transition-colors duration-200 group-hover:bg-cta/92 group-focus-visible:bg-cta/92 sm:h-split-button-height sm:w-split-button-arrow">
        <ArrowRightIcon />
      </span>
    </Link>
  )
}
