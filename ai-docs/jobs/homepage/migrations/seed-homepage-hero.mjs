import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import {createClient} from '@sanity/client'

const ROOT_DIR = process.cwd()
const ENV_FILES = ['.env.local', 'frontend/.env.local', '.env.example', 'frontend/.env.example']
const HERO_SECTION_KEY = 'home-hero'
const DEFAULT_HOME_ID = 'homePage-en'

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

function resolveHeroMedia(existingBackgroundMedia) {
  const videoAssetRef = process.env.HOMEPAGE_HERO_BACKGROUND_VIDEO_ASSET_REF?.trim()
  const imageAssetRef = process.env.HOMEPAGE_HERO_BACKGROUND_IMAGE_ASSET_REF?.trim()
  const alt =
    process.env.HOMEPAGE_HERO_BACKGROUND_ALT?.trim() ||
    'Albatha homepage hero background'

  if (videoAssetRef) {
    return {
      _type: 'cbMedia',
      mediaType: 'video',
      videoFile: {
        _type: 'file',
        asset: {_type: 'reference', _ref: videoAssetRef},
      },
    }
  }

  if (imageAssetRef) {
    return {
      _type: 'cbMedia',
      mediaType: 'image',
      image: {
        _type: 'image',
        asset: {_type: 'reference', _ref: imageAssetRef},
        alt,
      },
    }
  }

  if (existingBackgroundMedia) {
    return existingBackgroundMedia
  }

  return undefined
}

function pathLink(internalPath) {
  return {
    _type: 'cbLink',
    linkType: 'internal',
    internalTargetType: 'path',
    internalPath,
  }
}

function buildHeroSection(existingHeroSection) {
  return {
    _type: 'heroSection',
    _key: HERO_SECTION_KEY,
    backgroundMedia: resolveHeroMedia(existingHeroSection?.backgroundMedia),
    content: [
      {
        _type: 'cbHeading',
        _key: 'hero-heading',
        content: 'Business with Values',
        level: 'h1',
      },
      {
        _type: 'cbParagraph',
        _key: 'hero-paragraph',
        content:
          'Albatha is a Sharjah-born family of companies serving communities across the region, built on shared values and 70 years of trust.',
      },
    ],
    phrases: [
      {
        _type: 'heroPhrase',
        _key: 'hero-phrase-founded',
        text: 'Founded in 1959',
        placement: 'topLeft',
      },
      {
        _type: 'heroPhrase',
        _key: 'hero-phrase-valley',
        text: 'Al Batha = The Valley',
        placement: 'middleRight',
      },
      {
        _type: 'heroPhrase',
        _key: 'hero-phrase-rooted',
        text: 'Rooted in the UAE',
        placement: 'bottomLeft',
      },
    ],
    cta: {
      _type: 'cbButton',
      _key: 'hero-cta',
      label: 'Know More',
      actionType: 'link',
      link: pathLink('/#about-us'),
    },
  }
}

async function run() {
  const existingHomePage = await client.fetch(
    `*[_type == "homePage" && coalesce(language, "en") == "en"][0]{_id, _type, pageBuilder}`,
  )

  const existingHeroSection = Array.isArray(existingHomePage?.pageBuilder)
    ? existingHomePage.pageBuilder.find((section) => section?._key === HERO_SECTION_KEY)
    : null

  const heroSection = buildHeroSection(existingHeroSection)
  const existingSections = Array.isArray(existingHomePage?.pageBuilder)
    ? existingHomePage.pageBuilder.filter((section) => section?._key !== HERO_SECTION_KEY)
    : []

  const nextPageBuilder = [heroSection, ...existingSections]
  const documentId = existingHomePage?._id || DEFAULT_HOME_ID

  await client.createOrReplace({
    _id: documentId,
    _type: 'homePage',
    name: 'Home',
    language: 'en',
    headerVariant: 'negative',
    footerVariant: 'negative',
    seo: {
      metaTitle: 'Albatha | Business with Values',
      metaDescription:
        'Albatha is a Sharjah-born family of companies serving communities across the region, built on shared values and 70 years of trust.',
    },
    structuredData: existingHomePage?.structuredData,
    pageBuilder: nextPageBuilder,
  })

  console.log('Seeded homepage hero section:')
  console.log(`- projectId: ${projectId}`)
  console.log(`- dataset: ${dataset}`)
  console.log(`- documentId: ${documentId}`)
  console.log(`- pageBuilder sections: ${nextPageBuilder.length}`)
  console.log(`- hero phrases: ${heroSection.phrases.length}`)
  console.log(`- background media type: ${heroSection.backgroundMedia?.mediaType || 'not-seeded'}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
