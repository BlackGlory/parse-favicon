import { queryAll, css } from '@blackglory/query'
import { map } from 'extra-promise'
import * as Iter from 'iterable-operator'
import { pipe } from 'extra-utils'
import { parseHTML } from '@utils/parse-html.js'
import { parseJSON } from '@utils/parse-json.js'
import { isURLString } from '@utils/is-url-string.js'
import { combineRelativeUrls } from '@utils/combine-relative-urls.js'
import { parseSpaceSeparatedSizes } from '@utils/parse-space-separated-sizes.js'
import { IIcon, TextFetcher } from '@src/types.js'
import { produce } from '@utils/immer.js'

interface Manifest {
  icons: Array<{
    src: string
    sizes: string
    type?: string
  }>
}

export async function parseManifest(html: string, textFetcher: TextFetcher): Promise<IIcon[]> {
  const document = parseHTML(html)
  const manifestUrls = getManifestUrls(document)
  const results = await map(manifestUrls, async url => {
    const text = await fetch(url)
    if (text) {
      return getManifestIcons(text, url)
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

function getManifestUrls(document: Document): string[] {
  const nodes = queryAll.call(document, css`link[rel="manifest"]`) as HTMLLinkElement[]

  return pipe(
    nodes
  , nodes => Iter.map(nodes, x => x.getAttribute('href'))
  , iter => Iter.filter<string | null, string>(iter, isURLString)
  , Iter.toArray
  )
}

function getManifestIcons(json: string, baseURI: string): IIcon[] {
  const manifest = parseJSON<Manifest>(json)

  return manifest.icons
    .map(x => createManifestIcon(x.src, parseSpaceSeparatedSizes(x.sizes), x.type))
    .map(combineIconUrlWithManifestUrl)

  function combineIconUrlWithManifestUrl(icon: IIcon): IIcon {
    return produce(icon, draft => {
      draft.url = combineRelativeUrlsForManifest(baseURI, icon.url)
    })
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
  return combineRelativeUrls(baseURI, relativeUrl)
}
