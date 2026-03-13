# Homepage Hero

## Inputs

```md
SECTION_NAME: Hero
PAGE_SLUG: /
TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-1000&m=dev
STATUS: implemented-awaiting-review
APPROVAL_STATE: draft
```

## Section Notes

```md
Purpose: Homepage hero with background media, intro copy, animated phrase stack, and a scroll CTA.
Animation notes: Hero phrases reveal from right to left with staggered fade timing.
Modeling notes: Ignore the Figma menu node because the site header already exists outside the section.
Schema notes: Use a reusable hero section schema with background media, heading, paragraph, phrase items, and CTA content.
Seeding notes: Do not create the seed script until implementation approval.
```

## Implementation Notes

```md
- Added reusable `heroSection` schema object for page builder usage.
- Added `heroPhrase` object for the animated phrase list.
- Added homepage and frontend support to query, type, and render the section.
- Background media supports image or video through existing `cbMedia`.
- Hero content follows the required nested array shape: `rows[] -> columns[] -> children[]`.
- Primary button uses existing `cbButton` plus `cbLink` inside `cbColumn.children[]`.
- Animated phrases use `heroPhrase` items inside `cbColumn.children[]` so they stay reorderable.
- Phrase animation is CSS-driven with three staggered theme animations.
- Homepage route wrapper was removed so the hero can be the real first section.
```
