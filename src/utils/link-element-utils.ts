import { queryAll, css } from '@blackglory/query'
import { filter, map, toArray } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { parseSpaceSeparatedSizes } from '@utils/parse-space-separated-sizes.js'
import { IIcon } from '@src/types.js'

/**
 * @param reference 表示该图标的来源, 例如`apple-touch-icon`, 没有太大实际意义.
 */
export function extractIconsFromLinkElements(
  document: Document
, linkElementSelector: string
, reference: string
): IIcon[] {
  const links = queryAll.call(document, css`${linkElementSelector}`) as HTMLLinkElement[]

  return pipe(
    links
  , links => filter(links, hasHref)
  , links => map(links, x => createIcon(reference, getHref(x)!, getType(x), getSize(x)))
  , toArray
  )
}

function getSize(element: HTMLLinkElement): IIcon['size'] {
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
, size: IIcon['size'] | null
): IIcon {
  return { reference, url, type, size }
}
