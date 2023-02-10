import { parseHTML } from '@utils/parse-html.js'
import { getIcons } from '@utils/link-element-utils.js'
import { IIcon } from '@src/types.js'

export function parseMaskIcons(html: string): IIcon[] {
  const document = parseHTML(html)
  return getIcons(document, 'link[rel="mask-icon"]', 'mask-icon')
}
