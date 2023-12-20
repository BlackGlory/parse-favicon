import { map, toArray } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { ISize } from '@src/types.js'

/**
 * @param sizes 例子`32x32`, `32x32 64x64`
 */
export function parseSpaceSeparatedSizes(sizes: string): ISize[] {
  if (/^\d+[x|X]\d+(?:\s+\d+[x|X]\d+)*$/.test(sizes)) {
    const re = /(?<width>\d+)[x|X](?<height>\d+)/g
    const matches = sizes.matchAll(re)

    return pipe(
      matches
    , matches => map(matches, match => {
        const width = Number.parseInt(match.groups!.width, 10)
        const height = Number.parseInt(match.groups!.height, 10)
        return { width, height }
      })
    , toArray
    )
  } else {
    return []
  }
}
