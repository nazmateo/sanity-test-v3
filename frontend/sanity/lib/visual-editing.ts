import {dataAttr} from '@/sanity/lib/utils'

export type SanityPathContext = {
  id: string
  type: string
}

export function toArrayItemPath(arrayPath: string, key: string | undefined, index: number): string {
  if (key) {
    return `${arrayPath}[_key=="${key}"]`
  }

  return `${arrayPath}[${index}]`
}

export function getSanityDataAttribute(
  enabled: boolean,
  context: SanityPathContext,
  path?: string,
): string | undefined {
  if (!enabled) {
    return undefined
  }

  if (!path || !path.trim()) {
    return undefined
  }

  return dataAttr({
    ...context,
    path,
  }).toString()
}
