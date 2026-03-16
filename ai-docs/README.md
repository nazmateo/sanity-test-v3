# Codex Execution Guide

This file is for Codex. It is the canonical execution guide Codex should follow for the Figma-to-Sanity-to-Next.js workflow used in this repository.

## Purpose

Keep Codex execution instructions in one place, keep reusable rules in shared references, and keep job files limited to page-specific or section-specific data.

## Directory Layout

- `ai-docs/README.md`: the Codex-only execution guide
- `ai-docs/references/input-contract.md`: canonical input fields for every run
- `ai-docs/references/repo-context.md`: stable repository architecture and implementation context
- `ai-docs/references/execution-rules.md`: non-negotiable execution and quality rules
- `ai-docs/prompts/*.md`: phase prompts used during execution
- `ai-docs/jobs/_templates/*.md`: reusable job templates for boilerplate use
- `ai-docs/jobs/_examples/**`: example job files and section notes for reference only
- `ai-docs/jobs/shared/migrations/*.mjs`: shared migration or seeding scripts
- `ai-docs/jobs/_examples/migrations/*.mjs`: example migration or seeding scripts for reference only

## Codex Workflow

1. Provide the Figma file URL that contains the design system and all target pages.
2. Codex extracts design tokens, maps them into Tailwind v4 `@theme` variables, and sets up fonts from Figma once per project.
3. Provide the Figma URL for the target page.
4. Provide the Figma URL for one target section on that page.
5. Codex implements or extends the Sanity schema, GROQ queries, generated types, React renderers, and page builder mapping needed for that section while matching the Figma design as closely as possible and reusing the existing page-builder model first.
6. Review the implementation.
7. After approval, Codex creates or updates the seed or migration file that fills the related schema fields using Figma-derived values.
8. Repeat steps 4 through 7 until the page is complete.
9. After all sections are approved, Codex performs final refinement and runs the lint and type-check gates. Section rendering should already flow through the existing page builder mapping.

## Approval Gates

- Token and font setup is approved once per project unless the Figma system changes.
- Each section is approved before its seed file is created.
- Page routes should stay thin. Approved sections should appear through the existing page builder and block mapping instead of manual page-specific assembly.

## Standard Load Order

For any execution run, Codex should load only this context unless the current task requires more:

1. `ai-docs/README.md`
2. `ai-docs/references/input-contract.md`
3. `ai-docs/references/repo-context.md`
4. `ai-docs/references/execution-rules.md`
5. `ai-docs/jobs/<page-slug>/job.md`
6. `ai-docs/jobs/<page-slug>/sections/<section-name>.md` only if the current section has extra notes
7. The single prompt file for the current phase

If a real job file does not exist yet, start from `ai-docs/jobs/_templates/page-job.md` and create one for the project.

Use `ai-docs/jobs/_examples/` only as reference material. Do not treat example files as active project state.

Do not read unrelated job files, templates, or completed section notes unless the current task depends on them.

## Prompt Usage

- `ai-docs/prompts/01-extract-tokens.md`: initial token extraction and normalization
- `ai-docs/prompts/02-setup-fonts.md`: font loading and font token wiring
- `ai-docs/prompts/03-convert-section.md`: one section at a time
- `ai-docs/prompts/05-refine-page.md`: minimal-diff polish and QA fixes

## Operating Rules

- Reuse existing schema objects, page-builder blocks, tokens, and React primitives first.
- Only add new schema objects or components when the current system cannot represent the design cleanly.
- Keep schema, query, types, renderer, and route changes synchronized in the same change set.
- Keep page rendering CMS-driven through the existing page builder mapping instead of adding separate manual page assembly steps unless the task explicitly requires route-level logic.
- Preserve Sanity Visual Editing requirements, including `_key`, identity data, and correct `data-sanity` paths.
- When section content must be draggable or reorderable in Presentation Tool, model it as `rows[]` on the section, where each row is an object that owns a `content[]` array. Do not skip the row layer for custom sections.
- Inside a section row, use `content[]` for all draggable content items. Keep only non-draggable section data such as background media, background video, or other fixed section-level configuration as standalone fields on the section object itself.
- When a section needs nested CMS-managed content, allow only composable page-builder blocks inside the row `content[]` array. Do not allow nested section block types inside another section.
- Reusable custom controls such as sitewide styled buttons should be modeled as standalone composable object types so they can be inserted anywhere composable blocks are allowed.
- If a draggable item needs extra descriptors such as variant, size, animation settings, or layout metadata, wrap the reusable content block in a dedicated object schema and store those descriptor fields on that wrapper object.
- Use object-wrapped nested arrays when a reorderable array must exist inside another array.
- Keep Tailwind styling token-first. Add semantic tokens in `frontend/app/globals.css` and consume them through Tailwind utilities in JSX.
- Keep shared non-trivial TypeScript types in importable files instead of duplicating them inline.
- Treat `ALLOWED_EDIT_PATHS` as optional for section implementation and recommended for token setup, seeding, and refinement work.
- Seed scripts are created only after implementation approval for the relevant section.

## Completion Criteria

A page is done only when all of the following are true:

- Every approved Figma section is implemented as CMS-driven content.
- Tokens and fonts are wired without unnecessary hardcoded values.
- Schema, query, types, components, and page builder mapping are aligned.
- Seed or migration scripts exist for approved content where required.
- Visual Editing drag and drop still works for sections and nested reorderable content.
- `npm run lint` and `npm run type-check` pass.
