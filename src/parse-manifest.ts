import { queryAll, css } from '@blackglory/query'
import { map } from 'extra-promise'
import * as Iter from 'iterable-operator'
import { pipe } from 'extra-utils'
import { parseHTML } from '@utils/parse-html.js'
import { isURLString } from '@utils/is-url-string.js'
import { mergeRelativeURLs } from '@utils/merge-relative-urls.js'
import { parseSpaceSeparatedSizes } from '@utils/parse-space-separated-sizes.js'
import { IIcon, TextFetcher } from '@src/types.js'
import { extractAttributes } from '@utils/extract-attributes.js'
import { isObject, isArray, isString } from '@blackglory/prelude'

interface IManifest {
  icons: Array<{
    src: string
    sizes: string
    type?: string
  }>
}

export async function parseManifest(
  html: string
, textFetcher: TextFetcher
): Promise<IIcon[]> {
  const document = parseHTML(html)
  const manifestUrls = extractManifestURLs(document)
  const results = await map(manifestUrls, async url => {
    const text = await fetch(url)
    if (text) {
      return extractManifestIcons(text, url)
    } else {
      return []
    }
  })
  return ([] as IIcon[]).concat(...results)

  async function fetch(url: string): Promise<string | null> {
    try {
      return await textFetcher(url)
    } catch {
      return null
    }
  }
}

function isManifest(val: unknown): val is IManifest {
  return isObject(val)
      && 'icons' in val
      && isArray(val.icons)
      && val.icons.every(icon => {
           return isObject(icon)
               && ('src' in icon && isString(icon.src))
               && ('sizes' in icon && isString(icon.sizes))
               && (
                    !('type' in icon) ||
                    ('type' in icon && isString(icon.type))
                  )
         })
}

function extractManifestURLs(document: Document): string[] {
  const links = queryAll.call(document, css`link[rel="manifest"]`) as HTMLLinkElement[]

  return pipe(
    links
  , links => extractAttributes(links, 'href')
  , urls => Iter.filter(urls, isURLString)
  , Iter.toArray
  )
}

function extractManifestIcons(json: string, baseURI: string): IIcon[] {
  const manifest = JSON.parse(json)

  if (isManifest(manifest)) {
    return manifest.icons
      .map(icon => createManifestIcon(icon.src, parseSpaceSeparatedSizes(icon.sizes), icon.type))
      .map(combineIconUrlWithManifestUrl)
  } else {
    return []
  }

  function combineIconUrlWithManifestUrl(icon: IIcon): IIcon {
    return {
      ...icon
    , url: combineRelativeUrlsForManifest(baseURI, icon.url)
    }
  }

  function createManifestIcon(
    url: string
  , sizes: Array<{ width: number, height: number }>
  , type?: string
  ): IIcon {
    return {
      url
    , reference: 'manifest'
    , type: type ?? null
    , size: createSize()
    }

    function createSize(): IIcon['size'] {
      if (sizes.length === 0) return null
      if (sizes.length === 1) return sizes[0]
      return sizes
    }
  }
}

function combineRelativeUrlsForManifest(baseURI: string, relativeUrl: string): string {
  return mergeRelativeURLs(baseURI, relativeUrl)
}
