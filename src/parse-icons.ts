import { parseHTML } from '@utils/parse-html.js'
import { getIcons } from '@utils/link-element-utils.js'
import { Icon } from '@src/types.js'

export function parseIcons(html: string): Icon[] {
  const document = parseHTML(html)
  return getIcons(document, 'link[rel="icon"]', 'icon')
}
