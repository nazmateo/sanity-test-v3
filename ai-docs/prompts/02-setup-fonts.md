Purpose:
Set up project fonts for Next.js App Router + Tailwind using extracted design tokens.

Use the shared input contract from `references/input-contract.md`.

Task:
- Configure font loading and ensure tokenized font families resolve at runtime.
- Keep setup production-safe and minimal.

Rules:
- Use only font families already defined in tokens.
- Do not invent new fonts.
- Use `next/font` when possible; otherwise use standards-based CSS loading.
- Keep App Router conventions.
- Expose font families through CSS variables/theme tokens and consume them through Tailwind classes in JSX instead of component-specific global class selectors.

Scope (DIFF-SAFE):
- You may only edit files listed in `ALLOWED_EDIT_PATHS`.
- Typical files: `app/layout.tsx`, `app/globals.css`.

Required Output:
1. Exact code changes.
2. Where fonts load and how font tokens are consumed.
3. Available font weights/styles detected.
