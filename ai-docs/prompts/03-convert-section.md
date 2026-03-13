Purpose:
Convert one Figma section/component into a reusable React component for a Next.js App Router codebase using existing tokens.

Use the shared input contract from `ai-docs/references/input-contract.md`.

Task:

- Convert `TARGET_NODE_URL` into a reusable section/component.
- Place output in `components/sections/` or `components/common/`.
- Follow semantic HTML and token-first Tailwind usage.

Rules:

- Use this layouting pattern section -> container -> rows -> row -> columns -> column -> contents
- contents can also include smaller sections
- Do not assemble full pages in this step.
- Do not invent or rename tokens.
- Avoid arbitrary values; use only when unavoidable and justify each one.
- MUST NOT use arbitrary values like: w-[...], h-[...], p-[...], gap-[...], text-[...], rounded-[...], inset-[...]
- Exception: If unavoidable, you may use AT MOST 3 arbitrary values TOTAL in the entire component.
- No inline styles.
- No runtime Figma asset URLs; use local assets only.
- Include interaction states from `ANIMATION_NOTES` when provided.
- Use Tailwind utility classes in JSX and consume shared values through existing/new tokens; do not rely on component-specific class selectors defined in `globals.css`.
- Keep shared non-trivial types in separate importable files when they are reused outside the component.
- Add correct `data-sanity` paths and preserve `_key`/identity fields required for Visual Editing drag and drop.
- If the section contains nested reorderable children, follow Sanity's nested array pattern by wrapping child arrays inside `object` types. Reference: https://www.sanity.io/docs/visual-editing/enabling-drag-and-drop
- Default nesting shape for this repo:
  - `pageBuilder[]` for sections
  - `cbColumns.columns[]` for row cells
  - `cbColumn.children[]` for vertically stacked content inside a cell
- If a row cell only contains one image/text atom, keep it as a direct single child of `cbColumn`; only use multiple children when the cell truly contains a vertical stack.
- Before moving to the next section, verify drag and drop works for this section and for any nested reorderable children it owns.

Responsive:

- Mobile-first.
- Use only `sm:`, `md:`, `lg:` unless project already defines additional breakpoints.

Scope (DIFF-SAFE):

- You may only edit files listed in `ALLOWED_EDIT_PATHS`.

Required Output:

1. Component code.
2. Props interface.
3. Responsive decisions.
4. Token usage summary.
5. Missing tokens (if any).
6. Manual assets needed (if any).
7. Arbitrary value justifications (if any).
8. Drag-and-drop verification notes, including nested array behavior when applicable.
