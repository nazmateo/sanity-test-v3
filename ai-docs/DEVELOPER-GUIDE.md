# Codex Workflow Handoff

This file is for developers. It explains how to instruct Codex from start to finish for the Figma-to-Sanity-to-Next.js workflow used in this repository.

Use this as the human-facing handoff guide. `ai-docs/README.md` is the Codex-only execution guide. Note: Every start of AI session, make codex understand `ai-docs/README.md` before execution of the workflow.

For boilerplate usage:

- use `ai-docs/jobs/_templates/` to create new job files
- use `ai-docs/jobs/_examples/` only as reference
- use `ai-docs/jobs/_examples/migrations/` as migration examples only
- do not treat example files as active project state

## What Developers Need To Know

The workflow is:

1. Run token extraction and font setup once for the project.
2. Start one page by giving Codex the page-level Figma URL.
3. Implement one section at a time using the section-level Figma URL.
4. Review the implementation before any seeding work starts.
5. After approval, ask Codex to create the seed or migration file for that section only.
6. Repeat the section loop until the page is complete.
7. Run final refinement and verification for the page.

Important rules:

- Do not ask Codex to seed content before the related section implementation is approved.
- Do not ask Codex to manually assemble pages section-by-section in route files unless there is explicit route-level logic to add.
- Sections should render automatically through the existing page builder and block mapping.
- `ALLOWED_EDIT_PATHS` is optional for section implementation and recommended for token setup, seeding, and refinement.

## Standard Flow

### 1. One-Time Project Setup

Use this when starting a new design system or when the Figma tokens/fonts changed.

```text
Use the workflow in ai-docs/README.md.

PROJECT_FIGMA_URL: <figma file url with design system and all pages>
NEXT_ROUTE: /
SANITY_PAGE_TYPE: homePage
TOKEN_SOURCE_FILES:
- frontend/app/globals.css
- frontend/app/layout.tsx
ALLOWED_EDIT_PATHS:
- frontend/app/globals.css
- frontend/app/layout.tsx

Run the token extraction and font setup phases only.
Do not start section implementation yet.
Follow the existing repository rules exactly.
```

Expected outcome:

- Tailwind v4 tokens are mapped in `frontend/app/globals.css`
- fonts are configured in `frontend/app/layout.tsx` or the equivalent shared location

### 2. Start A Page

Use this when beginning a page implementation.

```text
Use the workflow in ai-docs/README.md.

PROJECT_FIGMA_URL: <same figma file url>
TARGET_PAGE_NODE_URL: <figma url for the full page>
NEXT_ROUTE: /
SANITY_PAGE_TYPE: homePage
Create `ai-docs/jobs/<page-slug>/job.md` from `ai-docs/jobs/_templates/page-job.md` and use that new file as the job file.

Do not create seed files until I approve each section.
Follow the existing repository rules exactly.
```

Expected outcome:

- Codex understands the target page, job scope, and current execution status
- the project now has a real job file instead of relying on template or example files

### 3. Implement One Section

Use this for one section at a time.

```text
Implement the Hero section only.

PROJECT_FIGMA_URL: <same figma file url>
TARGET_PAGE_NODE_URL: <page figma url>
TARGET_NODE_URL: <section figma url>
NEXT_ROUTE: /
SANITY_PAGE_TYPE: homePage
Use `ai-docs/jobs/<page-slug>/job.md` and `ai-docs/jobs/<page-slug>/sections/<section-name>.md` if it exists. Create the section note from `ai-docs/jobs/_templates/section-job.md` only when needed.

Follow the existing page builder mapping so the section renders automatically through BlockRenderer and PageBuilder.
You may create new schema files, React block files, and related wiring if needed.
Do not create the seed file yet.
Follow the existing repository rules exactly.
```

Expected outcome:

- schema changes are implemented if needed
- queries and types are updated
- React block components are created or updated
- block mapping is wired so the section renders automatically
- styling matches the Figma design as closely as possible

### 4. Approve And Seed That Section

Use this only after reviewing the implementation.

```text
The Hero section is approved.

Create the seed or migration file for this section only, using the approved Figma values.
Do not modify other sections.
Follow the existing repository rules exactly.
```

Expected outcome:

- a section-specific seed or migration file is created or updated
- only approved content values are seeded

### 5. Repeat For Every Section

Repeat this loop:

1. implement one section
2. review it
3. approve it
4. create the seed file for that section

### 6. Final Page Refinement

Use this after all required sections for the page are implemented and approved.

```text
All sections for this page are approved.

Run the final refine phase for the page.
Verify page builder rendering, Visual Editing wiring, lint, and type-check.
Do not add new features.
Follow the existing repository rules exactly.
```

Expected outcome:

- final token and spacing cleanup is complete
- page builder rendering is verified
- Visual Editing wiring is preserved
- lint and type-check pass

## Copy-Paste Templates

### Template A: Project Setup

```text
Use the workflow in ai-docs/README.md.

PROJECT_FIGMA_URL: <figma file url>
NEXT_ROUTE: <route>
SANITY_PAGE_TYPE: <homePage or page>
TOKEN_SOURCE_FILES:
- frontend/app/globals.css
- frontend/app/layout.tsx
ALLOWED_EDIT_PATHS:
- <allowed path 1>
- <allowed path 2>

Run the token extraction and font setup phases only.
Do not start section implementation yet.
Follow the existing repository rules exactly.
```

### Template B: Page Start

```text
Use the workflow in ai-docs/README.md.

PROJECT_FIGMA_URL: <figma file url>
TARGET_PAGE_NODE_URL: <page figma url>
NEXT_ROUTE: <route>
SANITY_PAGE_TYPE: <homePage or page>
Create `ai-docs/jobs/<page-slug>/job.md` from `ai-docs/jobs/_templates/page-job.md` and use it as the job file.

Do not create seed files until I approve each section.
Follow the existing repository rules exactly.
```

### Template C: Section Implementation

```text
Implement the <Section Name> section only.

PROJECT_FIGMA_URL: <figma file url>
TARGET_PAGE_NODE_URL: <page figma url>
TARGET_NODE_URL: <section figma url>
NEXT_ROUTE: <route>
SANITY_PAGE_TYPE: <homePage or page>
Use `ai-docs/jobs/<page-slug>/job.md` and `ai-docs/jobs/<page-slug>/sections/<section-name>.md` if it exists. Create the section note from `ai-docs/jobs/_templates/section-job.md` only when needed.

Follow the existing page builder mapping so the section renders automatically through BlockRenderer and PageBuilder.
You may create new schema files, React block files, and related wiring if needed.
Do not create the seed file yet.
Follow the existing repository rules exactly.
```

### Template D: Section Approval And Seeding

```text
The <Section Name> section is approved.

Create the seed or migration file for this section only, using the approved Figma values.
Do not modify other sections.
Follow the existing repository rules exactly.
```

### Template E: Final Refinement

```text
All sections for this page are approved.

Run the final refine phase for the page.
Verify page builder rendering, Visual Editing wiring, lint, and type-check.
Do not add new features.
Follow the existing repository rules exactly.
```

## Recommended Developer Habits

- Keep `ai-docs/jobs/<page-slug>/job.md` updated as the page progresses.
- Add a section note file only when a section needs extra implementation notes or approval tracking.
- Use `ai-docs/jobs/_examples/` as reference only, not as active project state.
- Use `ai-docs/jobs/_examples/migrations/` when you want sample seed script structure.
- Use `ALLOWED_EDIT_PATHS` when you want tighter control, especially for token setup, seeding, and refinement.
- Approve section implementation before asking for seeded content.
- Treat token setup as a project-wide task, not a per-section task.
