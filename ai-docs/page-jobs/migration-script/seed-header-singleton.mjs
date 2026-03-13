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

function subLink(itemId, label, link) {
  return {
    _type: 'menuSubLink',
    _key: itemId,
    itemId,
    label,
    link,
  }
}

function dropdownSection(key, title, links) {
  return {
    _type: 'headerDropdownSection',
    _key: key,
    title,
    links,
  }
}

function menuLink(itemId, label, link, options = {}) {
  return {
    _type: 'menuLink',
    _key: itemId,
    itemId,
    label,
    link,
    ...(options.subLinks?.length ? {subLinks: options.subLinks} : {}),
    ...(options.dropdownSections?.length ? {dropdownSections: options.dropdownSections} : {}),
    ...(options.dropdownMedia?.length ? {dropdownMedia: options.dropdownMedia} : {}),
  }
}

function menuGroup(menuId, title, links) {
  return {
    _type: 'menuGroup',
    menuId,
    title,
    links,
  }
}

const businessUnitsMediaRefs = (process.env.HEADER_BUSINESS_UNITS_MEDIA_REFS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

const headerSeed = {
  _id: 'siteHeader',
  _type: 'header',
  positiveLogo: imageField(
    process.env.HEADER_POSITIVE_LOGO_ASSET_REF || '',
    process.env.HEADER_POSITIVE_LOGO_ALT || 'Albatha logo',
  ),
  negativeLogo: imageField(
    process.env.HEADER_NEGATIVE_LOGO_ASSET_REF || '',
    process.env.HEADER_NEGATIVE_LOGO_ALT || 'Albatha logo',
  ),
  localeToggleLabel: process.env.HEADER_LOCALE_TOGGLE_LABEL || '',
  primaryMenu: menuGroup('primary', 'Primary', [
    menuLink('nav-about', 'About', pathLink('/about')),
    menuLink('nav-business-units', 'Business Units', pathLink('/business-units'), {
      dropdownSections: [
        dropdownSection('bu-sectors', 'Albatha Business Units', [
          subLink('bu-automotive', 'Automotive', pathLink('/business-units/automotive')),
          subLink(
            'bu-consumer-products',
            'Consumer Products',
            pathLink('/business-units/consumer-products'),
          ),
          subLink('bu-healthcare', 'Healthcare', pathLink('/business-units/healthcare')),
          subLink('bu-engineering', 'Engineering', pathLink('/business-units/engineering')),
          subLink('bu-real-estate', 'Real Estate', pathLink('/business-units/real-estate')),
          subLink(
            'bu-retail-home-products',
            'Retail & Home Products',
            pathLink('/business-units/retail-home-products'),
          ),
          subLink(
            'bu-home-personal-care',
            'Home & Personal Care',
            pathLink('/business-units/home-personal-care'),
          ),
          subLink(
            'bu-innovation',
            'Albatha Innovation',
            pathLink('/business-units/albatha-innovation'),
          ),
        ]),
        dropdownSection('bu-brands', 'Flagship Brands', [
          subLink('brand-agmc', 'AGMC', pathLink('/brands/agmc')),
          subLink('brand-mpc', 'MPC', pathLink('/brands/mpc')),
          subLink('brand-scitra', 'Scitra', pathLink('/brands/scitra')),
          subLink('brand-super-general', 'Super General', pathLink('/brands/super-general')),
        ]),
      ],
      dropdownMedia: businessUnitsMediaRefs.map((assetRef, index) =>
        imageField(assetRef, `Business Units dropdown image ${index + 1}`),
      ),
    }),
    menuLink('nav-community', 'Community', pathLink('/community')),
  ]),
  secondaryMenu: menuGroup('secondary', 'Secondary', [
    menuLink('nav-newsroom', 'Newsroom', pathLink('/news')),
    menuLink('nav-contact', 'Contact', pathLink('/contact')),
  ]),
}

async function run() {
  await client.createOrReplace(headerSeed)

  console.log('Seeded header singleton:')
  console.log(`- projectId: ${projectId}`)
  console.log(`- dataset: ${dataset}`)
  console.log(`- documentId: ${headerSeed._id}`)
  console.log(`- primary links: ${headerSeed.primaryMenu.links.length}`)
  console.log(`- secondary links: ${headerSeed.secondaryMenu.links.length}`)
  console.log(`- dropdown media count: ${businessUnitsMediaRefs.length}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
