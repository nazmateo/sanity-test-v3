# Homepage Job

## Inputs

```md
PROJECT_FIGMA_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-2&p=f&m=dev
TARGET_PAGE_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-874&m=dev
NEXT_ROUTE: /
SANITY_PAGE_TYPE: homePage
LOCALE_SCOPE: en
```

## Status

```md
PAGE_NAME: homepage
PAGE_SLUG: /
PAGE_STATUS: in-progress
TOKENS_STATUS: in-progress
FONTS_STATUS: done
```

## Allowed Edit Paths

```md
- studio/src/schemaTypes/index.ts
- studio/src/schemaTypes/documents/post.ts
- studio/src/schemaTypes/objects/pageBuilderBlockTypes.ts
- studio/src/schemaTypes/objects/backToTopBlock.ts
- studio/src/schemaTypes/objects/blogPostsSection.ts
- studio/src/schemaTypes/objects/heroSection.ts
- studio/src/schemaTypes/objects/heroPhrase.ts
- studio/src/schemaTypes/objects/newsFeaturedPostBlock.ts
- studio/src/schemaTypes/objects/newsPostCardsBlock.ts
- studio/src/schemaTypes/objects/aboutStatCard.ts
- studio/src/schemaTypes/objects/aboutUsSection.ts
- studio/src/schemaTypes/objects/companiesSection.ts
- studio/src/schemaTypes/objects/companyFeatureItem.ts
- studio/src/schemaTypes/objects/companyFeaturesBlock.ts
- studio/src/schemaTypes/objects/sectorsListBlock.ts
- studio/src/schemaTypes/objects/sectorsMediaBlock.ts
- studio/src/schemaTypes/objects/sectorsSection.ts
- frontend/sanity/lib/queries.ts
- frontend/sanity/lib/types.ts
- frontend/app/components/BlockRenderer.tsx
- frontend/app/components/HeroSection.tsx
- frontend/app/components/AboutStatCard.tsx
- frontend/app/components/AboutUsSection.tsx
- frontend/app/components/ArrowSquareLink.tsx
- frontend/app/components/BackToTopLink.tsx
- frontend/app/components/BlogPostsSection.tsx
- frontend/app/components/CompaniesSection.tsx
- frontend/app/components/CompanyFeatureItem.tsx
- frontend/app/components/NewsPostCard.tsx
- frontend/app/components/SectorsSection.tsx
- frontend/app/components/SplitButtonLink.tsx
- frontend/app/globals.css
- frontend/app/news/[slug]/page.tsx
- frontend/app/page.tsx
- frontend/app/[...segments]/page.tsx
- studio/src/structure/index.ts
- ai-docs/jobs/shared/migrations/seed-header-singleton.mjs
- ai-docs/jobs/shared/migrations/seed-footer-singleton.mjs
```

## Execution Decisions

```md
SECTION_EXECUTION_ORDER: Follow the numbered order in this file.
SCHEMA_STRATEGY: Create reusable homepage section schema types that can also be reused on other pages.
MODELING_STRATEGY: Prefer the existing cb page-builder system first and extend only when necessary.
SEEDING_RULE: Create the seed or migration file only after implementation approval for the relevant section.
SEO_SEEDING_RULE: Derive SEO values from approved Figma content.
BLOG_POST_DEPENDENCY: Create the post document type before implementing the Blog posts section.
```

## Section Order

```md
1. Hero
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-1000&m=dev

2. About Us
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1298&m=dev

3. Sectors
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1466&m=dev

4. Companies
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1470&m=dev

5. Blog posts
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=147-2382&m=dev
```
