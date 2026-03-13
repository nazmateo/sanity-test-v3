import {draftMode} from 'next/headers'
import Link from 'next/link'

import Image from '@/app/components/SanityImage'
import {cn} from '@/app/lib/cn'
import type {
  FooterSettings,
  FooterVariant,
  LayoutSettings,
  MenuGroup,
  MenuLink,
} from '@/sanity/lib/settings-types'
import {getSanityDataAttribute, toArrayItemPath} from '@/sanity/lib/visual-editing'
import {isExternalContentLink, resolveContentLinkHref} from '@/sanity/lib/utils'

type FooterProps = {
  footer?: FooterSettings | null
  settings?: LayoutSettings | null
  variant?: FooterVariant | null
}

function normalizePhoneHref(phone?: string | null): string | null {
  if (!phone) {
    return null
  }

  const normalized = phone.replace(/[^\d+]/g, '')
  return normalized ? `tel:${normalized}` : null
}

function renderMenuLink(
  link: MenuLink,
  key: string,
  className: string,
  dataSanity?: string,
) {
  const href = resolveContentLinkHref(link.link)
  if (!href) {
    return null
  }

  const external = isExternalContentLink(link.link) && link.link?.openInNewTab

  return (
    <li key={key} data-menu-item-id={link.itemId || undefined}>
      <Link
        href={href}
        className={className}
        data-sanity={dataSanity}
        rel={external ? 'noopener noreferrer' : undefined}
        target={external ? '_blank' : undefined}
      >
        {link.label || 'Link'}
      </Link>
    </li>
  )
}

function FooterNavGroup({
  group,
  groupPath,
  footer,
  isDraftMode,
  headingClassName,
  linkClassName,
}: {
  group: MenuGroup
  groupPath: string
  footer: FooterSettings
  isDraftMode: boolean
  headingClassName: string
  linkClassName: string
}) {
  const links = group.links || []

  return (
    <section
      data-menu-group-id={group.menuId || undefined}
      data-sanity={getSanityDataAttribute(isDraftMode, {id: footer._id!, type: footer._type || 'footer'}, groupPath)}
    >
      {group.title ? <h3 className={headingClassName}>{group.title}</h3> : null}
      <ul role="list" className={cn('space-y-4', group.title ? 'mt-6' : 'mt-[3.625rem] lg:mt-[4.25rem]')}>
        {links.map((link, index) =>
          renderMenuLink(
            link,
            link.itemId || link._key || `${group.menuId || 'footer-group'}-${index}`,
            linkClassName,
            getSanityDataAttribute(
              isDraftMode,
              {id: footer._id!, type: footer._type || 'footer'},
              toArrayItemPath(`${groupPath}.links`, link._key, index),
            ),
          ),
        )}
      </ul>
    </section>
  )
}

