import Link from 'next/link'

import Image from '@/app/components/SanityImage'
import type {LayoutSettings, MenuLink} from '@/sanity/lib/settings-types'
import {isExternalContentLink, resolveContentLinkHref} from '@/sanity/lib/utils'

function MenuLinks({items}: {items?: MenuLink[] | null}) {
  if (!items?.length) {
    return null
  }

  return items.map((item, index) => {
    const href = resolveContentLinkHref(item.link)
    if (!href) {
      return null
    }

    const hasSubLinks = Boolean(item.subLinks?.length)
    const key = item.itemId || item._key || `${item.label || 'nav-item'}-${index}`
    const isExternal = isExternalContentLink(item.link) && item.link?.openInNewTab

    return (
      <li
        key={key}
        data-menu-item-id={item.itemId || undefined}
        className={hasSubLinks ? 'relative group' : undefined}
      >
        <Link
          href={href}
          className="hover:underline"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {item.label || 'Link'}
        </Link>
        {hasSubLinks ? (
          <ul className="absolute left-0 mt-2 hidden min-w-48 rounded-md border border-border bg-surface-strong p-2 shadow-md group-hover:block">
            {item.subLinks?.map((subLink, subIndex) => {
              const subHref = resolveContentLinkHref(subLink.link)
              if (!subHref) {
                return null
              }
              const subIsExternal =
                isExternalContentLink(subLink.link) && subLink.link?.openInNewTab
              return (
                <li
                  key={subLink.itemId || subLink._key || `${key}-sub-${subIndex}`}
                  data-menu-item-id={subLink.itemId || undefined}
                >
                  <Link
                    href={subHref}
                    className="block rounded px-2 py-1 text-sm hover:bg-surface"
                    target={subIsExternal ? '_blank' : undefined}
                    rel={subIsExternal ? 'noopener noreferrer' : undefined}
                  >
                    {subLink.label || 'Sub link'}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : null}
      </li>
    )
  })
}

export default function Header({settings}: {settings?: LayoutSettings | null}) {
  const logoAssetRef = settings?.logo?.asset?._ref
  const headerConfig = settings?.header
  const secondaryMenu = headerConfig?.secondaryMenu
  const primaryMenu = headerConfig?.primaryMenu
  const secondaryLinks = secondaryMenu?.links || []
  const primaryLinks = primaryMenu?.links || []
  const ctaHref =
    resolveContentLinkHref(headerConfig?.ctaLink || null) ||
    'https://github.com/sanity-io/sanity-template-nextjs-clean'
  const ctaLabel = headerConfig?.ctaLabel || 'CreatedbyBlack'
  const isCtaExternal =
    isExternalContentLink(headerConfig?.ctaLink || null) && headerConfig?.ctaLink?.openInNewTab

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="container px-2 sm:px-6">
        <div className="flex items-center justify-end gap-5 border-b border-border py-2 font-mono text-xs text-muted-foreground">
          <nav
            aria-label="Secondary navigation"
            data-menu-group-id={secondaryMenu?.menuId || 'secondary'}
          >
            <ul role="list" className="flex items-center gap-4 md:gap-6 leading-5 tracking-tight">
              <MenuLinks items={secondaryLinks} />
            </ul>
          </nav>
        </div>
        <div className="flex items-center justify-between gap-5 py-4">
          <Link className="flex items-center gap-2" href="/">
            {logoAssetRef ? (
              <Image
                id={logoAssetRef}
                alt={settings?.logo?.alt || settings?.title || 'Site logo'}
                width={160}
                height={48}
                className="h-10 w-auto"
                mode="contain"
              />
            ) : (
              <span className="text-lg sm:text-2xl pl-2 font-semibold">
                {settings?.title || 'Brand Logo'}
              </span>
            )}
          </Link>

          <nav aria-label="Primary navigation" data-menu-group-id={primaryMenu?.menuId || 'primary'}>
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono"
            >
              <MenuLinks items={primaryLinks} />

              <li className="flex sm:gap-4 md:gap-6 sm:before:block sm:before:w-px sm:before:bg-border">
                <Link
                  className="flex items-center justify-center gap-4 rounded-full bg-foreground px-4 py-2 text-primary-foreground transition-colors duration-200 hover:bg-accent focus:bg-accent sm:px-6 sm:py-3"
                  href={ctaHref}
                  target={isCtaExternal ? '_blank' : undefined}
                  rel={isCtaExternal ? 'noopener noreferrer' : undefined}
                >
                  <span className="whitespace-nowrap">{ctaLabel}</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
