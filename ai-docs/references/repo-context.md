# Repository Context

Use this file as the stable technical context for this repository.

## What This Repository Is

Monorepo starter for a Sanity CMS plus Next.js frontend stack:

- `studio`: Sanity Studio for content modeling, editing, and Visual Editing configuration
- `frontend`: Next.js 16 App Router website that consumes Sanity content
- root workspace scripts to run both together

## Core Architecture

### Monorepo layout

- `package.json`: npm workspaces and shared scripts
- `studio/`: schema, structure, plugins, and visual editing config
- `frontend/`: App Router site, Sanity queries, route handling, and renderers
- `sanity.schema.json`: extracted schema used by Sanity type generation

### Runtime flow

1. Editors create content in Sanity Studio.
2. Frontend fetches content through `frontend/sanity/lib/live.ts`.
3. Page content is rendered by components in `frontend/app/components`.
4. Draft Mode and Presentation Tool rely on `data-sanity` wiring for live preview and editing.

## Existing Stack

- Next.js 16
- React 19
- Tailwind CSS v4
- Sanity Studio
- next-sanity live API
- Presentation Tool and Draft Mode integration

## Important Scripts

From the repo root:

- `npm run dev`
- `npm run lint`
- `npm run type-check`
- `npm run import-sample-data`

## Environment

Copy `.env.example` values into:

- `frontend/.env.local`
- `studio/.env.local`

## Content Model Summary

Main documents:

- `homePage`
- `page`
- `legalPage`
- `settings`

Composable block families:

- atoms: `cbHeading`, `cbParagraph`, `cbWysiwyg`, `cbHtml`, `cbImage`, `cbButton`
- containers: `cbButtons`, `cbColumns`, `cbGroup`, `cbList`, `cbNavigation`, `cbCover`

## Routing And Rendering

Main routes:

- `frontend/app/page.tsx`
- `frontend/app/[...segments]/page.tsx`

Important implementation files:

- `frontend/sanity/lib/queries.ts`
- `frontend/sanity/lib/live.ts`
- `frontend/app/components/BlockRenderer.tsx`
- `frontend/app/layout.tsx`

## Page Builder Nesting Rules

- Top-level sections live in `pageBuilder[]`
- Horizontal rows use `cbColumns`
- Row cells use `cbColumns.columns[]` with `cbColumn`
- Vertically stacked content inside a cell uses `cbColumn.children[]`

Required constraints:

1. Never place an array directly inside another array.
2. Wrap nested reorderable arrays inside object types.
3. Preserve `_key`, `_id`, and `_type` where needed for Visual Editing.
4. Keep drag-and-drop-safe `data-sanity` paths at every reorderable boundary.

## High-Impact Files

- `studio/src/schemaTypes/index.ts`
- `studio/src/structure/index.ts`
- `frontend/sanity/lib/queries.ts`
- `frontend/app/[...segments]/page.tsx`
- `frontend/app/components/BlockRenderer.tsx`
- `frontend/app/layout.tsx`
