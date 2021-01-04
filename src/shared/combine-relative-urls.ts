import URI = require('urijs')

export function combineRelativeUrls(baseURI: string, relativeUrl: string): string {
  return new URI(relativeUrl).absoluteTo(baseURI).href()
}
