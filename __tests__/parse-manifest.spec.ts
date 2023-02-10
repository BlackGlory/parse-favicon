import { getErrorAsync } from 'return-style'
import { dedent } from 'extra-tags'
import { parseManifest } from '@src/parse-manifest.js'
import { jest } from '@jest/globals'

describe('parseManifest', () => {
  test('call fetcher to get resource', async () => {
    const fetcher = jest.fn(() => { throw new Error() })
    const html = `
      <link rel="manifest" href="path/to/manifest.webmanifest">
    `

    await getErrorAsync(() => parseManifest(html, fetcher))

    expect(fetcher).toBeCalledWith('path/to/manifest.webmanifest')
  })

  test('manifest cannot fetch', async () => {
    const fetcher = () => { throw new Error() }
    const html = `
      <link rel="manifest" href="path/to/manifest.webmanifest">
    `

    const result = await parseManifest(html, fetcher)

    expect(result).toEqual([])
  })

  describe('manifest can fetch', () => {
    test('relative paths', async () => {
      const html = `
        <link rel="manifest" href="path/to/manifest.webmanifest">
      `
      const manifest = dedent`
        {
          "icons": [
            {
              "src": "path/to/icon",
              "sizes": "48x48"
            },
            {
              "src": "path/to/icon.ico",
              "sizes": "72x72 128x128"
            },
            {
              "src": "path/to/icon.webp",
              "sizes": "48x48",
              "type": "image/webp"
            }
          ]
        }
      `

      const result = await parseManifest(html, () => manifest)

      expect(result).toMatchObject([
        {
          url: 'path/to/path/to/icon'
        , reference: 'manifest'
        , type: null
        , size: { width: 48, height: 48 }
        }
      , {
          url: 'path/to/path/to/icon.ico'
        , reference: 'manifest'
        , type: null
        , size: [
            { width: 72, height: 72 }
          , { width: 128, height: 128 }
          ]
        }
      , {
          url: 'path/to/path/to/icon.webp'
        , reference: 'manifest'
        , type: 'image/webp'
        , size: { width: 48, height: 48 }
        }
      ])
    })

    test('absolute path', async () => {
      const html = `
        <link rel="manifest" href="path/to/manifest.webmanifest">
      `
      const manifest = dedent`
        {
          "icons": [
            {
              "src": "/path/to/icon",
              "sizes": "48x48"
            }
          ]
        }
      `

      const result = await parseManifest(html, () => manifest)

      expect(result).toMatchObject([
        {
          url: '/path/to/icon'
        , reference: 'manifest'
        , type: null
        , size: { width: 48, height: 48 }
        }
      ])
    })

    test('invalid manifest', async () => {
      const html = `
        <link rel="manifest" href="path/to/manifest.webmanifest">
      `
      const manifest = dedent`{}`

      const result = await parseManifest(html, () => manifest)

      expect(result).toMatchObject([])
    })
  })
})
