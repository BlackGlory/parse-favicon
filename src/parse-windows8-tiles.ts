import { queryAll, css } from '@blackglory/query'
import { transform, map, toArray } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { parseHTML } from '@utils/parse-html.js'
import { elementsToAttributes } from '@utils/elements-to-attributes.js'
import { IIcon } from '@src/types.js'

export function parseWindows8Tiles(html: string): IIcon[] {
  const document = parseHTML(html)
  return getWindows8TileIcons(document)
}

function getWindows8TileIcons(document: Document): IIcon[] {
  const nodes = queryAll.call(
    document
  , css`meta[name="msapplication-TileImage"]`
  ) as Element[]

  return pipe(
    nodes
  , iter => transform(iter, elementsToAttributes('content'))
  , iter => map(iter, createWindows8TileIcon)
  , toArray
  )

  function createWindows8TileIcon(url: string): IIcon {
    return {
      url
    , reference: 'msapplication-TileImage'
    , type: null
    , size: null
    }
  }
}
