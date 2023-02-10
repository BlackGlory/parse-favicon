import { pipe } from 'extra-utils'
import { map, filter } from 'iterable-operator'

export function extractAttributes(
  elements: Iterable<Element>
, attributeName: string
): IterableIterator<string> {
  return pipe(
    elements
  , elements => map(elements, element => element.getAttribute(attributeName))
  , attributeValue => filter(attributeValue, isTruthy)
  )
}

function isTruthy(val: unknown): boolean {
  return !!val
}
