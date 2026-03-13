# Homepage Hero

## Context

- PAGE: homepage
- SECTION: Hero
- STATUS: implemented-awaiting-review
- FIGMA NODE: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-1000&m=dev

## Scope

- Added reusable `heroSection` schema object for page builder usage.
- Added `heroPhrase` object for the animated phrase list.
- Added homepage/frontend support to query, type, and render the section.
- Did not create the seed script yet.

## Notes

- Background media supports image or video through existing `cbMedia`.
- Hero content now follows the required nested array shape: `rows[] -> columns[] -> children[]`.
- Primary button uses existing `cbButton` plus `cbLink` inside `cbColumn.children[]`.
- Animated phrases use `heroPhrase` items inside `cbColumn.children[]` so they stay reorderable.
- Phrase animation is CSS-driven with three staggered theme animations.
- Homepage route wrapper was removed so the hero can be the real first section.
