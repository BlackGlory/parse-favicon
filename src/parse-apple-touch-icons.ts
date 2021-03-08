import { parseHTML } from '@utils/parse-html'
import { getIcons } from '@utils/link-element-utils'
import { Icon } from '@src/types'

export function parseAppleTouchIcons(html: string): Icon[] {
  const document = parseHTML(html)
  return [
    ...getIcons(document, 'link[rel="apple-touch-icon"]', 'apple-touch-icon')
  , ...getIcons(document, 'link[rel="apple-touch-icon-precomposed"]', 'apple-touch-icon-precomposed')
  ]
}
