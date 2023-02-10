import { getErrorAsync } from 'return-style'
import { parseImage, UnknownImageFormatError } from '@src/parse-image.js'
import * as path from 'path'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'

describe('parseImage', () => {
  describe('resource is a known image format', () => {
    test('resource is svg+xml', async () => {
      const buffer = await fetchBuffer('favicon.xml.svg')

      const result = await parseImage(buffer)

      expect(result).toStrictEqual({
        type: 'image/svg+xml'
      , size: { width: 36 , height: 36 }
      })
    })

    test('resource is svg', async () => {
      const buffer = await fetchBuffer('favicon.svg')

      const result = await parseImage(buffer)

      expect(result).toStrictEqual({
        type: 'image/svg+xml'
      , size: { width: 32 , height: 32 }
      })
    })

    test('resource is ico', async () => {
      const buffer = await fetchBuffer('favicon.ico')

      const result = await parseImage(buffer)

      expect(result).toStrictEqual({
        type: 'image/x-icon'
      , size: [
          { width: 16 , height: 16 }
        , { width: 32 , height: 32 }
        ]
      })
    })

    test('resource is duplicated-sizes.ico', async () => {
      const buffer = await fetchBuffer('duplicated-sizes.ico')

      const result = await parseImage(buffer)

      expect(result).toStrictEqual({
        type: 'image/x-icon'
      , size: [
          { width: 16 , height: 16 }
        , { width: 24 , height: 24 }
        , { width: 32 , height: 32 }
        , { width: 48 , height: 48 }
        , { width: 64 , height: 64 }
        ]
      })
    })

    test('resource is png', async () => {
      const buffer = await fetchBuffer('favicon.png')

      const result = await parseImage(buffer)

      expect(result).toStrictEqual({
        type: 'image/png'
      , size: { width: 32 , height: 32 }
      })
    })
  })

  test('resource isnt a known image format', async () => {
    const buffer = await fetchBuffer('favicon.txt')

    const err = await getErrorAsync(() => parseImage(buffer))

    expect(err).toBeInstanceOf(UnknownImageFormatError)
  })
})

function getFixturePath(filename: string) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  return path.join(__dirname, `fixtures/${filename}`)
}

function fetchBuffer(path: string): Promise<Buffer> {
  return fs.readFile(getFixturePath(path))
}
