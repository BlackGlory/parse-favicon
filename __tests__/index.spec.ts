import { isntEmptyArray } from '@blackglory/prelude'
import { parseFavicon } from '@src/index.js'
import { toArray, lastValueFrom } from 'rxjs'

test('parseFavicon', async () => {
  const pageURL = 'https://github.com'

  const results = await lastValueFrom(
    parseFavicon(pageURL, fetchText, fetchBuffer)
      .pipe(toArray())
  )

  // Considering that the results may change,
  // we only need to ensure the array is not empty.
  // Yes, that is basically a smoke test.
  expect(isntEmptyArray(results)).toBe(true)

  function fetchText(url: string): Promise<string> {
    return fetch(url)
      .then(res => res.text())
  }

  function fetchBuffer(url: string): Promise<ArrayBuffer> {
    return fetch(url)
      .then(res => res.arrayBuffer())
  }
}, 30 * 1000)
