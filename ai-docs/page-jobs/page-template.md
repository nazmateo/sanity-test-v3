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
PROJECT_FIGMA_URL:
TARGET_PAGE_NODE_URL:
NEXT_ROUTE:
SANITY_PAGE_TYPE:
ALLOWED_EDIT_PATHS:
```

## Page Metadata

```md
PAGE_NAME:
PAGE_SLUG:
PAGE_PRIORITY:
PAGE_STATUS: planned | in-progress | blocked | done
LOCALES: en | ae | both
```

## Page-Level Notes

```md
Summary:

Content/modeling notes:

SEO notes:

Animation notes:

Open questions:
```

## Section Order

List sections in top-to-bottom order.

```md
1. SECTION_NAME:
   TARGET_NODE_URL:
   PRIORITY: MVP | Phase 2
   NOTES:

2. SECTION_NAME:
   TARGET_NODE_URL:
   PRIORITY: MVP | Phase 2
   NOTES:
```

## Section Files

Create one section file only when the section needs extra implementation notes, CMS planning, or approvals.

Suggested location:

`ai-docs/page-jobs/<page-slug>/sections/<section-name>.md`

## Expected Execution Order

1. Read the two context docs.
2. Use `01-extract-tokens.md` for token extraction.
3. Use `02-setup-fonts.md` if font setup/update is required.
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
