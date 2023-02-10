import URI from 'urijs'

/**
 * `new URL(url, base)`支持不了base是一个相对URL的情况, 而`urijs`可以.
 */
export function mergeRelativeURLs(baseURI: string, relativeUrl: string): string {
  return new URI(relativeUrl)
    .absoluteTo(baseURI)
    .href()
}
