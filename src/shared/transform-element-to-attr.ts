import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'

export function transformElementToAttr(attr: string) {
  return (iterable: Iterable<Element>) =>
    new IterableOperator(iterable)
      .map(x => x.getAttribute(attr))
      .filter<string>(isExist)
}

function isExist(x: unknown): boolean {
  return !!x
}
