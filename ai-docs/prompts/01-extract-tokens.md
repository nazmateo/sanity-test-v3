Purpose:
Extract and normalize global design tokens from Figma into Tailwind theme extensions for a Next.js App Router project.

Use the shared input contract from `references/input-contract.md`.

Task:
- Read global Variables and Styles from `PROJECT_FIGMA_URL`.
- Focus on primitives only: colors, typography, spacing, radii, shadows, breakpoints (only if explicit).
- Map tokens into Tailwind v4 `@theme` variables in `app/globals.css` without inventing values.

Rules:
- Variables override styles when conflicts exist.
- Do not analyze components or states in this step.
- Do not invent missing scale steps.
- Do not overwrite Tailwind defaults unnecessarily.
- Add tokens as CSS variables/theme values, not as reusable component class selectors in `globals.css`.
- Token output must be consumable from JSX through Tailwind utility classes.

Scope (DIFF-SAFE):
- You may only edit files listed in `ALLOWED_EDIT_PATHS`.

Required Output:
1. Updated token config code.
2. Inconsistencies and ambiguities with evidence.
3. Optional cleanup suggestions (no automatic token changes).
