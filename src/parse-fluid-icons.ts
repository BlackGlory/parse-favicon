import { query, css } from '@blackglory/query'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
import { parseHTML } from '@shared/parse-html'
import { hasHref, getHref, getType, getSize } from '@shared/link-utils'
import { Icon } from '@types'

export function parseFluidIcons(html: string): Icon[] {
  const document = parseHTML(html)
  return getFluidIcons(document)
}

function getFluidIcons(document: Document): Icon[] {
  const nodes = query.call(document, css`link[rel="fluid-icon"]`) as HTMLLinkElement[]
  return new IterableOperator(nodes)
    .filter(hasHref)
    .map(x => createFluidIcon(getHref(x)!, getType(x), getSize(x)))
    .toArray()

  function createFluidIcon(
    url: string
  , type?: string
  , size?: Icon['size']
  ): Icon {
    return {
      url
    , reference: 'fluid-icon'
    , type
    , size
    }
  }
}
