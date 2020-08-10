import { query, xpath, css } from '@blackglory/query'
import { map } from 'extra-promise'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
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
  const results = await map(configUrls, async url => {
    const text = await fetch(url)
    if (text) {
      return getIEConfigIcons(text, url)
    } else {
      return []
    }
  })
  return ([] as Icon[]).concat(...results)

  async function fetch(url: string): Promise<string | undefined> {
    try {
      return await textFetcher(url)
    } catch (e) {
      return undefined
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

function getIEConfigIcons(xml: string, baseURI: string): Icon[] {
  const document = parseXML(xml)
  const icons = [
    ...getSquare70x70Icons(document)
  , ...getSquare150x150Icons(document)
  , ...getWide310x150Icons(document)
  , ...getSquare310x310Icons(document)
  ]
  return icons.map(iconUrlsToRelativeUrls)

  function iconUrlsToRelativeUrls(icon: Icon): Icon {
    return produce(icon, draft => {
      draft.url = combineRelativeUrls(baseURI, icon.url)
    })
  }
}

function getSquare70x70Icons(document: Document): Icon[] {
  const elements = query.call(document, xpath`/browserconfig/msapplication/tile/square70x70logo`)
  return new IterableOperator(elements)
    .transform(transformElementToAttr('src'))
    .map(createSquare70x70Icon)
    .toArray()

  function createSquare70x70Icon(url: string): Icon {
    return {
      url
    , reference: 'msapplication-config'
    , type: undefined
    , size: { width: 70, height: 70 }
    }
  }
}

function getSquare150x150Icons(document: Document): Icon[] {
  const elements = query.call(document, xpath`/browserconfig/msapplication/tile/square150x150logo`)
  return new IterableOperator(elements)
    .transform(transformElementToAttr('src'))
    .map(createSquare150x150Icon)
    .toArray()

  function createSquare150x150Icon(url: string): Icon {
    return {
      url
    , reference: 'msapplication-config'
    , type: undefined
    , size: { width: 150, height: 150 }
    }
  }
}

function getWide310x150Icons(document: Document): Icon[] {
  const elements = query.call(document, xpath`/browserconfig/msapplication/tile/wide310x150logo`)
  return new IterableOperator(elements)
    .transform(transformElementToAttr('src'))
    .map(createSquare310x310Icon)
    .toArray()

  function createSquare310x310Icon(url: string): Icon {
    return {
      url
    , reference: 'msapplication-config'
    , type: undefined
    , size: { width: 310, height: 150 }
    }
  }
}

function getSquare310x310Icons(document: Document): Icon[] {
  const elements = query.call(document, xpath`/browserconfig/msapplication/tile/square310x310logo`)
  return new IterableOperator(elements)
    .transform(transformElementToAttr('src'))
    .map(createSquare310x310Icon)
    .toArray()

  function createSquare310x310Icon(url: string): Icon {
    return {
      url
    , reference: 'msapplication-config'
    , type: undefined
    , size: { width: 310, height: 310 }
    }
  }
}
