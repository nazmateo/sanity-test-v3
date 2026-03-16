# Execution Rules

These rules apply to every Figma-to-page implementation run in this repository.

## Global Rules

- Read only the minimal required context listed in `ai-docs/README.md`.
- Reuse existing schema objects, page-builder blocks, queries, and React primitives first.
- Keep schema, query, type, renderer, and route changes synchronized.
- Keep page routes thin and rely on the CMS-driven page builder mapping for section output unless explicit route-level logic is required.
- Preserve locale behavior unless the task explicitly changes it.
- Preserve Draft Mode, Presentation Tool, and Visual Editing compatibility.
- Keep shared non-trivial TypeScript types in separate importable files.

## Token And Font Rules

- Extract tokens from Figma variables and styles without inventing values.
- Prefer existing semantic tokens before creating new ones.
- Keep Tailwind v4 token work in `frontend/app/globals.css` via `@theme`.
- Do not create component-specific global selector classes in `globals.css`.
- Use `next/font` when possible and expose fonts through CSS variables and theme tokens.

## Section Implementation Rules

- Convert one section at a time.
- Match Figma structure using the repository nesting model:
  - section
  - container
  - rows
  - row
  - columns
  - column
  - contents
- Use semantic HTML and accessible heading, landmark, link, and button structure.
- Avoid arbitrary values unless truly unavoidable and justify each one.
- Use local assets only, not runtime Figma asset URLs.

## Sanity Modeling Rules

- Compose with the existing `cb*` block system first.
- Add a new schema object only when the current block system cannot represent the section clearly.
- Keep fields minimal but expressive.
- When a section owns draggable content in Presentation Tool, model that content as `rows[]` on the section. Each row must be an object that contains a `content[]` array so drag and drop targets stable array members at both row and content levels.
- Keep only non-draggable section-level data such as background images, background videos, or fixed configuration on direct section object fields. Do not mix those fixed fields into the draggable row content unless the media itself must be draggable.
- When a section exposes nested dynamic CMS content, use the existing composable `cb*` block family and other approved reusable object blocks only inside the row `content[]` arrays. Do not permit section types inside section-owned nested content arrays.
- Sitewide styled controls that should be reusable in multiple sections must be modeled as standalone composable object types and rendered through the shared block mapping.
- If a draggable content item needs extra descriptors such as variant, size, animation, or layout metadata, create a wrapper object schema for that item and store those descriptor fields on the wrapper object.
- When a section has nested reorderable children, wrap child arrays inside object types.
- Preserve `_key` and related identity fields for reorderable array members.

## Query And Type Rules

- Update GROQ projections for every new or changed field in the same change set.
- Keep link resolution patterns consistent with the existing implementation.
- Include identity fields needed by Visual Editing.
- Register new or updated block types in the renderer and related page builder mapping so sections appear automatically on the target page.

## Page Mapping Rules

- Do not recreate sections that already exist.
- Keep page-level logic in route files and reusable UI in components.
- Preserve section identity and `data-sanity` wiring through the page builder mapping.
- Confirm nested reorderable structures still follow the object-wrapped array pattern once rendered on the page.

## Approval And Seeding Rules

- Do not create seed or migration files before the related implementation is approved.
- Seed values should come from approved Figma-derived content decisions.
- Create seeding work incrementally per approved section or shared singleton as needed.

## Quality Gates

Every completed page or section must pass:

1. Desktop and mobile visual review
2. Keyboard and focus-state review
3. Alt text and heading hierarchy review
4. Visual Editing drag-and-drop verification for the implemented scope
5. `npm run lint`
6. `npm run type-check`
