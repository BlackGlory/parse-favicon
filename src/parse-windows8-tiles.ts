import { query, css } from '@blackglory/query'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
import { parseHTML } from '@shared/parse-html'
import { transformElementToAttr } from '@shared/transform-element-to-attr'
import { Icon } from '@types'

export function parseWindows8Tiles(html: string): Icon[] {
  const document = parseHTML(html)
  return getWindows8TileIcons(document)
}

function getWindows8TileIcons(document: Document): Icon[] {
  const nodes = query.call(document, css`meta[name="msapplication-TileImage"]`)
  return new IterableOperator(nodes)
    .transform(transformElementToAttr('content'))
    .map(createWindows8TileIcon)
    .toArray()

  function createWindows8TileIcon(url: string): Icon {
    return {
      url
    , reference: 'msapplication-TileImage'
    , type: undefined
    , size: undefined
    }
  }
}
