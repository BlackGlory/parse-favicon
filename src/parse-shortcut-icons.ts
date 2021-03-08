import { parseHTML } from '@utils/parse-html'
import { getIcons } from '@utils/link-element-utils'
import { Icon } from '@src/types'

export function parseShortcutIcons(html: string): Icon[] {
  const document = parseHTML(html)
  return getIcons(document, 'link[rel="shortcut icon"]', 'shortcut-icon')
}