export default async function Footer({footer, settings, variant = 'positive'}: FooterProps) {
  const hasFooterDocument = Boolean(footer?._id)
  const hasSettingsDocument = Boolean(settings?._id)

  if (!hasFooterDocument && !hasSettingsDocument) {
    return null
  }

  const {isEnabled: isDraftMode} = await draftMode()
  const logo =
    variant === 'negative'
      ? footer?.negativeLogo || footer?.positiveLogo
      : footer?.positiveLogo || footer?.negativeLogo
  const logoAssetRef = logo?.asset?._ref
  const navigationGroups = footer?.navigationGroups || []
  const legalLinks = footer?.legalMenu?.links || []
  const officeAddresses = settings?.officeAddresses || []
  const showDefaultLegalLinks = footer?.showDefaultLegalLinks ?? true
  const phoneHref = normalizePhoneHref(settings?.contactPhone)
  const [primaryOfficeAddress, ...secondaryOfficeAddresses] = officeAddresses
  const theme =
    variant === 'negative'
      ? {
          root: 'bg-primary text-white',
          divider: 'border-white/35',
          heading: 'text-2xl text-accent',
          link: 'text-[1.0625rem] text-white/95 transition-colors hover:text-white focus-visible:text-white',
          legal: 'text-sm text-white/60 transition-colors hover:text-white',
          copyright: 'text-sm text-white/60',
          officeHeading: 'text-xl font-medium text-white',
          officeText: 'text-[1.0625rem] leading-[1.45] text-white/95',
          contact: 'text-[1.75rem] leading-[1.35] text-[#f25e03] transition-opacity hover:opacity-80',
        }
      : {
          root: 'bg-surface text-foreground',
          divider: 'border-foreground/35',
          heading: 'text-2xl text-accent',
          link: 'text-[1.0625rem] text-foreground transition-colors hover:text-accent focus-visible:text-accent',
          legal: 'text-sm text-foreground/60 transition-colors hover:text-foreground',
          copyright: 'text-sm text-foreground/60',
          officeHeading: 'text-xl font-medium text-foreground',
          officeText: 'text-[1.0625rem] leading-[1.45] text-foreground',
          contact: 'text-[1.75rem] leading-[1.35] text-[#f25e03] transition-opacity hover:opacity-80',
        }

  return (
    <footer
      className={cn('relative overflow-hidden', theme.root)}
      data-sanity={
        hasFooterDocument
          ? getSanityDataAttribute(isDraftMode, {id: footer!._id!, type: footer!._type || 'footer'}, '')
          : undefined
      }
    >
      <div className="container py-14 sm:py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] lg:gap-12">
          <div className="space-y-10">
            <Link href="/" className="inline-flex">
              {logoAssetRef ? (
                <Image
                  id={logoAssetRef}
                  alt={logo?.alt || 'Albatha logo'}
                  width={260}
                  height={60}
                  className="h-11 w-auto sm:h-[3.75rem]"
                  mode="contain"
                />
              ) : (
                <span className="text-3xl font-medium">albatha</span>
              )}
            </Link>

            <div
              className="grid gap-6 sm:grid-cols-2"
              data-sanity={
                hasSettingsDocument
                  ? getSanityDataAttribute(
                      isDraftMode,
                      {id: settings!._id!, type: settings!._type || 'settings'},
                      'officeAddresses',
                    )
                  : undefined
              }
            >
              <div className="space-y-5 lg:max-w-[16rem]">
                {settings?.officeHeading ? (
                  <h2
                    className={theme.officeHeading}
                    data-sanity={
                      hasSettingsDocument
                        ? getSanityDataAttribute(
                            isDraftMode,
                            {id: settings!._id!, type: settings!._type || 'settings'},
                            'officeHeading',
                          )
                        : undefined
                    }
                  >
                    {settings.officeHeading}
                  </h2>
                ) : null}
                {primaryOfficeAddress?.address ? (
                  <p
                    className={theme.officeText}
                    data-sanity={
                      hasSettingsDocument
                        ? getSanityDataAttribute(
                            isDraftMode,
                            {id: settings!._id!, type: settings!._type || 'settings'},
                            toArrayItemPath('officeAddresses', primaryOfficeAddress._key, 0),
                          )
                        : undefined
                    }
                  >
                    {primaryOfficeAddress.address}
                  </p>
                ) : null}
              </div>
              {secondaryOfficeAddresses.map((item, index) => (
                <p
                  key={item._key || `office-address-${index + 1}`}
                  className={theme.officeText}
                  data-sanity={
                    hasSettingsDocument
                      ? getSanityDataAttribute(
                          isDraftMode,
                          {id: settings!._id!, type: settings!._type || 'settings'},
                          toArrayItemPath('officeAddresses', item._key, index + 1),
                        )
                      : undefined
                  }
                >
                  {item.address}
                </p>
              ))}
            </div>

            <div className="space-y-2">
              {settings?.contactPhone ? (
                phoneHref ? (
                  <Link
                    href={phoneHref}
                    className={cn('block w-fit', theme.contact)}
                    data-sanity={
                      hasSettingsDocument
                        ? getSanityDataAttribute(
                            isDraftMode,
                            {id: settings!._id!, type: settings!._type || 'settings'},
                            'contactPhone',
                          )
                        : undefined
                    }
                  >
                    {settings.contactPhone}
                  </Link>
                ) : (
                  <span
                    className={cn('block w-fit', theme.contact)}
                    data-sanity={
                      hasSettingsDocument
                        ? getSanityDataAttribute(
                            isDraftMode,
                            {id: settings!._id!, type: settings!._type || 'settings'},
                            'contactPhone',
                          )
                        : undefined
                    }
                  >
                    {settings.contactPhone}
                  </span>
                )
              ) : null}
              {settings?.contactEmail ? (
                <Link
                  href={`mailto:${settings.contactEmail}`}
                  className={cn('block w-fit', theme.contact)}
                  data-sanity={
                    hasSettingsDocument
                      ? getSanityDataAttribute(
                          isDraftMode,
                          {id: settings!._id!, type: settings!._type || 'settings'},
                          'contactEmail',
                        )
                      : undefined
                  }
                >
                  {settings.contactEmail}
                </Link>
              ) : null}
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            data-sanity={
              hasFooterDocument
                ? getSanityDataAttribute(
                    isDraftMode,
                    {id: footer!._id!, type: footer!._type || 'footer'},
                    'navigationGroups',
                  )
                : undefined
            }
          >
            {navigationGroups.map((group, index) => (
              <FooterNavGroup
                key={group.menuId || group.title || `footer-group-${index}`}
                group={group}
                groupPath={toArrayItemPath('navigationGroups', group._key, index)}
                footer={footer!}
                isDraftMode={isDraftMode}
                headingClassName={theme.heading}
                linkClassName={theme.link}
              />
            ))}
          </nav>
        </div>

        <div className={cn('mt-14 border-t pt-5', theme.divider)}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <nav
              aria-label="Footer legal navigation"
              data-menu-group-id={footer?.legalMenu?.menuId || undefined}
              data-sanity={
                hasFooterDocument
                  ? getSanityDataAttribute(
                      isDraftMode,
                      {id: footer!._id!, type: footer!._type || 'footer'},
                      'legalMenu',
                    )
                  : undefined
              }
            >
              <ul role="list" className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {legalLinks.map((link, index) =>
                  renderMenuLink(
                    link,
                    link.itemId || link._key || `legal-link-${index}`,
                    theme.legal,
                    hasFooterDocument
                      ? getSanityDataAttribute(
                          isDraftMode,
                          {id: footer!._id!, type: footer!._type || 'footer'},
                          toArrayItemPath('legalMenu.links', link._key, index),
                        )
                      : undefined,
                  ),
                )}
                {showDefaultLegalLinks && legalLinks.length === 0
                  ? [
                      <li key="default-privacy">
                        <Link href="/privacy-policy" className={theme.legal}>
                          Privacy Policy
                        </Link>
                      </li>,
                      <li key="default-terms">
                        <Link href="/terms-and-conditions" className={theme.legal}>
                          Terms &amp; Conditions
                        </Link>
                      </li>,
                    ]
                  : null}
              </ul>
            </nav>

            {footer?.copyrightText ? (
              <p
                className={cn('text-left lg:text-right', theme.copyright)}
                data-sanity={
                  hasFooterDocument
                    ? getSanityDataAttribute(
                        isDraftMode,
                        {id: footer!._id!, type: footer!._type || 'footer'},
                        'copyrightText',
                      )
                    : undefined
                }
              >
                {footer.copyrightText}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
