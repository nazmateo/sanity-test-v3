# Codex Project Context: `cbb-sanity-boilerplate`

Use this file as the default context whenever scaffolding a new project from this repository.

## 1. What This Repository Is

Monorepo starter for a **Sanity CMS + Next.js frontend** stack:

- `studio`: Sanity Studio (content modeling, editing, visual editing configuration)
- `frontend`: Next.js 16 App Router website consuming Sanity content
- root workspace scripts to run both together

Primary use-case: quickly launch marketing/content-driven sites with a composable page builder, i18n-ready routing, SEO fields, and Sanity Presentation Tool support.

## 2. Core Architecture

### Monorepo layout

- `package.json` (root): npm workspaces + shared scripts
- `studio/`: Sanity schema, structure, plugins, visual editing config
- `frontend/`: Next.js app, Sanity queries, renderers, route handling
- `sanity.schema.json`: extracted schema used by Sanity type generation

### Runtime flow

1. Editors create content in Sanity Studio.
2. Frontend fetches via `sanityFetch` (`frontend/sanity/lib/live.ts`) using `next-sanity` live API.
3. Page content is rendered by page builder components in `frontend/app/components`.
4. Draft Mode + Presentation Tool enables live preview/edit targeting via `data-sanity` attributes.

## 3. Key Features Already Implemented

- Next.js 16 + React 19 App Router
- Sanity Presentation Tool integration
- Draft mode endpoint: `frontend/app/api/draft-mode/enable/route.ts`
- Page builder blocks (`cb*`) with nested/composable structures
- I18n language model (`en`, `ae`) for `page`, `homePage`, `legalPage`
- SEO metadata composition + OG image handling + sitemap/robots generation
- Global Settings singleton with nav menus and script injection fields (GTM/GA/cookie)

## 4. Important Scripts

From repo root:

- `npm run dev`: runs Next.js + Studio in parallel
- `npm run lint`: lints frontend
- `npm run type-check`: type-checks workspaces
- `npm run import-sample-data`: imports `studio/sample-data.tar.gz`

Workspace specifics:

- `frontend` predev/prebuild run Sanity typegen
- `studio` predev also runs schema extract + typegen

## 5. Environment Variables

Copy `.env.example` values into:

- `frontend/.env.local`
- `studio/.env.local`

Required values:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`

Useful defaults:

- frontend: `NEXT_PUBLIC_SANITY_API_VERSION="2025-09-25"`
- studio preview URL: `SANITY_STUDIO_PREVIEW_URL="http://localhost:3000"`

## 6. Content Model Summary (Studio)

Main documents:

- `homePage` singleton (`studio/src/schemaTypes/singletons/homePage.ts`)
- `page` document (`studio/src/schemaTypes/documents/page.ts`)
- `legalPage` document with fixed slugs (`privacy-policy`, `terms-and-conditions`)
- `settings` singleton (`studio/src/schemaTypes/singletons/settings.tsx`)

Composable page builder block families:

- atoms: `cbHeading`, `cbParagraph`, `cbWysiwyg`, `cbHtml`, `cbImage`, `cbButton`
- containers: `cbButtons`, `cbColumns`, `cbGroup`, `cbList`, `cbNavigation`, `cbCover`

Schema registration entrypoint:

- `studio/src/schemaTypes/index.ts`

Custom Studio sidebar structure:

- `studio/src/structure/index.ts`

## 7. Frontend Rendering and Routing

Main pages:

- `frontend/app/page.tsx`: default-language home
- `frontend/app/[...segments]/page.tsx`: localized home/pages/legal routes

Route parsing logic:

- `frontend/app/lib/catch-all-route.ts`
- default language: `en`
- supported languages: `en`, `ae`

Page builder rendering:

- `frontend/app/components/PageBuilder.tsx`
- `frontend/app/components/BlockRenderer.tsx`

Sanity queries:

- `frontend/sanity/lib/queries.ts`

Sanity client/live fetch setup:

- `frontend/sanity/lib/client.ts`
- `frontend/sanity/lib/live.ts`
- `frontend/sanity/lib/api.ts`

## 7.1 Page Builder Nesting Rules

Use this page-builder shape as the default drag-and-drop-safe structure:

- top-level sections: `pageBuilder[]`
- horizontal row container: `cbColumns`
- row items / cells: `cbColumns.columns[]` using `cbColumn`
- stacked content inside a cell: `cbColumn.children[]`

Rules:

1. If a section needs sibling rows, represent each row as a separate `cbColumns` block in `pageBuilder[]` or inside another object-wrapped section container.
2. If a row cell needs multiple vertically stacked children, use `cbColumn.children[]`.
3. If a row cell only needs a single image, heading, paragraph, or similar atom, keep that atom as the single child inside the `cbColumn`; do not add an unnecessary extra wrapper.
4. Never place an array directly inside another array. Nested reorderable arrays must stay wrapped by object types so Visual Editing drag and drop can resolve paths correctly.
5. Drag and drop depends on stable `_key` values for array items and correct `data-sanity` paths for each nested array boundary.

## 8. How To Scaffold a New Project From This Repo

Use this sequence by default:

1. Configure env vars for a new Sanity project/dataset.
2. Start both apps with `npm run dev` and verify:
   - frontend: `http://localhost:3000`
   - studio: `http://localhost:3333`
