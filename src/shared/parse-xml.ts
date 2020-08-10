import { getDOMParser } from '@shared/get-dom-parser'

export function parseXML(xml: string): Document {
  const parser = getDOMParser()
  return parser.parseFromString(xml, 'text/xml')
}
