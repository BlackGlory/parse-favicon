import { query, css } from '@blackglory/query'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
import { parseHTML } from '@shared/parse-html'
import { hasHref, getHref, getSize, getType } from '@shared/link-utils'
import { Icon } from '@src/types'

export function parseAppleTouchIcons(html: string): Icon[] {
  const document = parseHTML(html)
  return [
    ...getAppleTouchIcons(document)
  , ...getAppleTouchPrecomposedIcons(document)
  ]
}

function getAppleTouchIcons(document: Document): Icon[] {
  const nodes = query.call(document, css`link[rel="apple-touch-icon"]`) as HTMLLinkElement[]
  return new IterableOperator(nodes)
    .filter(hasHref)
    .map(x => createAppleTouchIcon(getHref(x)!, getType(x), getSize(x)))
    .toArray()

  function createAppleTouchIcon(
    url: string
  , type?: string
  , size?: Icon['size']
  ): Icon {
    return {
      url
    , reference: 'apple-touch-icon'
    , size
    , type
    }
  }
}

function getAppleTouchPrecomposedIcons(document: Document): Icon[] {
  const nodes = query.call(document, css`link[rel="apple-touch-icon-precomposed"]`) as HTMLLinkElement[]
  return new IterableOperator(nodes)
    .filter(hasHref)
    .map(x => createAppleTouchPrecomposedIcon(getHref(x)!, getType(x), getSize(x)))
    .toArray()

  function createAppleTouchPrecomposedIcon(
    url: string
  , type?: string
  , size?: Icon['size']
  ): Icon {
    return {
      url
    , reference: 'apple-touch-icon-precomposed'
    , size
    , type
    }
  }
}
