import { parseHTML } from '@utils/parse-html.js'
import { extractIconsFromLinkElements } from '@utils/link-element-utils.js'
import { IIcon } from '@src/types.js'

export function parseShortcutIcons(html: string): IIcon[] {
  const document = parseHTML(html)
  return extractIconsFromLinkElements(
    document
  , 'link[rel="shortcut icon"]'
  , 'shortcut-icon'
  )
}
