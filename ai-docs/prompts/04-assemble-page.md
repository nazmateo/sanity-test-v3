Purpose:
Assemble a complete Next.js App Router page from existing section/components.

Use the shared input contract from `references/input-contract.md`.

Task:
- Build or update `app/<route>/page.tsx` using available components.
- Match section order and hierarchy from `TARGET_NODE_URL`.
- Keep page composition readable and maintainable.

Rules:
- Do not recreate sections that already exist.
- Do not redefine design tokens.
- Keep page-level logic in page file and reusable UI in components.
- Respect `ANIMATION_NOTES` only at composition level (do not rewrite component internals unless required).
- Keep shared page/section types in separate importable files when reused across components or data layers.
- Preserve section identity and `data-sanity` path wiring during assembly so Visual Editing drag and drop still works after page composition.
- Confirm nested reorderable arrays still use the required object-wrapped array pattern after assembly.

Scope (DIFF-SAFE):
- You may only edit files listed in `ALLOWED_EDIT_PATHS`.

Required Output:
1. Page-level React component for App Router.
2. Import list of used components.
3. Missing components to create (list only).
4. Drag-and-drop verification notes for assembled sections.
