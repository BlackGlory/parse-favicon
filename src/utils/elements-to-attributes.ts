import { pipe } from 'extra-utils'
import { map, filter } from 'iterable-operator'

export function elementsToAttributes(
  attrs: string
): (elements: Iterable<Element>) => Iterable<string> {
  return (elements: Iterable<Element>) => pipe(
    elements
  , iter => map(iter, x => x.getAttribute(attrs))
  , iter => filter(iter, isTruthy)
  )
}

function isTruthy(val: unknown): boolean {
  return !!val
}
