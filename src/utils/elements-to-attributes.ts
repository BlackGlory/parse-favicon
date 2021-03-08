import { IterableOperator } from 'iterable-operator/lib/es2015/style/chaining/iterable-operator'

export function elementsToAttributes(attr: string) {
  return (iterable: Iterable<Element>) =>
    new IterableOperator(iterable)
      .map(x => x.getAttribute(attr))
      .filter<string>(isTruthy)
}

function isTruthy(val: unknown): boolean {
  return !!val
}
