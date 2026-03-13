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

function pathLink(internalPath) {
  return {
    _type: 'cbLink',
    linkType: 'internal',
    internalTargetType: 'path',
    internalPath,
  }
}

function menuSubLink(itemId, label, link) {
  return {
    _type: 'menuSubLink',
    _key: itemId,
    itemId,
    label,
    link,
  }
}

function menuDropdownSection(key, title, links) {
  return {
    _type: 'menuDropdownSection',
    _key: key,
    title,
    links,
  }
}

function menuDropdown(key, sections) {
  return {
    _type: 'menuDropdown',
    _key: key,
    sections,
  }
}

function menuLink(itemId, label, link, options = {}) {
  return {
    _type: 'menuLink',
    _key: itemId,
    itemId,
    label,
    ...(link ? {link} : {}),
    ...(options.dropdown ? {dropdown: options.dropdown} : {}),
    ...(options.subLinks?.length ? {subLinks: options.subLinks} : {}),
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

const headerSeed = {
  _id: 'siteHeader',
  _type: 'header',
  languageToggleLabelEn: 'AR',
  languageToggleLabelAe: 'EN',
  primaryMenu: menuGroup('primary', 'Primary', [
    menuLink('nav-about', 'About', pathLink('/about')),
    menuLink('nav-business-units', 'Business Units', pathLink('/business-units'), {
      dropdown: menuDropdown('nav-business-units-dropdown', [
        menuDropdownSection('business-units', 'Albatha Business Units', [
          menuSubLink('bu-automotive', 'Automotive', pathLink('/business-units/automotive')),
          menuSubLink(
            'bu-consumer-products',
            'Consumer Products',
            pathLink('/business-units/consumer-products'),
          ),
          menuSubLink('bu-healthcare', 'Healthcare', pathLink('/business-units/healthcare')),
          menuSubLink('bu-engineering', 'Engineering', pathLink('/business-units/engineering')),
          menuSubLink('bu-real-estate', 'Real Estate', pathLink('/business-units/real-estate')),
          menuSubLink(
            'bu-retail-home-products',
            'Retail & Home Products',
            pathLink('/business-units/retail-home-products'),
          ),
          menuSubLink(
            'bu-home-personal-care',
            'Home & Personal Care',
            pathLink('/business-units/home-personal-care'),
          ),
          menuSubLink(
            'bu-albatha-innovation',
            'Albatha Innovation',
            pathLink('/business-units/albatha-innovation'),
          ),
        ]),
        menuDropdownSection('flagship-brands', 'Flagship Brands', [
          menuSubLink('brand-agmc', 'AGMC', pathLink('/brands/agmc')),
          menuSubLink('brand-mpc', 'MPC', pathLink('/brands/mpc')),
          menuSubLink('brand-scitra', 'Scitra', pathLink('/brands/scitra')),
          menuSubLink(
            'brand-super-general',
            'Super General',
            pathLink('/brands/super-general'),
          ),
        ]),
      ]),
    }),
    menuLink('nav-community', 'Community', pathLink('/community')),
  ]),
  secondaryMenu: menuGroup('secondary', 'Secondary', [
    menuLink('nav-newsroom', 'Newsroom', pathLink('/newsroom')),
    menuLink('nav-contact', 'Contact', pathLink('/contact')),
  ]),
}

async function patchMissingHeaderVariants(transaction) {
  const docs = await client.fetch(
    `*[_type in ["homePage", "page", "legalPage"]]{_id, _type, headerVariant}`,
  )

  for (const doc of docs || []) {
    const variant = doc._type === 'homePage' ? 'negative' : 'positive'
    transaction.patch(doc._id, {
      setIfMissing: {
        headerVariant: variant,
      },
    })
  }
}

async function run() {
  const transaction = client.transaction().createOrReplace(headerSeed)

  await patchMissingHeaderVariants(transaction)

  await transaction.commit({autoGenerateArrayKeys: true})

  console.log('Seeded header singleton and backfilled header variants:')
  console.log(`- projectId: ${projectId}`)
  console.log(`- dataset: ${dataset}`)
  console.log(`- header documentId: ${headerSeed._id}`)
  console.log(`- primary links: ${headerSeed.primaryMenu.links.length}`)
  console.log(`- secondary links: ${headerSeed.secondaryMenu.links.length}`)
  console.log('- positiveLogo / negativeLogo left empty for manual upload')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
