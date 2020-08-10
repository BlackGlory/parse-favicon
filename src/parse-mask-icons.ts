import { query, css } from '@blackglory/query'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
import { parseHTML } from '@shared/parse-html'
import { hasHref, getHref, getType, getSize } from '@shared/link-utils'
import { Icon } from '@src/types'

export function parseMaskIcons(html: string): Icon[] {
  const document = parseHTML(html)
  return getMaskIcons(document)
}

function getMaskIcons(document: Document): Icon[] {
  const nodes = query.call(document, css`link[rel="mask-icon"]`) as HTMLLinkElement[]
  return new IterableOperator(nodes)
    .filter(hasHref)
    .map(x => createMaskIcon(getHref(x)!, getType(x), getSize(x)))
    .toArray()

  function createMaskIcon(
    url: string
  , type?: string
  , size?: Icon['size']
  ): Icon {
    return {
      url
    , reference: 'mask-icon'
    , type
    , size
    }
  }
}
