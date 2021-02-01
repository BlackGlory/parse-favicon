import { query, xpath, css } from '@blackglory/query'
import { map } from 'extra-promise'
import { IterableOperator } from 'iterable-operator/lib/es2015/style/chaining/iterable-operator'
import { parseHTML } from '@shared/parse-html'
import { parseXML } from '@shared/parse-xml'
import { isUrl } from '@shared/is-url'
import { combineRelativeUrls } from '@shared/combine-relative-urls'
import { transformElementToAttr } from '@shared/transform-element-to-attr'
import { Icon, TextFetcher } from '@src/types'
import { produce } from '@shared/immer'

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
  const nodes = query.call(document, css`meta[name="msapplication-config"]`)
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
  const elements = query.call(document, xpath`${selector}`)
  return new IterableOperator(elements)
    .transform(transformElementToAttr('src'))
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
