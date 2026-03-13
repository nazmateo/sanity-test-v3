---
name: figma-nextjs-page-workflow
description: "Convert Figma designs into production-ready Next.js (App Router) pages using a repeatable workflow: extract design tokens, set up fonts and Tailwind, convert sections/components, assemble pages, and refine output. Use when users want first-time project setup or ongoing page/section edits from Figma with consistent prompt inputs."
---

# Figma to Next.js Page Workflow

Execute this workflow for React/Next.js projects that use Tailwind and Figma MCP.

## Use Two Modes

1. Initial setup mode (first time per project)
   - Run token extraction, font setup, first section conversion, page assembly, and refinement.
2. Incremental mode (existing project with tokens already set)
   - Skip setup and run section conversion, page assembly, and refinement only.

## Shared Input Contract

Use the same input block in every prompt. See `references/input-contract.md`.

Required:
- `PROJECT_FIGMA_URL`: Figma project/file URL used as design source of truth.
- `TARGET_NODE_URL`: Specific frame/component URL for the current step.
- `NEXT_ROUTE`: App Router route segment (example: `/about`, `/products/[slug]`).
- `ANIMATION_NOTES`: Interaction and motion requirements (hover, focus, pressed, entrance).
- `TOKEN_SOURCE_FILES`: Existing token files in repo (example: `app/globals.css` with Tailwind v4 `@theme` tokens).
- `ALLOWED_EDIT_PATHS`: Explicit file allowlist for diff-safe execution in each step.

## App Router Rules

- Always target Next.js App Router (`app/`), not `pages/`.
- Keep page-level composition in `app/**/page.tsx`.
- Put reusable UI in `components/`.
- Keep token and global style setup aligned with `references/app-router-structure.md`.

## Prompt Assets

Use these prompt templates from `assets/prompts/`:

1. `01-extract-tokens.md`
2. `02-setup-fonts.md`
3. `03-convert-section.md`
4. `04-assemble-page.md`
5. `05-refine-page.md`

## Execution Order

Initial setup:
1. `01-extract-tokens.md`
2. `02-setup-fonts.md`
3. `03-convert-section.md` (repeat per section)
4. `04-assemble-page.md`
5. `05-refine-page.md`

Incremental edits:
1. `03-convert-section.md` (repeat per new/updated section)
2. `04-assemble-page.md`
3. `05-refine-page.md`

## Quality Gates

- Do not invent design tokens.
- Prefer existing token classes for color and typography.
- Keep edits diff-safe and scoped to the requested files.
- Keep component semantics correct (`button`, `a`, `nav`, list structures).
- Preserve existing behavior and APIs when refining.
