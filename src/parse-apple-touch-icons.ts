import { parseHTML } from '@utils/parse-html.js'
import { getIcons } from '@utils/link-element-utils.js'
import { IIcon } from '@src/types.js'

export function parseAppleTouchIcons(html: string): IIcon[] {
  const document = parseHTML(html)
  return [
    ...getIcons(document, 'link[rel="apple-touch-icon"]', 'apple-touch-icon')
  , ...getIcons(
      document
    , 'link[rel="apple-touch-icon-precomposed"]'
    , 'apple-touch-icon-precomposed'
    )
  ]
}
