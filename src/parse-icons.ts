import { query, css } from '@blackglory/query'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
import { parseHTML } from '@shared/parse-html'
import { hasHref, getHref, getType, getSize } from '@shared/link-utils'
import { Icon } from '@types'

export function parseIcons(html: string): Icon[] {
  const document = parseHTML(html)
  return getIcons(document)
}

function getIcons(document: Document): Icon[] {
  const nodes = query.call(document, css`link[rel="icon"]`) as HTMLLinkElement[]
  return new IterableOperator(nodes)
    .filter(hasHref)
    .map(x => createShortcutIcon(getHref(x)!, getType(x), getSize(x)))
    .toArray()

  function createShortcutIcon(
    url: string
  , type?: string
  , size?: Icon['size']
  ): Icon {
    return {
      url
    , reference: 'icon'
    , type
    , size
    }
  }
}
