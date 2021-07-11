import { getErrorAsync } from 'return-style'
import { dedent } from 'extra-tags'
import { parseManifest } from '@src/parse-manifest'
import '@blackglory/jest-matchers'
import 'jest-extended'

describe('parseManifest(html: string, fetcher: Fetcher): Promise<Icon[]>', () => {
  it('call fetcher to get resource', async () => {
    const fetcher = jest.fn(() => { throw new Error() })
    const html = `
      <link rel="manifest" href="path/to/manifest.webmanifest">
    `

    getErrorAsync(() => parseManifest(html, fetcher))

    expect(fetcher).toBeCalledWith('path/to/manifest.webmanifest')
  })

  describe('manifest cannot fetch', () => {
    it('return []', async () => {
      const fetcher = () => { throw new Error() }
      const html = `
        <link rel="manifest" href="path/to/manifest.webmanifest">
      `

      const result = parseManifest(html, fetcher)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toEqual([])
    })
  })

  describe('manifest can fetch', () => {
    it('return Icon[]', async () => {
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

      const result = parseManifest(html, async () => manifest)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toIncludeSameMembers([
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

    describe('absolute path', () => {
      it('return Icon[]', async () => {
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

        const result = parseManifest(html, async () => manifest)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toIncludeSameMembers([
          {
            url: '/path/to/icon'
          , reference: 'manifest'
          , type: null
          , size: { width: 48, height: 48 }
          }
        ])
      })
    })
  })
})
