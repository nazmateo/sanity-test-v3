# Page Job Template

Use this file as the single source of truth for one page implementation run.

## Required Context Docs

Read these first:

- `ai-docs/codex-project-context.md`
- `ai-docs/figma-mcp-page-implementation-plan.md`

## Required Default Skills

Use these skills for this workflow:

- `figma-nextjs-page-workflow`
- `next-best-practices`
- `tailwind-design-system`
- `vercel-composition-patterns`

Use this skill only when the task is specifically a UI/UX/accessibility review:

- `web-design-guidelines`

## Prompt Files To Use

Use these prompt files during the matching phases:

- `ai-docs/prompts/01-extract-tokens.md`
- `ai-docs/prompts/02-setup-fonts.md`
- `ai-docs/prompts/03-convert-section.md`
- `ai-docs/prompts/04-assemble-page.md`
- `ai-docs/prompts/05-refine-page.md`

## Input Contract

Fill this before implementation:

```md
PROJECT_FIGMA_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-2&p=f&m=dev

TARGET_PAGE_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-874&m=dev

NEXT_ROUTE: /
SANITY_PAGE_TYPE: homePage
ALLOWED_EDIT_PATHS:

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
- ai-docs/migration-scripts/migrate-home-hero-section.mjs
- ai-docs/migration-scripts/migrate-home-about-us-section.mjs
- ai-docs/migration-scripts/migrate-home-companies-section.mjs
- ai-docs/migration-scripts/migrate-home-blog-posts-section.mjs
- ai-docs/migration-scripts/migrate-home-sectors-section.mjs
- ai-docs/migration-scripts/migrate-news-posts.mjs
```

## Page Metadata

```md
PAGE_NAME: homepage
PAGE_SLUG: /
PAGE_PRIORITY: N/a
PAGE_STATUS: in-progress
LOCALES: en
```

## Page-Level Notes

```md
Summary: Homepage with 5 sections.

Content/modeling notes: Implement sections in the numbered order listed below. Create custom reusable section schema types so they can be reused on other pages, but model each section using the existing cb page-builder system where possible. Only create new schema objects/blocks or extend existing defaults when the current reusable cb system is not enough. Use the content layouting for each section -> container -> rows -> row -> columns -> column -> contents. For text fields, use schema selectors for heading levels (H1-H6) and paragraph/text where appropriate.

SEO notes: Derive SEO values from Figma page content and add them in the seeding scripts. Do not implement AE SEO/content for now.

Animation notes: Check per section animation notes
```

## Section Order

List sections in top-to-bottom order.

```md
1. SECTION_NAME: Hero
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-1000&m=dev
   NOTES: Schema will have video field, heading (h1), text (p), and 3 hero phrases (p), hero phrases will have animation will reveal from right to left fade in cascaing delay of 1 second starting from the top. Last is a know more button that when clicked scrolls to designated path. Important: Disregard the 'menu' node as this is already the header component.

2. SECTION_NAME: About Us
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1298&m=dev
   NOTES: Schema will have an image, header pharagrap (h2), text pharagraph (p), reusable CTA (will be used sitewide), blocks of company stats (6 blocks with designated colors). Blocks numbers will animate count up from 0 to the designated number.

3. SECTION_NAME: Sectors
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1466&m=dev
   NOTES: Schema will have an 2 images, header (h2), the right image has a button acts as a link. Create a reusable react component for that orange button with arrow as it will be used sitewide.

4. SECTION_NAME: Companies
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1470&m=dev
   NOTES: Schema will have an image, header (h2), and array of company and catagory combo. Use reusable component for the each item in the array.

5. SECTION_NAME: Blog posts
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=147-2382&m=dev
   NOTES: This is a grid of blog posts. Theres a latest blog, and 3 others and then there will be a back to top component that goes to the hero section when clicked. You will use the reusable button with arrow from Sectors section.

   Important: Create first schema type for Posts before doing this section. Schema of each post should be image, title, date published, paragraph-like wysiwyg/body, SEO, and a page builder so post content can be dynamic.
```

## Execution Decisions

```md
SECTION_EXECUTION_ORDER: Follow the numbered order in this file.

SCHEMA_STRATEGY: Create custom reusable section schema types for homepage sections so they can also be reused on other pages.

MODELING_STRATEGY: Prefer the existing cb page-builder system for content modeling and rendering. Only create new schema objects/blocks or extend default reusable blocks when the existing cb system is insufficient.

LOCALE_SCOPE_NOW: EN only. Do not create or seed AE documents yet. AE documents will be created manually later.

MIGRATION_WORKFLOW: After each section is implemented and verified, create its seeding/migration script before moving to the next section.

BLOG_POST_DEPENDENCY: Create the post document type before implementing the Blog posts section.

SEO_SEEDING_RULE: Derive SEO values from Figma content and include them in the related seeding scripts.
```

## Expected Execution Order

1. Read the two context docs.
2. Use `01-extract-tokens.md` for token extraction. Add missing tokens if needed. But avoid duplicates.
3. Use `02-setup-fonts.md` if font setup/update is required. This is done.
4. For each section, use `03-convert-section.md`.
5. Assemble the page with `04-assemble-page.md`.
6. Refine with `05-refine-page.md`.
7. Validate schema, queries, types, renderers, and route behavior together.

## Delivery Checklist

```md
- [ ] Figma page URL recorded
- [ ] Route recorded
- [ ] Page type recorded
- [ ] Allowed edit paths recorded
- [ ] Section list ordered
- [ ] Section URLs recorded
- [ ] Token extraction completed
- [ ] Fonts setup reviewed
- [ ] Section schema/component plan completed
- [ ] Page assembled
- [ ] Refinement completed
- [ ] Lint/type-check completed
```
