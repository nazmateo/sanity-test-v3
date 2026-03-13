'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useMemo, useState} from 'react'

import Image from '@/app/components/SanityImage'
import {cn} from '@/app/lib/cn'
import type {HeaderSettings, HeaderVariant, MenuDropdownSection, MenuLink} from '@/sanity/lib/settings-types'
import {resolveContentLinkHref, isExternalContentLink} from '@/sanity/lib/utils'
import {getSanityDataAttribute, toArrayItemPath} from '@/sanity/lib/visual-editing'

type HeaderClientProps = {
  header: HeaderSettings
  variant?: HeaderVariant | null
  isDraftMode: boolean
}

function ChevronIcon({open, className}: {open?: boolean; className?: string}) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-4 transition-transform', open && 'rotate-180', className)}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M5 7.5 10 12.5l5-5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function GlobeIcon({className}: {className?: string}) {
  return (
    <svg aria-hidden="true" className={cn('size-4', className)} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 10h13" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 3c1.9 2.1 2.9 4.4 2.9 7s-1 4.9-2.9 7c-1.9-2.1-2.9-4.4-2.9-7S8.1 5.1 10 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function MenuIcon({open}: {open?: boolean}) {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 20 20" fill="none">
      {open ? (
        <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      ) : (
        <>
          <path d="M3 5h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M3 10h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M3 15h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}

function resolveLocaleTogglePath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const isArabic = segments[0] === 'ae'

  if (isArabic) {
    const nextSegments = segments.slice(1)
    return nextSegments.length ? `/${nextSegments.join('/')}` : '/'
  }

  return pathname === '/' ? '/ae' : `/ae${pathname}`
}

function getDropdownSections(item: MenuLink): MenuDropdownSection[] {
  if (item.dropdown?.sections?.length) {
    return item.dropdown.sections
  }

  if (item.subLinks?.length) {
    return [{title: null, links: item.subLinks}]
  }

  return []
}

function MenuDropdownPanel({
  item,
  itemPath,
  header,
  isDraftMode,
  open,
}: {
  item: MenuLink
  itemPath: string
  header: HeaderSettings
  isDraftMode: boolean
  open: boolean
}) {
  const sections = getDropdownSections(item)

  if (!open || sections.length === 0) {
    return null
  }

  return (
    <div
      className="border-t border-white/20 bg-primary/95 text-white backdrop-blur"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, `${itemPath}.dropdown`)}
    >
      <div className="container grid gap-4 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {sections.map((section, sectionIndex) => {
          const sectionPath = toArrayItemPath(`${itemPath}.dropdown.sections`, section._key, sectionIndex)
          const hasTwoColumns = (section.links?.length || 0) > 4

          return (
            <section
              key={section._key || `${item.itemId || 'dropdown'}-${sectionIndex}`}
              className="rounded-3xl border border-white/30 bg-black/10 p-7"
              data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, sectionPath)}
            >
              {section.title ? <h3 className="text-xl text-accent">{section.title}</h3> : null}
              <ul
                role="list"
                className={cn('mt-6 grid gap-x-10 gap-y-6 text-lg', hasTwoColumns ? 'sm:grid-cols-2' : 'sm:grid-cols-1')}
              >
                {(section.links || []).map((link, linkIndex) => {
                  const href = resolveContentLinkHref(link.link)
                  if (!href) {
                    return null
                  }

                  const linkPath = toArrayItemPath(`${sectionPath}.links`, link._key, linkIndex)
                  const external = isExternalContentLink(link.link) && link.link?.openInNewTab

                  return (
                    <li
                      key={link.itemId || link._key || `${section.title || 'section'}-${linkIndex}`}
                      data-menu-item-id={link.itemId || undefined}
                      data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, linkPath)}
                    >
                      <Link
                        href={href}
                        className="transition-colors hover:text-accent focus-visible:text-accent"
                        rel={external ? 'noopener noreferrer' : undefined}
                        target={external ? '_blank' : undefined}
                      >
                        {link.label || 'Link'}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default function HeaderClient({header, variant = 'positive', isDraftMode}: HeaderClientProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openItemId, setOpenItemId] = useState<string | null>(null)

  useEffect(() => {
    setMobileOpen(false)
    setOpenItemId(null)
  }, [pathname])

  const languageLabel = pathname.startsWith('/ae')
    ? header.languageToggleLabelAe || 'EN'
    : header.languageToggleLabelEn || 'AR'
  const languageHref = resolveLocaleTogglePath(pathname)
  const primaryMenu = header.primaryMenu
  const secondaryMenu = header.secondaryMenu
  const logo = variant === 'negative' ? header.negativeLogo || header.positiveLogo : header.positiveLogo || header.negativeLogo
  const logoAssetRef = logo?.asset?._ref
  const toneClasses =
    variant === 'negative'
      ? 'border-white/30 bg-black/10 text-white'
      : 'border-border bg-background/95 text-foreground'
  const dividerClasses = variant === 'negative' ? 'border-white/20' : 'border-border'
  const itemToneClasses = variant === 'negative' ? 'text-white hover:text-white/80' : 'text-foreground hover:text-accent'
  const toggleToneClasses =
    variant === 'negative'
      ? 'border-white/50 text-white hover:bg-white/10'
      : 'border-border text-foreground hover:border-accent hover:text-accent'

  const dropdownItems = useMemo(
    () => (primaryMenu?.links || []).filter((item) => getDropdownSections(item).length > 0),
    [primaryMenu?.links],
  )

  return (
    <header
      className={cn('fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md', toneClasses)}
      data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, '')}
    >
      <div className={cn('container flex items-center justify-between gap-4 py-5', dividerClasses)}>
        <nav
          aria-label="Primary navigation"
          className="hidden lg:block"
          data-menu-group-id={primaryMenu?.menuId || 'primary'}
          data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, 'primaryMenu')}
        >
          <ul role="list" className="flex items-center gap-2 text-lg">
            {(primaryMenu?.links || []).map((item, index) => {
              const href = resolveContentLinkHref(item.link)
              const external = isExternalContentLink(item.link) && item.link?.openInNewTab
              const itemPath = toArrayItemPath('primaryMenu.links', item._key, index)
              const sections = getDropdownSections(item)
              const hasDropdown = sections.length > 0
              const isOpen = openItemId === (item.itemId || item._key || `${index}`)
              const itemKey = item.itemId || item._key || `primary-${index}`

              return (
                <li key={itemKey} className="relative" data-menu-item-id={item.itemId || undefined}>
                  {hasDropdown ? (
                    <button
                      type="button"
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors',
                        itemToneClasses,
                        isOpen && variant === 'negative' && 'bg-white/10',
                        isOpen && variant === 'positive' && 'bg-primary/5 text-accent',
                      )}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => setOpenItemId(isOpen ? null : itemKey)}
                      data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, itemPath)}
                    >
                      <span>{item.label || 'Link'}</span>
                      <ChevronIcon open={isOpen} />
                    </button>
                  ) : href ? (
                    <Link
                      href={href}
                      className={cn('flex items-center gap-2 px-3 py-2 transition-colors', itemToneClasses)}
                      data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, itemPath)}
                      rel={external ? 'noopener noreferrer' : undefined}
                      target={external ? '_blank' : undefined}
                    >
                      {item.label || 'Link'}
                    </Link>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>

        <Link href="/" className="flex items-center justify-center">
          {logoAssetRef ? (
            <Image
              id={logoAssetRef}
              alt={logo?.alt || 'Albatha logo'}
              width={260}
              height={60}
              className="h-10 w-auto sm:h-12"
              mode="contain"
            />
          ) : (
            <span className="text-2xl font-medium">albatha</span>
          )}
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <nav
            aria-label="Secondary navigation"
            data-menu-group-id={secondaryMenu?.menuId || 'secondary'}
            data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, 'secondaryMenu')}
          >
            <ul role="list" className="flex items-center gap-2 text-lg">
              {(secondaryMenu?.links || []).map((item, index) => {
                const href = resolveContentLinkHref(item.link)
                if (!href) {
                  return null
                }

                const itemPath = toArrayItemPath('secondaryMenu.links', item._key, index)
                const external = isExternalContentLink(item.link) && item.link?.openInNewTab

                return (
                  <li key={item.itemId || item._key || `secondary-${index}`} data-menu-item-id={item.itemId || undefined}>
                    <Link
                      href={href}
                      className={cn('px-3 py-2 transition-colors', itemToneClasses)}
                      data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, itemPath)}
                      rel={external ? 'noopener noreferrer' : undefined}
                      target={external ? '_blank' : undefined}
                    >
                      {item.label || 'Link'}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <Link
            href={languageHref}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium uppercase tracking-[0.12em] transition-colors',
              toggleToneClasses,
            )}
          >
            <GlobeIcon />
            <span>{languageLabel}</span>
          </Link>
        </div>

        <button
          type="button"
          className={cn('inline-flex items-center justify-center rounded-lg border p-2 lg:hidden', toggleToneClasses)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-header-menu"
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span className="sr-only">Toggle navigation</span>
          <MenuIcon open={mobileOpen} />
        </button>
      </div>

      <div className="hidden lg:block">
        {dropdownItems.map((item, index) => {
          const itemKey = item.itemId || item._key || `primary-${index}`
          const itemPath = toArrayItemPath('primaryMenu.links', item._key, index)
          return (
            <MenuDropdownPanel
              key={itemKey}
              header={header}
              isDraftMode={isDraftMode}
              item={item}
              itemPath={itemPath}
              open={openItemId === itemKey}
            />
          )
        })}
      </div>

      {mobileOpen ? (
        <div id="mobile-header-menu" className="border-t border-inherit lg:hidden">
          <div className="container space-y-6 py-6">
            <nav
              aria-label="Mobile primary navigation"
              data-menu-group-id={primaryMenu?.menuId || 'primary'}
              data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, 'primaryMenu')}
            >
              <ul role="list" className="space-y-2 text-lg">
                {(primaryMenu?.links || []).map((item, index) => {
                  const itemPath = toArrayItemPath('primaryMenu.links', item._key, index)
                  const sections = getDropdownSections(item)
                  const href = resolveContentLinkHref(item.link)
                  const external = isExternalContentLink(item.link) && item.link?.openInNewTab
                  const itemKey = item.itemId || item._key || `mobile-primary-${index}`
                  const isOpen = openItemId === itemKey

                  return (
                    <li key={itemKey} data-menu-item-id={item.itemId || undefined}>
                      {sections.length > 0 ? (
                        <div className="rounded-2xl border border-inherit px-4 py-3">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between gap-3"
                            aria-expanded={isOpen}
                            onClick={() => setOpenItemId(isOpen ? null : itemKey)}
                            data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, itemPath)}
                          >
                            <span>{item.label || 'Link'}</span>
                            <ChevronIcon open={isOpen} />
                          </button>
                          {isOpen ? (
                            <div className="mt-4 space-y-5">
                              {sections.map((section, sectionIndex) => {
                                const sectionPath = toArrayItemPath(`${itemPath}.dropdown.sections`, section._key, sectionIndex)
                                return (
                                  <div
                                    key={section._key || `${itemKey}-section-${sectionIndex}`}
                                    data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, sectionPath)}
                                  >
                                    {section.title ? <h3 className="text-sm uppercase tracking-[0.12em] text-accent">{section.title}</h3> : null}
                                    <ul role="list" className="mt-3 space-y-3">
                                      {(section.links || []).map((link, linkIndex) => {
                                        const nestedHref = resolveContentLinkHref(link.link)
                                        if (!nestedHref) {
                                          return null
                                        }
                                        const linkPath = toArrayItemPath(`${sectionPath}.links`, link._key, linkIndex)
                                        const external =
                                          isExternalContentLink(link.link) && link.link?.openInNewTab

                                        return (
                                          <li key={link.itemId || link._key || `${itemKey}-link-${linkIndex}`}>
                                            <Link
                                              href={nestedHref}
                                              className="block"
                                              data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, linkPath)}
                                              rel={external ? 'noopener noreferrer' : undefined}
                                              target={external ? '_blank' : undefined}
                                            >
                                              {link.label || 'Link'}
                                            </Link>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  </div>
                                )
                              })}
                              {href ? (
                                <Link href={href} className="inline-flex text-sm underline underline-offset-4">
                                  Visit {item.label || 'section'}
                                </Link>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ) : href ? (
                        <Link
                          href={href}
                          className="block rounded-2xl border border-inherit px-4 py-3"
                          data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, itemPath)}
                          rel={external ? 'noopener noreferrer' : undefined}
                          target={external ? '_blank' : undefined}
                        >
                          {item.label || 'Link'}
                        </Link>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </nav>

            <nav
              aria-label="Mobile secondary navigation"
              data-menu-group-id={secondaryMenu?.menuId || 'secondary'}
              data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, 'secondaryMenu')}
            >
              <ul role="list" className="space-y-2 text-base">
                {(secondaryMenu?.links || []).map((item, index) => {
                  const href = resolveContentLinkHref(item.link)
                  if (!href) {
                    return null
                  }

                  const itemPath = toArrayItemPath('secondaryMenu.links', item._key, index)
                  const external = isExternalContentLink(item.link) && item.link?.openInNewTab

                  return (
                    <li key={item.itemId || item._key || `mobile-secondary-${index}`}>
                      <Link
                        href={href}
                        className="block"
                        data-sanity={getSanityDataAttribute(isDraftMode, {id: header._id!, type: header._type || 'header'}, itemPath)}
                        rel={external ? 'noopener noreferrer' : undefined}
                        target={external ? '_blank' : undefined}
                      >
                        {item.label || 'Link'}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <Link
              href={languageHref}
              className={cn('inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium uppercase tracking-[0.12em]', toggleToneClasses)}
            >
              <GlobeIcon />
              <span>{languageLabel}</span>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
