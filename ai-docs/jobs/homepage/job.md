# Page Job Template

Use this file as the reusable template for one page implementation run.

## Inputs

```md
PROJECT_FIGMA_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-2&p=f&m=dev
TARGET_PAGE_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-874&m=dev
NEXT_ROUTE: /
SANITY_PAGE_TYPE: homePage
LOCALE_SCOPE:
```

## Status

```md
PAGE_NAME: Homapage
PAGE_SLUG: /
PAGE_STATUS: in-progress
TOKENS_STATUS: done
FONTS_STATUS: done
```

## Allowed Edit Paths

Optional. Use this when tighter edit control is needed.

```md
- frontend/app/globals.css
- frontend/app/layout.tsx
- frontend/sanity/lib/queries.ts
- frontend/sanity/lib/types.ts
- frontend/app/components/BlockRenderer.tsx
- studio/src/schemaTypes/index.ts
- studio/src/structure/index.ts
```

## Execution Decisions

```md
SECTION_EXECUTION_ORDER: chronological order. 
SCHEMA_STRATEGY: Use schema strategy in the rules and strict rule should adhere to drag and drop configuration, using array of items rendered in the sections with required attributes. 
MODELING_STRATEGY: Create smaller reusable components as needed depending on the contents of each section if there are duplicates or multiples. Check per section animation notes
SEEDING_RULE: Create the seed or migration file only after implementation approval for the relevant section.
SEO_SEEDING_RULE: Derive SEO values from Figma page content and add them in the seeding scripts. Do not implement AE SEO/content for now.
DEPENDENCIES: N/A
```

## Section Order

```md
1. SECTION_NAME: Hero
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-1000&m=dev
   NOTES: Schema will have video field, heading (h1), text (p), and 3 hero phrases (p), hero phrases will have animation will reveal from right to left fade in cascaing delay of 1 second starting from the top. Last is a know more button that when clicked scrolls to designated path. Know more button is fixed on the bottom part of the section. Important: A. Disregard the 'menu' node as this is already the header component. B. H1 and p should be inside array so it can be dragged and drop positions in presentation tool.
   STATUS: in-progress

2. SECTION_NAME: About Us
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1298&m=dev
   NOTES: Schema will have an image, header pharagrap (h2), text pharagraph (p), reusable CTA (will be used sitewide), blocks of company stats (6 blocks with designated colors). Blocks numbers will animate count up from 0 to the designated number.
   STATUS: not yet started, waiting for approval of in-progress section

3. SECTION_NAME: Sectors
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1466&m=dev
   NOTES: Schema will have an 2 images, header (h2), the right image has a button acts as a link. Create a reusable react component for that orange button with arrow as it will be used sitewide.
   STATUS: not yet started, waiting for approval of in-progress section


4. SECTION_NAME: Companies
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1470&m=dev
   NOTES: Schema will have an image, header (h2), and array of company and catagory combo. Use reusable component for the each item in the array.
   STATUS: not yet started, waiting for approval of in-progress section


5. SECTION_NAME: Blog posts
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=147-2382&m=dev
   NOTES: This is a grid of blog posts. Theres a latest blog, and 3 others and then there will be a back to top component that goes to the hero section when clicked. You will use the reusable button with arrow from Sectors section.
   STATUS: not yet started, waiting for approval of in-progress section


   Important: Create first schema type for Posts before doing this section. Schema of each post should be image, title, date published, paragraph-like wysiwyg/body, SEO, and a page builder so post content can be dynamic.
```
