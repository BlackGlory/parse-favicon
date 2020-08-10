import { query, css } from '@blackglory/query'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
import 'core-js/es/string'
import { parseSpaceSeparatedSizes } from '@shared/parse-space-separated-sizes'
import { Icon } from '@src/types'

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

export function getIcons(document: Document, selector: string, reference: string) {
  const nodes = query.call(document, css`${selector}`) as HTMLLinkElement[]
  return new IterableOperator(nodes)
    .filter(hasHref)
    .map(x => createIcon(reference, getHref(x)!, getType(x), getSize(x)))
    .toArray()
}

function createIcon(reference: string, url: string, type?: string, size?: Icon['size']): Icon {
  return { reference, url, type, size }
}
