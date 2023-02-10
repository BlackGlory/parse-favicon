import { queryAll, xpath, css } from '@blackglory/query'
import { map } from 'extra-promise'
import * as Iter from 'iterable-operator'
import { pipe } from 'extra-utils'
import { parseHTML } from '@utils/parse-html.js'
import { parseXML } from '@utils/parse-xml.js'
import { isURLString } from '@utils/is-url-string.js'
import { combineRelativeUrls } from '@utils/combine-relative-urls.js'
import { elementsToAttributes } from '@utils/elements-to-attributes.js'
import { Icon, TextFetcher } from '@src/types.js'
import { produce } from '@utils/immer.js'
import { isElement } from 'extra-dom'
import { flatten, toArray } from 'iterable-operator'

export async function parseIEConfig(
  html: string
, textFetcher: TextFetcher
): Promise<Icon[]> {
  const document = parseHTML(html)
  const configUrls = getConfigUrls(document)
  const icons = await map(configUrls, getIconsFromUrl)
  return toArray(flatten(icons))

  async function getIconsFromUrl(url: string): Promise<Icon[]> {
    const text = await fetch(url)
    if (text) {
      return getIEConfigIcons(text, url)
    } else {
      return []
    }

    async function fetch(url: string): Promise<string | null> {
      try {
        return await textFetcher(url)
      } catch {
        return null
      }
    }
  }
}

function getConfigUrls(document: Document): string[] {
  const nodes = queryAll.call(
    document
  , css`meta[name="msapplication-config"]`
  ) as Element[]

  return pipe(
    nodes
  , nodes => Iter.map(nodes, x => x.getAttribute('content'))
  , contents => Iter.filter<string | null, string>(contents, isURLString)
  , toArray
  )
}

function getIEConfigIcons(xml: string, configUrl: string): Icon[] {
  const document = parseXML(xml)
  return [
    ...getIcons(
      document
    , '/browserconfig/msapplication/tile/square70x70logo'
    , { width: 70, height: 70 }
    )
  , ...getIcons(
      document
    , '/browserconfig/msapplication/tile/square150x150logo'
    , { width: 150, height: 150 }
    )
  , ...getIcons(
      document
    , '/browserconfig/msapplication/tile/wide310x150logo'
    , { width: 310, height: 150 }
    )
  , ...getIcons(
      document
    , '/browserconfig/msapplication/tile/square310x310logo'
    , { width: 310, height: 310 }
    )
  ].map(combineIconUrlWithConfigUrl)

  function combineIconUrlWithConfigUrl(icon: Icon): Icon {
    return produce(icon, icon => {
      icon.url = combineRelativeUrls(configUrl, icon.url)
    })
  }
}

function getIcons(
  document: Document
, selector: string
, size: { width: number, height: number }
): Icon[] {
  const nodes = queryAll.call(document, xpath`.${selector}`) as Node[]

  return pipe(
    nodes
  , nodes => Iter.filter<Node, Element>(nodes, isElement)
  , elements => Iter.transform(elements, elementsToAttributes('src'))
  , urls => Iter.map(urls, url => createIcon(url, size))
  , toArray
  )

  function createIcon(url: string, size: { width: number, height: number }): Icon {
    return {
      reference: 'msapplication-config'
    , url
    , type: null
    , size
    }
  }
}
