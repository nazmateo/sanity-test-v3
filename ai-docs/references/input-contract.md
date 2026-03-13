# Input Contract

Use this shared input contract for every Figma-to-page run. Populate only the fields relevant to the current phase.

## Required Project Inputs

- `PROJECT_FIGMA_URL`: Figma file URL that contains the design system and page source of truth
- `NEXT_ROUTE`: target Next.js route, for example `/`, `/about`, or `/news/[slug]`
- `SANITY_PAGE_TYPE`: target Sanity document type, usually `homePage` or `page`
- `ALLOWED_EDIT_PATHS`: optional explicit allowlist of files that may be edited during the current run

## Required Phase Inputs

- Token setup phase:
  - `PROJECT_FIGMA_URL`
  - `TOKEN_SOURCE_FILES`
  - `ALLOWED_EDIT_PATHS`
- Section implementation phase:
  - `PROJECT_FIGMA_URL`
  - `TARGET_PAGE_NODE_URL`
  - `TARGET_NODE_URL`
  - `NEXT_ROUTE`
  - `SANITY_PAGE_TYPE`
- Final refinement phase:
  - `PROJECT_FIGMA_URL`
  - `TARGET_PAGE_NODE_URL`
  - `NEXT_ROUTE`
  - `SANITY_PAGE_TYPE`
  - `ALLOWED_EDIT_PATHS`

## Optional Inputs

- `TARGET_PAGE_NODE_URL`: the Figma frame for the full page
- `TARGET_NODE_URL`: the Figma frame or component for the current section
- `ANIMATION_NOTES`: motion, hover, focus, and transition requirements
- `TOKEN_SOURCE_FILES`: existing token files, typically `frontend/app/globals.css` and `frontend/app/layout.tsx`
- `ALLOWED_EDIT_PATHS`: recommended for token setup, seeding, and refinement; optional for section implementation
- `PAGE_SLUG`: stable job identifier used under `ai-docs/jobs`
- `SECTION_NAME`: current section label used in job notes
- `LOCALE_SCOPE`: `en`, `ae`, or `both`
- `APPROVAL_STATE`: `draft`, `approved-for-seeding`, or `done`

## Notes

- The same project-level Figma URL may be reused across many pages.
- Section work should not start until the token and font baseline for the project is established.
- Section implementation may omit `ALLOWED_EDIT_PATHS` when Codex needs flexibility to create new schema files, React block files, and related wiring.
- Section rendering should flow through the existing page builder mapping once schema, queries, and block rendering are wired.
- Seed or migration work should not start until the implementation is approved.
