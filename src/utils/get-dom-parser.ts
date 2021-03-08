import { JSDOM } from 'jsdom'

export function getDOMParser(): DOMParser {
  const dom = new JSDOM()
  return new dom.window.DOMParser()
}
