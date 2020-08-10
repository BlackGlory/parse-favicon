import { parseHTML } from '@shared/parse-html'
import { getIcons } from '@shared/link-utils'
import { Icon } from '@src/types'

export function parseAppleTouchIcons(html: string): Icon[] {
  const document = parseHTML(html)
  return [
    ...getIcons(document, 'link[rel="apple-touch-icon"]', 'apple-touch-icon')
  , ...getIcons(document, 'link[rel="apple-touch-icon-precomposed"]', 'apple-touch-icon-precomposed')
  ]
}
