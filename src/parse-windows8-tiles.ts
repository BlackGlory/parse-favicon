import { queryAll, css } from '@blackglory/query'
import { filter, map, toArray } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { parseHTML } from '@utils/parse-html.js'
import { extractAttributes } from '@utils/extract-attributes.js'
import { isURLString } from '@utils/is-url-string.js'
import { IIcon } from '@src/types.js'

export function parseWindows8Tiles(html: string): IIcon[] {
  const document = parseHTML(html)
  return getWindows8TileIcons(document)
}

function getWindows8TileIcons(document: Document): IIcon[] {
  const elements = queryAll.call(
    document
  , css`meta[name="msapplication-TileImage"]`
  ) as Element[]

  return pipe(
    elements
  , elements => extractAttributes(elements, 'content')
  , contents => filter(contents, isURLString)
  , urls => map(urls, createWindows8TileIcon)
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
