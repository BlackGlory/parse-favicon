import { isntEmptyArray } from '@blackglory/prelude'
import { parseFavicon } from '@src/index.js'
import { toArray, lastValueFrom } from 'rxjs'

describe('parseFavicon', () => {
  test('without fetchBuffer', async () => {
    const pageURL = 'https://github.com'

    const results = await lastValueFrom(
      parseFavicon(pageURL, fetchText)
        .pipe(toArray())
    )

    // Considering that the results may change,
    // we only need to ensure the array is not empty.
    expect(isntEmptyArray(results)).toBe(true)
  }, 30 * 1000)

  test('with fetchBuffer', async () => {
    const pageURL = 'https://github.com'

    const results = await lastValueFrom(
      parseFavicon(pageURL, fetchText, fetchBuffer)
        .pipe(toArray())
    )

    // Considering that the results may change,
    // we only need to ensure the array is not empty.
    expect(isntEmptyArray(results)).toBe(true)
  }, 30 * 1000)
})

function fetchText(url: string): Promise<string> {
  return fetch(url)
    .then(res => res.text())
}

function fetchBuffer(url: string): Promise<ArrayBuffer> {
  return fetch(url)
    .then(res => res.arrayBuffer())
}
