import { map, toArray } from 'iterable-operator'
import { pipe } from 'extra-utils'
import matchAll from 'string.prototype.matchall'
import { ISize } from '@src/types.js'

/**
 * @param sizes 例子`32x32`, `32x32 64x64`
 */
export function parseSpaceSeparatedSizes(sizes: string): ISize[] {
  if (/^\d+[x|X]\d+(?:\s+\d+[x|X]\d+)*$/.test(sizes)) {
    const re = /(?<width>\d+)[x|X](?<height>\d+)/g
    const matchResults = matchAll(sizes, re)
    return pipe(
      matchResults
    , iter => map(iter, x => {
        const width = Number.parseInt(x.groups!.width, 10)
        const height = Number.parseInt(x.groups!.height, 10)
        return { width, height }
      })
    , toArray
    )
  }
  return []
}
