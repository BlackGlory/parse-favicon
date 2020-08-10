import 'core-js/es/string'
import { parseSpaceSeparatedSizes } from '@shared/parse-space-separated-sizes'
import { Icon } from '@types'

export function getSize(element: HTMLLinkElement): Icon['size'] {
  const sizes = element.getAttribute('sizes')
  if (sizes) {
    if (sizes === 'any') return 'any'
    const results = parseSpaceSeparatedSizes(sizes)
    if (results.length === 0) return undefined
    if (results.length === 1) return results[0]
    return results
  }
  return undefined
}

export function getHref(element: HTMLLinkElement): string | undefined {
  return element.getAttribute('href') || undefined
}

export function getType(element:  HTMLLinkElement): string | undefined {
  return element.getAttribute('type') || undefined
}

export function hasHref(element: HTMLLinkElement): boolean {
  return !!element.getAttribute('href')
}
