import { queryAll, css } from '@blackglory/query'
import { filter, map, toArray } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { parseSpaceSeparatedSizes } from '@utils/parse-space-separated-sizes.js'
import { Icon } from '@src/types.js'

export function getIcons(
  document: Document
, linkElementSelector: string
, reference: string
): Icon[] {
  const nodes = queryAll.call(document, css`${linkElementSelector}`) as HTMLLinkElement[]

  return pipe(
    nodes
  , iter => filter(iter, hasHref)
  , iter => map(iter, x => createIcon(reference, getHref(x)!, getType(x), getSize(x)))
  , toArray
  )
}

function getSize(element: HTMLLinkElement): Icon['size'] {
  const sizes = element.getAttribute('sizes')
  if (sizes) {
    if (sizes === 'any') return 'any'
    const results = parseSpaceSeparatedSizes(sizes)
    if (results.length === 0) return null
    if (results.length === 1) return results[0]
    return results
  }
  return null
}

function getHref(element: HTMLLinkElement): string | null{
  return element.getAttribute('href') || null
}

function getType(element:  HTMLLinkElement): string | null {
  return element.getAttribute('type') || null
}

function hasHref(element: HTMLLinkElement): boolean {
  return !!element.getAttribute('href')
}

function createIcon(
  reference: string
, url: string
, type: string | null
, size: Icon['size'] | null
): Icon {
  return { reference, url, type, size }
}
