import {defineField, defineType} from 'sanity'

type PathSegment = unknown

function isKeySegment(segment: unknown): segment is {_key: string} {
  return !!segment && typeof segment === 'object' && '_key' in segment && typeof (segment as {_key?: unknown})._key === 'string'
}

function resolveArraySegment(segment: unknown): number | {_key: string} | undefined {
  if (typeof segment === 'number') return segment
  if (isKeySegment(segment)) return segment

  if (Array.isArray(segment)) {
    const keyed = segment.find((item) => isKeySegment(item))
    if (isKeySegment(keyed)) return keyed

    const indexed = segment.find((item) => typeof item === 'number')
    if (typeof indexed === 'number') return indexed
  }

  return undefined
}

function getAtPath(source: unknown, path: PathSegment[]): unknown {
  let current: unknown = source

  for (const segment of path) {
    if (current == null) return undefined

    if (Array.isArray(current)) {
      const resolved = resolveArraySegment(segment)
      if (typeof resolved === 'number') {
        current = current[resolved]
        continue
      }
      if (resolved && typeof resolved === 'object' && resolved._key) {
        current = current.find(
          (item) => item && typeof item === 'object' && (item as {_key?: string})._key === resolved._key,
        )
        continue
      }
      return undefined
    }

    if (typeof current === 'object' && typeof segment === 'string') {
      current = (current as Record<string, unknown>)[segment]
      continue
    }

    return undefined
  }

  return current
}

function isHiddenByButtonAction(context: {document?: unknown; path?: ReadonlyArray<unknown>}): boolean {
  const path = [...(context.path || [])]
  let linkFieldIndex = -1
  for (let i = path.length - 1; i >= 0; i -= 1) {
    if (path[i] === 'link') {
      linkFieldIndex = i
      break
    }
  }
  if (linkFieldIndex < 0) return false

  const buttonPath = path.slice(0, linkFieldIndex)
  const buttonValue = getAtPath(context.document, buttonPath) as {actionType?: string} | undefined
  return !!buttonValue?.actionType && buttonValue.actionType !== 'link'
}

export default defineType({
  name: 'cbLink',
  title: 'Content Link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'external',
      options: {
        list: [
          {title: 'External', value: 'external'},
          {title: 'Internal', value: 'internal'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (isHiddenByButtonAction(context)) return true
          const parent = context.parent as {linkType?: string} | undefined
          if (parent?.linkType === 'external' && !value) {
            return 'External URL is required when Link Type is External'
          }
          return true
        }),
    }),
    defineField({
      name: 'internalTargetType',
      title: 'Internal Target',
      type: 'string',
      initialValue: 'page',
      options: {
        list: [
          {title: 'Select Page', value: 'page'},
          {title: 'Custom Path', value: 'path'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'internalPage',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}],
      hidden: ({parent}) =>
        parent?.linkType !== 'internal' || (parent?.internalTargetType && parent?.internalTargetType !== 'page'),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (isHiddenByButtonAction(context)) return true
          const parent = context.parent as {linkType?: string; internalTargetType?: string} | undefined
          if (
            parent?.linkType === 'internal' &&
            (parent?.internalTargetType === 'page' || parent?.internalTargetType == null) &&
            !value
          ) {
            return 'Page is required when Internal Target is Select Page'
          }
          return true
        }),
    }),
    defineField({
      name: 'internalPath',
      title: 'Internal Path',
      description: 'Examples: /about, /contact, /services',
      type: 'string',
      hidden: ({parent}) => parent?.linkType !== 'internal' || parent?.internalTargetType !== 'path',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (isHiddenByButtonAction(context)) return true
          const parent = context.parent as {linkType?: string; internalTargetType?: string} | undefined
          if (parent?.linkType === 'internal' && parent?.internalTargetType === 'path' && !value) {
            return 'Internal Path is required when Link Type is Internal'
          }
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
  ],
})
