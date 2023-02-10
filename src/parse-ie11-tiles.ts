import { queryAll, css } from '@blackglory/query'
import { filter, map, toArray } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { parseHTML } from '@utils/parse-html.js'
import { extractAttributes } from '@utils/extract-attributes.js'
import { IIcon } from '@src/types.js'
import { isURLString } from '@utils/is-url-string.js'

export function parseIE11Tiles(html: string): IIcon[] {
  const document = parseHTML(html)

  return [
    ...extractIE11TileIcons(
      document
    , 'meta[name="msapplication-square70x70logo"]'
    , 'msapplication-square70x70logo'
    , { width: 70, height: 70 }
    )
  , ...extractIE11TileIcons(
      document
    , 'meta[name="msapplication-square150x150logo"]'
    , 'msapplication-square150x150logo'
    , { width: 150, height: 150 }
    )
  , ...extractIE11TileIcons(
      document
    , 'meta[name="msapplication-wide310x150logo"]'
    , 'msapplication-wide310x150logo'
    , { width: 310, height: 150 }
    )
  , ...extractIE11TileIcons(
      document
    , 'meta[name="msapplication-square310x310logo"]'
    , 'msapplication-square310x310logo'
    , { width: 310, height: 310 }
    )
  ]
}

function extractIE11TileIcons(
  document: Document
, selector: string
, reference: string
, size: { width: number; height: number }
): IIcon[] {
  const elements = queryAll.call(document, css`${selector}`) as Element[]

  return pipe(
    elements
  , elements => extractAttributes(elements, 'content')
  , contents => filter(contents, isURLString)
  , urls => map(urls, url => createIcon(reference, url, size))
  , toArray
  )

  function createIcon(
    reference: string
  , url: string
  , size: { width: number; height: number }
  ): IIcon {
    return {
      reference
    , url
    , type: null
    , size
    }
  }
}
