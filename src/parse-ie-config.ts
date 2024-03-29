import { queryAll, xpath, css } from '@blackglory/query'
import { map } from 'extra-promise'
import * as Iter from 'iterable-operator'
import { pipe } from 'extra-utils'
import { parseHTML } from '@utils/parse-html.js'
import { parseXML } from '@utils/parse-xml.js'
import { isURLString } from '@utils/is-url-string.js'
import { mergeRelativeURLs } from '@utils/merge-relative-urls.js'
import { extractAttributes } from '@utils/extract-attributes.js'
import { IIcon, TextFetcher } from '@src/types.js'
import { isElement } from 'extra-dom'
import { flatten, toArray } from 'iterable-operator'
import { getResultAsync } from 'return-style'

export async function parseIEConfig(
  html: string
, fetchText: TextFetcher
): Promise<IIcon[]> {
  const document = parseHTML(html)
  const configUrls = extractConfigURLs(document)
  const icons = await map(configUrls, extractIconsFromURL)
  return toArray(flatten(icons))

  async function extractIconsFromURL(url: string): Promise<IIcon[]> {
    const text = await getResultAsync(() => fetchText(url))
    if (text) {
      return parseIEConfigIcons(text, url)
    } else {
      return []
    }
  }
}

function extractConfigURLs(document: Document): string[] {
  const elements = queryAll.call(
    document
  , css`meta[name="msapplication-config"]`
  ) as Element[]

  return pipe(
    elements
  , elements => extractAttributes(elements, 'content')
  , contents => Iter.filter(contents, isURLString)
  , toArray
  )
}

function parseIEConfigIcons(xml: string, configUrl: string): IIcon[] {
  const document = parseXML(xml)
  return [
    ...extractIEConfigIcons(
      document
    , '/browserconfig/msapplication/tile/square70x70logo'
    , { width: 70, height: 70 }
    )
  , ...extractIEConfigIcons(
      document
    , '/browserconfig/msapplication/tile/square150x150logo'
    , { width: 150, height: 150 }
    )
  , ...extractIEConfigIcons(
      document
    , '/browserconfig/msapplication/tile/wide310x150logo'
    , { width: 310, height: 150 }
    )
  , ...extractIEConfigIcons(
      document
    , '/browserconfig/msapplication/tile/square310x310logo'
    , { width: 310, height: 310 }
    )
  ].map(combineIconUrlWithConfigUrl)

  function combineIconUrlWithConfigUrl(icon: IIcon): IIcon {
    return {
      ...icon
    , url: mergeRelativeURLs(configUrl, icon.url)
    }
  }
}

function extractIEConfigIcons(
  document: Document
, selector: string
, size: { width: number, height: number }
): IIcon[] {
  const nodes = queryAll.call(document, xpath`.${selector}`) as Node[]

  return pipe(
    nodes
  , nodes => Iter.filter<Node, Element>(nodes, isElement)
  , elements => extractAttributes(elements, 'src')
  , srcURLs => Iter.map(srcURLs, url => createIcon(url, size))
  , toArray
  )

  function createIcon(url: string, size: { width: number, height: number }): IIcon {
    return {
      reference: 'msapplication-config'
    , url
    , type: null
    , size
    }
  }
}
