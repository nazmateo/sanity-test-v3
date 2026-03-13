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
PROJECT_FIGMA_URL:
TARGET_PAGE_NODE_URL:
TARGET_NODE_URL:
NEXT_ROUTE:
SANITY_PAGE_TYPE:
ALLOWED_EDIT_PATHS:
```

## Section Metadata

```md
SECTION_NAME:
SECTION_ID:
PAGE_SLUG:
PRIORITY: MVP | Phase 2
STATUS: planned | in-progress | blocked | done
```

## Section Notes

```md
Purpose:

Layout summary:

Content summary:

Interaction/animation notes:

Accessibility notes:

Open questions:
```

## CMS and Block Mapping

```md
Candidate schema block type:

Use existing block first? yes | no

If no, why a new schema object is needed:

Required fields:

Required query changes:

Required component changes:

Draft mode / data-sanity notes:
```

## Asset Notes

```md
Images/icons needed:

Local asset path plan:

Missing assets:
```

## Token Notes

```md
Colors:

Typography:

Spacing:

Radius/shadow:

Missing tokens:
```

## Section Checklist

```md
- [ ] Section Figma URL recorded
- [ ] Section purpose documented
- [ ] Existing block mapping evaluated
- [ ] Schema plan documented
- [ ] Query/type impact documented
- [ ] Component plan documented
- [ ] Assets identified
- [ ] Token usage noted
- [ ] Accessibility considerations noted
```
