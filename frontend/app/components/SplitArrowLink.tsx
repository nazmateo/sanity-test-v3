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
    <svg aria-hidden="true" className="size-5 sm:size-6" viewBox="0 0 24 24" fill="none">
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
        'group inline-flex w-fit items-stretch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-4 focus-visible:ring-offset-surface',
        className,
      )}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      <span className="inline-flex min-w-48 items-center justify-center rounded-l-card bg-primary px-6 py-4 text-center text-action-lg font-medium uppercase tracking-wide text-primary-foreground transition-colors duration-200 group-hover:bg-primary/92 group-focus-visible:bg-primary/92 sm:min-w-56">
        {cleanedLabel}
      </span>
      <span className="inline-flex w-16 items-center justify-center rounded-r-card bg-cta text-cta-foreground transition-colors duration-200 group-hover:bg-cta/92 group-focus-visible:bg-cta/92 sm:w-20">
        <ArrowRightIcon />
      </span>
    </Link>
  )
}
