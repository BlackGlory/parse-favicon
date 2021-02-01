import { query, css } from '@blackglory/query'
import { map } from 'extra-promise'
import { IterableOperator } from 'iterable-operator/lib/es2015/style/chaining/iterable-operator'
import { parseHTML } from '@shared/parse-html'
import { parseJSON } from '@shared/parse-json'
import { isUrl } from '@shared/is-url'
import { combineRelativeUrls } from '@shared/combine-relative-urls'
import { parseSpaceSeparatedSizes } from '@shared/parse-space-separated-sizes'
import { Icon, TextFetcher } from '@src/types'
import { produce } from '@shared/immer'

interface Manifest {
  icons: Array<{
    src: string
    sizes: string
    type?: string
  }>
}

export async function parseManifest(html: string, textFetcher: TextFetcher): Promise<Icon[]> {
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
  return ([] as Icon[]).concat(...results)

  async function fetch(url: string): Promise<string | null> {
    try {
      return await textFetcher(url)
    } catch {
      return null
    }
  }
}

function getManifestUrls(document: Document): string[] {
  const nodes = query.call(document, css`link[rel="manifest"]`) as HTMLLinkElement[]

  return new IterableOperator(nodes)
    .map(x => x.getAttribute('href'))
    .filter<string>(isUrl)
    .toArray()
}

function getManifestIcons(json: string, baseURI: string): Icon[] {
  const manifest = parseJSON<Manifest>(json)

  return manifest.icons
    .map(x => createManifestIcon(x.src, parseSpaceSeparatedSizes(x.sizes), x.type))
    .map(combineIconUrlWithManifestUrl)

  function combineIconUrlWithManifestUrl(icon: Icon): Icon {
    return produce(icon, draft => {
      draft.url = combineRelativeUrlsForManifest(baseURI, icon.url)
    })
  }

  function createManifestIcon(
    url: string
  , sizes: Array<{ width: number, height: number }>
  , type?: string
  ): Icon {
    return {
      url
    , reference: 'manifest'
    , type: type ?? null
    , size: createSize()
    }

    function createSize(): Icon['size'] {
      if (sizes.length === 0) return null
      if (sizes.length === 1) return sizes[0]
      return sizes
    }
  }
}

function combineRelativeUrlsForManifest(baseURI: string, relativeUrl: string): string {
  return combineRelativeUrls(baseURI, relativeUrl)
}
