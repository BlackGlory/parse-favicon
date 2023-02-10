import { pipe } from 'extra-utils'
import { map, filter } from 'iterable-operator'

export function extractAttributes(
  elements: Iterable<Element>
, attributeName: string
): IterableIterator<string> {
  return pipe(
    elements
  , iter => map(iter, x => x.getAttribute(attributeName))
  , iter => filter(iter, isTruthy)
  )
}

function isTruthy(val: unknown): boolean {
  return !!val
}
