import { getDOMParser } from '@shared/get-dom-parser'

export function parseHTML(html: string): Document {
  const parser = getDOMParser()
  return parser.parseFromString(html, 'text/html')
}
