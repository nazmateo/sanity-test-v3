# Section Job Template

Use this file when a section needs its own implementation notes, schema planning, or review trail.

## Required Context Docs

Read these first:

- `ai-docs/codex-project-context.md`
- `ai-docs/figma-mcp-page-implementation-plan.md`

## Required Default Skills

Use these skills for section implementation:

- `figma-nextjs-page-workflow`
- `next-best-practices`
- `tailwind-design-system`
- `vercel-composition-patterns`

Use this skill only when the task is specifically a UI/UX/accessibility review:

- `web-design-guidelines`

## Prompt Files To Use

Primary prompt for section work:

- `ai-docs/prompts/03-convert-section.md`

Use these only if they are directly needed by this section:

- `ai-docs/prompts/01-extract-tokens.md`
- `ai-docs/prompts/02-setup-fonts.md`
- `ai-docs/prompts/05-refine-page.md`

## Input Contract

```md
PROJECT_FIGMA_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-2&p=f&m=dev
TARGET_PAGE_NODE_URL: N/A
TARGET_NODE_URL:
negative: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=138-354&m=dev
positive: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=173-3254&m=dev
NEXT_ROUTE: NA
SANITY_PAGE_TYPE: singleton document
ALLOWED_EDIT_PATHS:

- studio/src/schemaTypes/singletons/header.ts
- studio/src/schemaTypes/objects/headerSettings.ts
- studio/src/schemaTypes/objects/menuLink.ts
- studio/src/schemaTypes/objects/headerDropdownSection.ts
- studio/src/schemaTypes/singletons/homePage.ts
- studio/src/schemaTypes/documents/page.ts
- studio/src/schemaTypes/documents/legalPage.ts
- studio/src/schemaTypes/index.ts
- studio/src/structure/index.ts
- studio/sanity.config.ts
- frontend/sanity/lib/queries.ts
- frontend/sanity/lib/settings-types.ts
- frontend/sanity/lib/types.ts
- frontend/app/lib/page-types.ts
- frontend/app/layout.tsx
- frontend/app/page.tsx
- frontend/app/[...segments]/page.tsx
- frontend/app/components/Header.tsx
- frontend/app/components/HeaderThemeProvider.tsx
- frontend/app/components/HeaderThemeController.tsx
- ai-docs/page-jobs/migration-script/seed-header-singleton.mjs
```

## Section Metadata

```md
SECTION_NAME: Header
SECTION_ID:
PAGE_SLUG: N/a
STATUS: done
```

## Section Notes

```md
Purpose: Create a header that is rendered in every page. Has 2 types, positive and negative. Each page will have a settings or field where positive or negative will be selected.

Layout summary: based from figma

Content summary: based from figma

Interaction/animation notes: a link or nav element is hovered, the submenu dropdown is revealed. https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-742&m=dev
```

## CMS and Block Mapping

```md
Candidate schema block type: a singleton document with fields, positive logo, negative logo, main navigation (links, links can have subgroups rendered in submenu dropdown), links has label, select if internal or external, then path to page or custom.

Use existing block first? yes, if cant be done with existing blocks create reusable blocks.

Implementation result: moved the global header into its own `header` singleton document, added positive/negative logo support, locale toggle label, grouped dropdown sections, optional dropdown media, and kept the per-page `headerVariant` selector on page-like documents so the global layout header can switch between positive and negative variants.
```

## Section Checklist

```md
- [ ] Section Figma URL recorded
- [ ] Section purpose documented
- [ ] Existing block mapping evaluated
- [ ] Schema plan documented
- [ ] Component plan documented
- [ ] Accessibility considerations noted
```
