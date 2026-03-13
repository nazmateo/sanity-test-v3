# Figma MCP to Page Implementation Plan

Planning-only document for Codex execution.

## Goal

Create a repeatable Codex workflow to:

1. Connect to Figma MCP.
2. Build a page from Figma sections.
3. Model/extend Sanity schema using existing composable atoms/containers in this repo.
4. Implement frontend UI using existing React block components.
5. Match design tokens from Figma to frontend tokens/styles.

## Primary Inputs (Required Each Run)

- `PROJECT_FIGMA_URL`
- `TARGET_PAGE_NODE_URL`
- `NEXT_ROUTE` (example: `/about`, `/services`)
- `SANITY_PAGE_TYPE` (`homePage` or `page`)
- `ALLOWED_EDIT_PATHS`

Optional:

- animation notes per section
- section priority (MVP vs phase 2)

## Prompt Library

Use these prompt files when executing the matching phases below:

- `ai-docs/prompts/01-extract-tokens.md`: global token extraction and normalization
- `ai-docs/prompts/02-setup-fonts.md`: font setup after token extraction
- `ai-docs/prompts/03-convert-section.md`: single-section / single-component conversion
- `ai-docs/prompts/04-assemble-page.md`: page-level route assembly from existing sections
- `ai-docs/prompts/05-refine-page.md`: final polish and minimal-diff refinement

## Phase 0: Preflight and Context Load

1. Read these files first:
   - `ai-docs/codex-project-context.md`
   - `ai-docs/figma-mcp-page-implementation-plan.md`
   - relevant prompt files in `ai-docs/prompts` for the phases being executed
2. Validate local project health:
   - `npm run type-check`
   - if needed, `npm run dev`
3. Confirm env is present (`frontend/.env.local`, `studio/.env.local`).

Exit criteria:

- Codex understands current schema/query/render pipeline before changing files.

## Phase 1: Connect and Inspect Figma via MCP

1. Verify Figma MCP auth/session (`whoami` or equivalent MCP check).
2. Read page/frame structure (metadata / node hierarchy).
3. For each major section node:
   - extract structure (layout, hierarchy, text, media, CTA behavior)
   - extract design tokens (color, typography, spacing, radius, shadows, motion hints)
   - Use this layouting pattern, use reusable schema objects and react blocks already defined in the repository (section -> container -> rows -> row -> columns -> column -> contents)
   - contents can also include smaller sections
4. Produce a section inventory artifact:
   - `Section ID`
   - `Section Name`
   - `Candidate Schema Block Type`
   - `Required New Fields`
   - `Required New/Updated React Component`

Exit criteria:

- Full section map exists with no missing major UI block.

## Phase 2: Token Mapping Strategy (Figma -> Frontend)

Target files:

- `frontend/app/globals.css` (`@theme` tokens)

Rules:

1. Reuse existing semantic tokens first.
2. Add new tokens only when no equivalent exists.
3. Keep token names semantic (avoid raw figma names like `Blue/500`).
4. Preserve typography/font setup via `next/font` + CSS variables.
5. Define motion tokens only for meaningful interactions (not decorative noise).
6. Prefer CSS variables and Tailwind-consumable theme tokens over component-specific classes in `globals.css`.
7. Consume tokens in JSX through Tailwind utility classes; do not create component styling as global selector names and then use those selector names in JSX.
8. Tailwind v4 in this repo is CSS-first. Define tokens in `frontend/app/globals.css` via `@theme`; do not add or rely on `tailwind.config.ts`.

Prompt reference:

- Use `ai-docs/prompts/01-extract-tokens.md` for token extraction and normalization.
- Use `ai-docs/prompts/02-setup-fonts.md` when applying extracted font families in Next.js/Tailwind.

Deliverable:

- Token mapping table: `Figma token -> CSS variable/Tailwind token -> usage locations`

Exit criteria:

- No hardcoded one-off colors/spacing in section components when tokenized alternative exists.

## Phase 3: Schema Planning and Studio Modeling

Target area:

- `studio/src/schemaTypes/objects/*`
- `studio/src/schemaTypes/objects/pageBuilderBlockTypes.ts`
- `studio/src/schemaTypes/index.ts`
- optional previews/thumbnails in `studio/static/page-builder-thumbnails`

Rules:

1. Compose with existing block system (`cb*` atoms/containers) first.
2. Only add new schema object when the section cannot be represented clearly with existing blocks.
3. Keep fields minimal but expressive:
   - content
   - media
   - links/actions
   - theme/variant (only if needed)
4. Keep localization compatibility (`language` behavior on documents remains intact).
5. If adding new block types:
   - register in page builder allowed block arrays
   - ensure strong validation and sensible defaults
6. If a section contains reorderable nested children, model them with Sanity-compatible nested arrays by wrapping child arrays inside `object` types instead of placing arrays directly inside arrays.
7. Keep `_key` and other required identity fields available on nested array members so Visual Editing drag and drop can track them correctly.
8. Default implementation shape:
   - `pageBuilder[]` for top-level sections
   - `cbColumns.columns[]` for row cells
   - `cbColumn.children[]` for vertically stacked content inside a cell
9. If a row cell contains only a single image/text atom, keep that atom as the only child in the `cbColumn` instead of adding another unnecessary wrapper layer.

Prompt reference:

- Use `ai-docs/prompts/03-convert-section.md` while planning each section's reusable structure so schema modeling stays aligned with the section conversion strategy.

Exit criteria:

- Studio can represent every section from Figma without ad hoc JSON blobs.
- Studio modeling supports Visual Editing drag and drop for section-level and nested reorderable content.

## Phase 4: Query, Types, and Data Flow Updates

Target area:

