import { queryAll, xpath, css } from '@blackglory/query'
import { map } from 'extra-promise'
import { IterableOperator } from 'iterable-operator/lib/es2015/style/chaining/iterable-operator'
import { parseHTML } from '@utils/parse-html'
import { parseXML } from '@utils/parse-xml'
import { isUrl } from '@utils/is-url'
import { combineRelativeUrls } from '@utils/combine-relative-urls'
import { elementsToAttributes } from '@utils/elements-to-attributes'
import { Icon, TextFetcher } from '@src/types'
import { produce } from '@utils/immer'
import { isElement } from 'extra-dom'

export async function parseIEConfig(html: string, textFetcher: TextFetcher): Promise<Icon[]> {
  const document = parseHTML(html)
  const configUrls = getConfigUrls(document)
  const icons = await map(configUrls, getIconsFromUrl)
  return icons.flat()

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
  const nodes = queryAll.call(document, css`meta[name="msapplication-config"]`) as Element[]

  return new IterableOperator(nodes)
    .map(x => x.getAttribute('content'))
    .filter<string>(isUrl)
    .toArray()
}

function getIEConfigIcons(xml: string, configUrl: string): Icon[] {
  const document = parseXML(xml)
  return [
    ...getIcons(document, '/browserconfig/msapplication/tile/square70x70logo', { width: 70, height: 70 })
  , ...getIcons(document, '/browserconfig/msapplication/tile/square150x150logo', { width: 150, height: 150 })
  , ...getIcons(document, '/browserconfig/msapplication/tile/wide310x150logo', { width: 310, height: 150 })
  , ...getIcons(document, '/browserconfig/msapplication/tile/square310x310logo', { width: 310, height: 310 })
  ].map(combineIconUrlWithConfigUrl)

  function combineIconUrlWithConfigUrl(icon: Icon): Icon {
    return produce(icon, icon => {
      icon.url = combineRelativeUrls(configUrl, icon.url)
    })
  }
}

function getIcons(document: Document, selector: string, size: { width: number, height: number }): Icon[] {
  const nodes = queryAll.call(document, xpath`.${selector}`) as Node[]

  return new IterableOperator(nodes)
    .filter<Element>(isElement)
    .transform(elementsToAttributes('src'))
    .map(url => createIcon(url, size))
    .toArray()

  function createIcon(url: string, size: { width: number, height: number }): Icon {
    return {
      reference: 'msapplication-config'
    , url
    , type: null
    , size
    }
  }
}
