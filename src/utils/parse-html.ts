import { createDOMParser } from 'extra-dom'

export function parseHTML(html: string): Document {
  const parser = createDOMParser()
  return parser.parseFromString(html, 'text/html')
}
