import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import {createClient} from '@sanity/client'

const ROOT_DIR = process.cwd()
const ENV_FILES = ['.env.local', 'frontend/.env.local', '.env.example', 'frontend/.env.example']

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }

  const content = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const equalsIndex = line.indexOf('=')
    if (equalsIndex === -1) {
      continue
    }

    const key = line.slice(0, equalsIndex).trim()
    let value = line.slice(equalsIndex + 1).trim()

    const commentIndex = value.indexOf(' #')
    if (commentIndex !== -1) {
      value = value.slice(0, commentIndex).trim()
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

for (const envFile of ENV_FILES) {
  loadEnvFile(path.join(ROOT_DIR, envFile))
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-25'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

if (!projectId) {
  throw new Error('Missing Sanity project ID. Set NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID.')
}

if (!token || token.includes('<paste your')) {
  throw new Error(
    'Missing Sanity API token. Set SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN with write permissions.',
  )
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

function imageField(assetRef, alt) {
  if (!assetRef) {
    return undefined
  }

  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: assetRef},
    ...(alt ? {alt} : {}),
  }
}

function pathLink(internalPath) {
  return {
    _type: 'cbLink',
    linkType: 'internal',
    internalTargetType: 'path',
    internalPath,
  }
}

function externalLink(externalUrl, openInNewTab = false) {
  return {
    _type: 'cbLink',
    linkType: 'external',
    externalUrl,
    openInNewTab,
  }
}

function menuLink(itemId, label, link) {
  return {
    _type: 'menuLink',
    _key: itemId,
    itemId,
    label,
    link,
  }
}

function menuGroup(menuId, title, links) {
  return {
    _type: 'menuGroup',
    _key: menuId,
    menuId,
    title,
    links,
  }
}

function portableTextBlock(text) {
  return [
    {
      _type: 'block',
      _key: 'site-description',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'site-description-span',
          text,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ]
}

function normalizeOfficeAddress(address, index) {
  const value = typeof address === 'string' ? address.trim() : ''
  if (!value) {
    return null
  }

  return {
    _type: 'officeAddress',
    _key: `office-address-${index + 1}`,
    address: value,
  }
}

function parseOfficeAddresses() {
  const combined = process.env.FOOTER_OFFICE_ADDRESSES
  if (combined) {
    try {
      const parsed = JSON.parse(combined)
      if (Array.isArray(parsed)) {
        return parsed
          .map((value, index) => normalizeOfficeAddress(value, index))
          .filter(Boolean)
      }
    } catch {
      // Fall back to delimiter parsing below.
    }

    return combined
      .split('||')
      .map((value, index) => normalizeOfficeAddress(value, index))
      .filter(Boolean)
  }

  return [
    process.env.FOOTER_PRIMARY_ADDRESS || 'Level 22, Boulevard Plaza 1,\nDowntown Burj Khalifa, Dubai',
    process.env.FOOTER_SECONDARY_ADDRESS || 'Level 23, Albatha Tower\nBuhaira Corniche, Sharjah',
  ]
    .map((value, index) => normalizeOfficeAddress(value, index))
    .filter(Boolean)
}

const officeAddresses = parseOfficeAddresses()

const footerSeed = {
  _id: 'siteFooter',
  _type: 'footer',
  positiveLogo: imageField(
    process.env.FOOTER_POSITIVE_LOGO_ASSET_REF || '',
    process.env.FOOTER_POSITIVE_LOGO_ALT || 'Albatha logo',
  ),
  negativeLogo: imageField(
    process.env.FOOTER_NEGATIVE_LOGO_ASSET_REF || '',
    process.env.FOOTER_NEGATIVE_LOGO_ALT || 'Albatha logo',
  ),
  navigationGroups: [
    menuGroup('footer-links', 'Albatha Links', [
      menuLink('footer-home', 'Home', pathLink('/')),
      menuLink('footer-who-we-are', 'Who We Are', pathLink('/who-we-are')),
      menuLink('footer-leadership', 'Leadership', pathLink('/leadership')),
      menuLink('footer-newsroom', 'Newsroom', pathLink('/news')),
    ]),
    menuGroup('footer-business-units-primary', 'Businesses Units', [
      menuLink('footer-bu-automotive', 'Automotive', pathLink('/business-units/automotive')),
      menuLink(
        'footer-bu-consumer-products',
        'Consumer Products',
        pathLink('/business-units/consumer-products'),
      ),
      menuLink('footer-bu-healthcare', 'Healthcare', pathLink('/business-units/healthcare')),
      menuLink('footer-bu-engineering', 'Engineering', pathLink('/business-units/engineering')),
    ]),
    menuGroup('footer-business-units-secondary', '', [
      menuLink('footer-bu-real-estate', 'Real Estate', pathLink('/business-units/real-estate')),
      menuLink(
        'footer-bu-retail-home-products',
        'Retail & Home Products',
        pathLink('/business-units/retail-home-products'),
      ),
      menuLink(
        'footer-bu-home-personal-care',
        'Home & Personal Care',
        pathLink('/business-units/home-personal-care'),
      ),
      menuLink('footer-bu-innovation', 'Innovation', pathLink('/business-units/albatha-innovation')),
    ]),
  ],
  legalMenu: menuGroup('legal', 'Legal', [
    menuLink('footer-privacy', 'Privacy Policy', pathLink('/privacy-policy')),
    menuLink(
      'footer-supplier-code',
      'Supplier Code of Conduct',
      process.env.FOOTER_SUPPLIER_CODE_URL
        ? externalLink(process.env.FOOTER_SUPPLIER_CODE_URL, true)
        : pathLink('/supplier-code-of-conduct'),
    ),
  ]),
  showDefaultLegalLinks: false,
  copyrightText:
    process.env.FOOTER_COPYRIGHT_TEXT || '\u00A9 2026 Albatha Holding LLC. Created by Black.',
}

const settingsFooterFields = {
  officeHeading: process.env.FOOTER_OFFICE_HEADING || 'Albatha Head Offices',
  officeAddresses,
  contactPhone: process.env.FOOTER_CONTACT_PHONE || '+971 4 371 1300',
  contactEmail: process.env.FOOTER_CONTACT_EMAIL || 'business@albatha.com',
}

async function run() {
  await client.createOrReplace(footerSeed)

  const existingSettings = await client.getDocument('siteSettings')

  if (existingSettings?._id) {
    await client.patch('siteSettings').set(settingsFooterFields).commit({autoGenerateArrayKeys: true})
  } else {
    await client.createOrReplace({
      _id: 'siteSettings',
      _type: 'settings',
      title: process.env.SETTINGS_SITE_TITLE || 'Albatha',
      description: portableTextBlock(
        process.env.SETTINGS_SITE_DESCRIPTION || 'Albatha corporate website',
      ),
      ...settingsFooterFields,
    })
  }

  console.log('Seeded footer singleton and footer-related site settings:')
  console.log(`- projectId: ${projectId}`)
  console.log(`- dataset: ${dataset}`)
  console.log(`- footer documentId: ${footerSeed._id}`)
  console.log(`- navigation groups: ${footerSeed.navigationGroups.length}`)
  console.log(`- legal links: ${footerSeed.legalMenu.links.length}`)
  console.log(`- office addresses: ${officeAddresses.length}`)
  console.log(`- patched settings document: siteSettings`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
