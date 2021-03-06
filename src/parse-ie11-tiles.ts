import { queryAll, css } from '@blackglory/query'
import { IterableOperator } from 'iterable-operator/lib/es2015/style/chaining/iterable-operator'
import { parseHTML } from '@utils/parse-html'
import { elementsToAttributes } from '@utils/elements-to-attributes'
import { Icon } from '@src/types'

export function parseIE11Tiles(html: string): Icon[] {
  const document = parseHTML(html)
  return [
    ...getIcons(document, 'meta[name="msapplication-square70x70logo"]', 'msapplication-square70x70logo', { width: 70, height: 70 })
  , ...getIcons(document, 'meta[name="msapplication-square150x150logo"]', 'msapplication-square150x150logo', { width: 150, height: 150 })
  , ...getIcons(document, 'meta[name="msapplication-wide310x150logo"]', 'msapplication-wide310x150logo', { width: 310, height: 150 })
  , ...getIcons(document, 'meta[name="msapplication-square310x310logo"]', 'msapplication-square310x310logo', { width: 310, height: 310 })
  ]
}

function getIcons(document: Document, selector: string, reference: string, size: { width: number, height: number }): Icon[] {
  const nodes = queryAll.call(document, css`${selector}`) as Element[]
  return new IterableOperator(nodes)
    .transform(elementsToAttributes('content'))
    .map(url => createIcon(reference, url, size))
    .toArray()

  function createIcon(reference: string, url: string, size: { width: number, height: number }): Icon {
    return {
      reference
    , url
    , type: null
    , size
    }
  }
}
