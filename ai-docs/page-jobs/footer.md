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
negative: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=191-1323&m=dev
positive: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=187-1141&m=dev
NEXT_ROUTE: N/A
SANITY_PAGE_TYPE: singleton document
ALLOWED_EDIT_PATHS:

- studio/src/schemaTypes/singletons/footer.ts
- studio/src/schemaTypes/singletons/settings.tsx
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
- frontend/app/components/Footer.tsx
- frontend/app/components/FooterThemeProvider.tsx
- frontend/app/components/FooterThemeController.tsx
- ai-docs/page-jobs/migration-script/seed-footer-singleton.mjs
```

## Section Metadata

```md
SECTION_NAME: footer
SECTION_ID:
PAGE_SLUG: N/A
STATUS: done
```

## Section Notes

```md
Purpose:Create a footer that is rendered in every page. Has 2 types, positive and negative. Each page will have a settings or field where positive or negative will be selected. Reference how we did in header schema document and react component

Layout summary: based from figma

Content summary: based from figma
```

## CMS and Block Mapping

```md
Candidate schema block type: a singleton document with fields, positive logo, negative logo, group navigations (links, links can have subgroups rendered in submenu dropdown), links has label, select if internal or external, then path to page or custom etc... base it on figma

Use existing block first? yes, if cant be done with existing blocks create reusable blocks.

If no, why a new schema object is needed:

Implementation result: moved the footer into its own `footer` singleton document, kept address/contact fields in `settings`, added a per-page `footerVariant` selector on page-like documents, and rewired the global layout/footer component to combine singleton footer content with settings-based contact information.
```

## Section Checklist

```md
- [ ] Section Figma URL recorded
- [ ] Section purpose documented
- [ ] Existing block mapping evaluated
- [ ] Schema plan documented
- [ ] Query/type impact documented
- [ ] Component plan documented
- [ ] Token usage noted
- [ ] Accessibility considerations noted
```
