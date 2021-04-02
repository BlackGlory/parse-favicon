import { queryAll, css } from '@blackglory/query'
import { IterableOperator } from 'iterable-operator/lib/es2015/style/chaining/iterable-operator'
import { parseHTML } from '@utils/parse-html'
import { elementsToAttributes } from '@utils/elements-to-attributes'
import { Icon } from '@src/types'

export function parseWindows8Tiles(html: string): Icon[] {
  const document = parseHTML(html)
  return getWindows8TileIcons(document)
}

function getWindows8TileIcons(document: Document): Icon[] {
  const nodes = queryAll.call(document, css`meta[name="msapplication-TileImage"]`) as Element[]

  return new IterableOperator(nodes)
    .transform(elementsToAttributes('content'))
    .map(createWindows8TileIcon)
    .toArray()

  function createWindows8TileIcon(url: string): Icon {
    return {
      url
    , reference: 'msapplication-TileImage'
    , type: null
    , size: null
    }
  }
}
