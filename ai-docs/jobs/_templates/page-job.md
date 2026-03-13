# Page Job Template

Use this file as the reusable template for one page implementation run.

## Inputs

```md
PROJECT_FIGMA_URL:
TARGET_PAGE_NODE_URL:
NEXT_ROUTE:
SANITY_PAGE_TYPE:
LOCALE_SCOPE:
```

## Status

```md
PAGE_NAME:
PAGE_SLUG:
PAGE_STATUS: planned | in-progress | blocked | done
TOKENS_STATUS: not-started | in-progress | done
FONTS_STATUS: not-started | in-progress | done
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
SECTION_EXECUTION_ORDER:
SCHEMA_STRATEGY:
MODELING_STRATEGY:
SEEDING_RULE: Create the seed or migration file only after implementation approval for the relevant section.
SEO_SEEDING_RULE:
DEPENDENCIES:
```

## Section Order

```md
1. SECTION_NAME:
   TARGET_NODE_URL:

2. SECTION_NAME:
   TARGET_NODE_URL:
```
