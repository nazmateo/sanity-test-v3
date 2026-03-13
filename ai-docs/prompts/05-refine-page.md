Purpose:
Refine generated section/page code to align with tokens, typography, responsiveness, and interaction requirements.

Use the shared input contract from `ai-docs/references/input-contract.md`.

Task:
- Polish existing code with minimal diffs.
- Keep behavior and public APIs stable.
- Align spacing, typography, and color usage with token files.
- Apply `ANIMATION_NOTES` where missing and required.

Rules:
- Do not rewrite from scratch.
- Do not add new design tokens.
- Do not introduce external animation libraries unless explicitly requested.
- Keep App Router architecture intact.
- Keep styling token-first: prefer CSS variables/theme tokens consumed via Tailwind classes in JSX over component-specific global selectors.
- Keep shared non-trivial types in separate importable files if refinement introduces or touches reused types.
- Re-check `data-sanity` paths, identity fields, and nested object-wrapped array structures needed for Visual Editing drag and drop.
- Do not consider the page refined until drag and drop works for each implemented section before moving on.

Scope (DIFF-SAFE):
- You may only edit files listed in `ALLOWED_EDIT_PATHS`.

Required Output:
1. Updated code.
2. Summary of changes by category.
3. Remaining manual-review items (if any).
4. Drag-and-drop regression check notes.