3. Define/adjust brand and global settings in `settings` (title, description, logo, menus, SEO base).
4. Shape content model:
   - add/modify schema objects in `studio/src/schemaTypes/objects`
   - register in `studio/src/schemaTypes/index.ts`
   - update Studio structure if needed
5. Update frontend rendering:
   - extend GROQ projections in `frontend/sanity/lib/queries.ts`
   - add/update UI components in `frontend/app/components`
   - wire new block types in `BlockRenderer.tsx`
6. Re-run type generation and type-check:
   - `npm run type-check`
7. Validate metadata/sitemap behavior against real domain (`metadataBase` in settings OG image field).
8. Deploy:
   - Studio: `cd studio && npx sanity deploy`
   - Frontend: deploy `frontend` to Vercel (set root directory to `frontend`)

## 9. Rules for Future Codex Runs (Recommended)

When using this repository as a base, Codex should:

1. Read this file first.
2. For Figma-to-page work, also read `ai-docs/figma-mcp-page-implementation-plan.md` before implementation.
3. Preserve the workspace split (`frontend` + `studio`) unless user asks otherwise.
4. Keep query/schema/component changes synchronized (no schema-only changes without renderer/query updates).
5. Keep i18n route behavior intact unless explicitly changing supported locales.
6. Prefer extending existing page builder blocks over adding one-off page-specific hardcoded sections.
7. Maintain Draft Mode/Presentation compatibility (`data-sanity` paths and `sanityFetch` usage).
8. Keep shared TypeScript types in separate importable files; do not leave non-trivial shared interfaces/types embedded in page or section component files when they are reused across schema/query/component boundaries.
9. Use Tailwind utility classes in JSX for styling. `globals.css` should define tokens, theme variables, utilities, and resets only; avoid defining component-specific class selectors there and then consuming those selectors from JSX.
10. Add and use semantic design tokens as CSS variables first, then consume them through Tailwind classes instead of hardcoded values.
11. For Visual Editing drag and drop, every reorderable section and nested reorderable child array must preserve document identity data (`_id`, `_type`, `_key`) and correct `data-sanity` form paths.
12. When modeling nested reorderable content, keep Sanity's required array pattern: nested `array` fields must be wrapped inside an `object` type, following the default page-builder shape in section 7.1.
13. Treat drag and drop as a per-section acceptance gate: verify it works for the section being built before moving on to the next section.

## 10. High-Impact Files To Check Before Any Major Change

- Root:
  - `package.json`
  - `.env.example`
- Studio:
  - `studio/sanity.config.ts`
  - `studio/src/schemaTypes/index.ts`
  - `studio/src/structure/index.ts`
- Frontend:
  - `frontend/sanity/lib/queries.ts`
  - `frontend/sanity/lib/live.ts`
  - `frontend/app/[...segments]/page.tsx`
  - `frontend/app/components/BlockRenderer.tsx`
  - `frontend/app/layout.tsx`

## 11. Quick Health Check Commands

- `npm run dev`
- `npm run lint`
- `npm run type-check`

If content schema changed:

- run frontend/studio dev once to ensure typegen updated successfully.
