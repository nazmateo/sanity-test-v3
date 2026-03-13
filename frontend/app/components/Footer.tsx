import Link from 'next/link'

import type {LayoutSettings} from '@/sanity/lib/settings-types'
import {isExternalContentLink, resolveContentLinkHref} from '@/sanity/lib/utils'

export default function Footer({settings}: {settings?: LayoutSettings | null}) {
  const footerConfig = settings?.footer
  const footerLinks = footerConfig?.menu?.links
  const legalLinks = footerConfig?.legalMenu?.links || []
  const showDefaultLegalLinks = footerConfig?.showDefaultLegalLinks ?? true

  return (
    <footer
      className="relative bg-surface"
      data-menu-group-id={footerConfig?.menu?.menuId || undefined}
    >
      <div className="absolute inset-0 bg-[url(/images/tile-grid-black.png)] bg-size-[17px] opacity-20 bg-position-[0_1]" />
      <div className="container relative">
        <div className="flex flex-col items-center py-28 lg:flex-row">
          <h3 className="mb-10 text-center text-4xl font-mono leading-tight tracking-tighter lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-2xl">
            {footerConfig?.heading || 'Brand Logo'}
          </h3>
          <div className="flex flex-col items-center justify-center gap-3 lg:w-1/2 lg:flex-row lg:pl-4">
            {footerLinks?.map((item) => {
              const href = resolveContentLinkHref(item.link)
              if (!href) {
                return null
              }
              const isExternal = isExternalContentLink(item.link) && item.link?.openInNewTab
              return (
                <Link
                  key={item.itemId || item._key || item.label || href}
                  href={href}
                  className="mx-3 hover:underline font-mono"
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  data-menu-item-id={item.itemId || undefined}
                >
                  {item.label || 'Link'}
                </Link>
              )
            })}
            {legalLinks.length > 0
              ? legalLinks.map((item) => {
                  const href = resolveContentLinkHref(item.link)
                  if (!href) {
                    return null
                  }
                  const isExternal = isExternalContentLink(item.link) && item.link?.openInNewTab
                  return (
                    <Link
                      key={item.itemId || item._key || item.label || href}
                      href={href}
                      className="mx-3 hover:underline font-mono"
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      data-menu-item-id={item.itemId || undefined}
                    >
                      {item.label || 'Link'}
                    </Link>
                  )
                })
              : null}
            {showDefaultLegalLinks && legalLinks.length === 0 ? (
              <>
                <Link href="/privacy-policy" className="mx-3 hover:underline font-mono">
                  Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className="mx-3 hover:underline font-mono">
                  Terms & Conditions
                </Link>
              </>
            ) : null}
          </div>
        </div>
        {footerConfig?.copyrightText ? (
          <div className="pb-8 text-center font-mono text-xs text-muted-foreground">
            {footerConfig.copyrightText}
          </div>
        ) : null}
      </div>
    </footer>
  )
}
