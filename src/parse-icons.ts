import { parseHTML } from '@shared/parse-html'
import { getIcons } from '@shared/link-utils'
import { Icon } from '@src/types'

export function parseIcons(html: string): Icon[] {
  const document = parseHTML(html)
  return getIcons(document, 'link[rel="icon"]', 'icon')
}
