import { createDOMParser } from 'extra-dom'

export function parseXML(xml: string): Document {
  const parser = createDOMParser()
  return parser.parseFromString(xml, 'text/xml')
}