- `frontend/sanity/lib/queries.ts`
- `frontend/sanity/lib/types.ts`
- generated types (`sanity typegen`)

Rules:

1. Update GROQ projections for any new/changed block fields.
2. Keep link resolution strategy consistent (`internalPageSlug` projection pattern).
3. Keep schema/query/types synchronized in the same change set.
4. Keep reusable TypeScript types in separate importable files instead of duplicating non-trivial shared types inline across page files, renderers, and section components.
5. Include `_key`, `_type`, and any required identity fields in projections for reorderable arrays used by Visual Editing.

Exit criteria:

- Frontend receives complete typed data for all new/updated sections.

## Phase 5: Frontend Component Implementation

Target area:

- `frontend/app/components/BlockRenderer.tsx`
- existing atoms/molecules/organisms under `frontend/app/components`

Rules:

1. Reuse existing primitives and section patterns first.
2. Prefer composition over boolean-prop growth.
3. Keep semantic HTML and accessible structure:
   - real headings
   - landmark/nav usage where appropriate
   - keyboard/focus-visible states
4. Keep draft-mode compatibility (`data-sanity` path attributes for editable blocks).
5. Keep Next.js best practices:
   - server/client boundaries explicit
   - metadata behavior unchanged unless intentionally updated
6. Use Tailwind utility classes in JSX and consume shared values through tokens; avoid introducing component-specific global class selectors in `globals.css`.
7. Ensure section wrappers and nested reorderable children carry correct `data-sanity` paths and identity data so drag and drop works inside sections, not only at the top level.

Prompt reference:

- Use `ai-docs/prompts/03-convert-section.md` for each individual Figma section/component implementation.

Exit criteria:

- Each mapped section renders from CMS content and supports editor workflows.
- Drag and drop is verified for the implemented section before starting the next section.

## Phase 6: Route Assembly and Page Delivery

1. Assemble sections into target page route (`app/page.tsx` or `app/[...segments]/page.tsx` path behavior).
2. Verify localized route behavior if page is translated.
3. Confirm SEO fields and structured data handling still work for the page type.
4. Verify section ordering and nested child ordering remain editable through Visual Editing after assembly.

Prompt reference:

- Use `ai-docs/prompts/04-assemble-page.md` when composing the final route from implemented sections/components.

Exit criteria:

- Final route is CMS-driven and matches Figma structure with acceptable fidelity.

## Phase 7: QA Gates (Must Pass)

1. Visual parity:
   - desktop + mobile layout
   - spacing and typography alignment
2. Accessibility:
   - keyboard navigation
   - visible focus
   - alt text coverage for meaningful images
   - heading hierarchy sanity
3. Integration:
   - Studio edit -> frontend update path works
   - draft mode/presentation remains functional
   - drag and drop works for the current section before moving on to the next one
   - nested child arrays inside sections can be reordered when the schema uses the required object-wrapped array pattern
4. Technical:
   - `npm run lint`
   - `npm run type-check`

Prompt reference:

- Use `ai-docs/prompts/05-refine-page.md` before or during QA cleanup to make minimal-diff refinements for tokens, typography, responsiveness, and interaction details.

## Phase 8: Definition of Done

Done means all are true:

1. Figma sections are mapped and implemented as CMS-driven page blocks.
2. Tokens are matched in frontend styles (no excessive hardcoded values).
3. New schema/query/types/components are synchronized.
4. Route renders correctly across supported locales (where applicable).
5. Lint/type-check pass.
6. Documentation updated (this file + `codex-project-context.md` if architecture changed).
7. Visual Editing drag and drop works for all implemented sections and supported nested reorderable content.

## Standard Execution Checklist for Codex

- [ ] Read context docs in `ai-docs`
- [ ] Connect to Figma MCP and inspect target nodes
- [ ] Produce section inventory and token map
- [ ] Use `ai-docs/prompts/01-extract-tokens.md` for token extraction
- [ ] Use `ai-docs/prompts/02-setup-fonts.md` for font setup when needed
- [ ] Implement/extend Studio schema via existing block architecture
- [ ] Use `ai-docs/prompts/03-convert-section.md` for per-section implementation
- [ ] Preserve `_key`/identity fields and `data-sanity` paths required for Visual Editing drag and drop
- [ ] Use object-wrapped nested arrays when drag-and-drop children exist inside arrays
- [ ] Update queries + types
- [ ] Keep shared types in separate importable files
- [ ] Keep Tailwind v4 token work in `app/globals.css` via `@theme`, not `tailwind.config.ts`
- [ ] Implement block renderer/component changes
- [ ] Use `ai-docs/prompts/04-assemble-page.md` for route assembly
- [ ] Validate draft mode + metadata behavior
- [ ] Verify drag and drop works for the current section before proceeding to the next section
- [ ] Use `ai-docs/prompts/05-refine-page.md` for final minimal-diff refinement
- [ ] Run lint/type-check
- [ ] Summarize delivered sections, new blocks, and token mappings

## Internet-Validated References

- Figma Dev Mode MCP server docs: https://help.figma.com/hc/en-us/articles/32132100833559-Use-Dev-Mode-MCP-Server
- Figma plugin + MCP overview: https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server/
- Sanity schema type docs: https://www.sanity.io/docs/schema-types
- Sanity array type docs (for page-builder block arrays): https://www.sanity.io/docs/studio/array-type
- Sanity Presentation resolver API docs: https://www.sanity.io/docs/visual-editing/presentation-resolver-api
- Sanity Visual Editing drag and drop docs: https://www.sanity.io/docs/visual-editing/enabling-drag-and-drop
- Next.js App Router docs: https://nextjs.org/docs/app
- Next.js metadata API docs: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Tailwind theme variable docs (`@theme`): https://tailwindcss.com/docs/theme
