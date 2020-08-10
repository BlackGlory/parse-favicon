import { query, css } from '@blackglory/query'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
import { parseHTML } from '@shared/parse-html'
import { transformElementToAttr } from '@shared/transform-element-to-attr'
import { Icon } from '@src/types'

export function parseIE11Tiles(html: string): Icon[] {
  const document = parseHTML(html)
  return [
    ...getSquare70x70Icons(document)
  , ...getSquare150x150Icons(document)
  , ...getWide310x150Icons(document)
  , ...getSquare310x310Icons(document)
  ]
}

function getSquare70x70Icons(document: Document): Icon[] {
  const nodes = query.call(document, css`meta[name="msapplication-square70x70logo"]`)
  return new IterableOperator(nodes)
    .transform(transformElementToAttr('content'))
    .map(createSquare70x70Icon)
    .toArray()

  function createSquare70x70Icon(url: string): Icon {
    return {
      url
    , reference: 'msapplication-square70x70logo'
    , type: undefined
    , size: { width: 70, height: 70 }
    }
  }
}

function getSquare150x150Icons(document: Document): Icon[] {
  const nodes = query.call(document, css`meta[name="msapplication-square150x150logo"]`)
  return new IterableOperator(nodes)
    .transform(transformElementToAttr('content'))
    .map(createSquare150x150Icon)
    .toArray()

  function createSquare150x150Icon(url: string): Icon {
    return {
      url
    , reference: 'msapplication-square150x150logo'
    , type: undefined
    , size: { width: 150, height: 150 }
    }
  }
}

function getWide310x150Icons(document: Document): Icon[] {
  const nodes = query.call(document, css`meta[name="msapplication-wide310x150logo"]`)
  return new IterableOperator(nodes)
    .transform(transformElementToAttr('content'))
    .map(createWide310x150Icon)
    .toArray()

  function createWide310x150Icon(url: string): Icon {
    return {
      url
    , reference: 'msapplication-wide310x150logo'
    , type: undefined
    , size: { width: 310, height: 150 }
    }
  }
}

function getSquare310x310Icons(document: Document): Icon[] {
  const nodes = query.call(document, css`meta[name="msapplication-square310x310logo"]`)
  return new IterableOperator(nodes)
    .transform(transformElementToAttr('content'))
    .map(createSquare310x310Icon)
    .toArray()

  function createSquare310x310Icon(url: string): Icon {
    return {
      url
    , reference: 'msapplication-square310x310logo'
    , type: undefined
    , size: { width: 310, height: 310 }
    }
  }
}
