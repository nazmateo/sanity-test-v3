import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import {createClient} from '@sanity/client'

const ROOT_DIR = process.cwd()
const ENV_FILES = ['.env.local', 'frontend/.env.local', '.env.example', 'frontend/.env.example']
const HERO_SECTION_KEY = 'home-hero'
const ABOUT_US_SECTION_KEY = 'home-about-us'
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

function pathLink(internalPath) {
  return {
    _type: 'cbLink',
    linkType: 'internal',
    internalTargetType: 'path',
    internalPath,
  }
}

function resolveAboutUsImage(existingImage) {
  const imageAssetRef = process.env.HOMEPAGE_ABOUT_US_IMAGE_ASSET_REF?.trim()
  const alt =
    process.env.HOMEPAGE_ABOUT_US_IMAGE_ALT?.trim() ||
    'Albatha employees working in an industrial environment'

  if (imageAssetRef) {
    return {
      _type: 'cbImage',
      media: {
        _type: 'cbMedia',
        mediaType: 'image',
        image: {
          _type: 'image',
          asset: {_type: 'reference', _ref: imageAssetRef},
          alt,
        },
      },
    }
  }

  return existingImage || {_type: 'cbImage'}
}

function buildAboutUsSection(existingAboutUsSection) {
  const existingRows = Array.isArray(existingAboutUsSection?.rows) ? existingAboutUsSection.rows : []
  const existingIntroRow = existingRows.find(
    (row) => row?._type === 'aboutUsContentRow' && row?.layout === 'intro',
  )
  const existingImage = Array.isArray(existingIntroRow?.content)
    ? existingIntroRow.content.find((item) => item?._type === 'cbImage')
    : null
  const image = resolveAboutUsImage(existingImage)

  return {
    _type: 'aboutUsSection',
    _key: ABOUT_US_SECTION_KEY,
    rows: [
      {
        _type: 'aboutUsContentRow',
        _key: 'about-us-row-content',
        layout: 'intro',
        content: [
          ...(image
            ? [
                {
                  _key: 'about-us-image',
                  ...image,
                },
              ]
            : []),
          {
            _type: 'cbHeading',
            _key: 'about-us-heading',
            content:
              'Albatha is a UAE-founded business group built on the conviction that values and performance go hand in hand.',
            level: 'h2',
          },
          {
            _type: 'cbParagraph',
            _key: 'about-us-body',
            content:
              'With more than 10,000 people across 35 companies and multiple sectors across the GCC, we work to improve quality of life for our employees, partners, and communities. Every day, in every business.',
          },
          {
            _type: 'splitArrowButton',
            _key: 'about-us-cta',
            label: 'About Us',
            link: pathLink('/about'),
          },
        ],
      },
      {
        _type: 'aboutUsContentRow',
        _key: 'about-us-row-stats',
        layout: 'stats',
        content: [
          {
            _type: 'aboutUsStat',
            _key: 'about-us-stat-founding-year',
            value: '1959',
            label: 'Founding Year',
            variant: 'outline',
            animateValue: true,
          },
          {
            _type: 'aboutUsStat',
            _key: 'about-us-stat-global-partners',
            value: '200+',
            label: 'Global Partners',
            variant: 'accent',
            animateValue: true,
          },
          {
            _type: 'aboutUsStat',
            _key: 'about-us-stat-employees',
            value: '10,000+',
            label: 'Employees',
            variant: 'dark',
            animateValue: true,
          },
          {
            _type: 'aboutUsStat',
            _key: 'about-us-stat-group-companies',
            value: '35',
            label: 'Group Companies',
            variant: 'outline',
            animateValue: true,
          },
          {
            _type: 'aboutUsStat',
            _key: 'about-us-stat-region',
            value: 'GCC',
            label: '& Beyond',
            variant: 'accent',
            animateValue: false,
          },
          {
            _type: 'aboutUsStat',
            _key: 'about-us-stat-export-markets',
            value: '45+',
            label: 'Export Markets',
            variant: 'dark',
            animateValue: true,
          },
        ],
      },
    ],
  }
}

async function run() {
  const existingHomePage = await client.fetch(
    `*[_type == "homePage" && coalesce(language, "en") == "en"][0]{_id, _type, name, language, headerVariant, footerVariant, seo, structuredData, pageBuilder}`,
  )

  const existingSections = Array.isArray(existingHomePage?.pageBuilder) ? existingHomePage.pageBuilder : []
  const existingAboutUsSection = existingSections.find((section) => section?._key === ABOUT_US_SECTION_KEY)
  const aboutUsSection = buildAboutUsSection(existingAboutUsSection)

  const filteredSections = existingSections.filter((section) => section?._key !== ABOUT_US_SECTION_KEY)
  const heroIndex = filteredSections.findIndex((section) => section?._key === HERO_SECTION_KEY)

  const nextPageBuilder = [...filteredSections]
  if (heroIndex >= 0) {
    nextPageBuilder.splice(heroIndex + 1, 0, aboutUsSection)
  } else {
    nextPageBuilder.unshift(aboutUsSection)
  }

  const documentId = existingHomePage?._id || DEFAULT_HOME_ID

  await client.createOrReplace({
    _id: documentId,
    _type: 'homePage',
    name: existingHomePage?.name || 'Home',
    language: existingHomePage?.language || 'en',
    headerVariant: existingHomePage?.headerVariant || 'negative',
    footerVariant: existingHomePage?.footerVariant || 'negative',
    seo: existingHomePage?.seo,
    structuredData: existingHomePage?.structuredData,
    pageBuilder: nextPageBuilder,
  })

  console.log('Seeded homepage About Us section:')
  console.log(`- projectId: ${projectId}`)
  console.log(`- dataset: ${dataset}`)
  console.log(`- documentId: ${documentId}`)
  console.log(`- pageBuilder sections: ${nextPageBuilder.length}`)
  const introRow = aboutUsSection.rows.find((row) => row._type === 'aboutUsContentRow' && row.layout === 'intro')
  const statsRow = aboutUsSection.rows.find((row) => row._type === 'aboutUsContentRow' && row.layout === 'stats')
  const imageItem = introRow?.content?.find((item) => item._type === 'cbImage')

  console.log(`- rows: ${aboutUsSection.rows.length}`)
  console.log(`- intro content items: ${introRow?.content?.length || 0}`)
  console.log(`- stats: ${statsRow?.content?.filter((item) => item._type === 'aboutUsStat').length || 0}`)
  console.log(`- image: ${imageItem ? 'preserved or seeded from env' : 'left empty for manual upload'}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
