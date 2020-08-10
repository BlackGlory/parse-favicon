import URI from 'urijs'

export function combineRelativeUrlsForManifest(baseURI: string, relativeUrl: string): string {
  if (relativeUrl.startsWith('/')) {
    return new URI('.' + relativeUrl).absoluteTo(baseURI).href()
  } else {
    return new URI(relativeUrl).absoluteTo(baseURI).href()
  }
}

export function combineRelativeUrls(baseURI: string, relativeUrl: string): string {
  return new URI(relativeUrl).absoluteTo(baseURI).href()
}
