import { getErrorAsync } from 'return-style'
import { parseImage, UnknownImageFormatError } from '@src/parse-image'
import * as path from 'path'
import { promises as fs } from 'fs'
import '@test/matchers'

describe('parseImage(buffer: Buffer): Promise<Image>', () => {
  describe('resource is a known image format', () => {
    describe('resource is svg+xml', () => {
      it('return Promise<Image>', async () => {
        const buffer = await fetchBuffer('favicon.xml.svg')

        const result = parseImage(buffer)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toStrictEqual({
          type: 'image/svg+xml'
        , size: { width: 36 , height: 36 }
        })
      })
    })

    describe('resource is svg', () => {
      it('return Promise<Image>', async () => {
        const buffer = await fetchBuffer('favicon.svg')

        const result = parseImage(buffer)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toStrictEqual({
          type: 'image/svg+xml'
        , size: { width: 32 , height: 32 }
        })
      })
    })

    describe('resource is ico', () => {
      it('return Promise<Image>', async () => {
        const buffer = await fetchBuffer('favicon.ico')

        const result = parseImage(buffer)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toStrictEqual({
          type: 'image/x-icon'
        , size: [
            { width: 16 , height: 16 }
          , { width: 32 , height: 32 }
          ]
        })
      })
    })

    describe('resource is duplicated-sizes.ico', () => {
      it('return Promise<Image>', async () => {
        const buffer = await fetchBuffer('duplicated-sizes.ico')

        const result = parseImage(buffer)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toStrictEqual({
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
    })

    describe('resource is png', () => {
      it('return Promise<Image>', async () => {
        const buffer = await fetchBuffer('favicon.png')

        const result = parseImage(buffer)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toStrictEqual({
          type: 'image/png'
        , size: { width: 32 , height: 32 }
        })
      })
    })
  })

  describe('resource isnt a known image format', () => {
    it('throw UnknownImageFormatError', async () => {
      const buffer = await fetchBuffer('favicon.txt')

      const result = getErrorAsync(() => parseImage(buffer))
      const err = await result

      expect(result).toBePromise()
      expect(err).toBeInstanceOf(UnknownImageFormatError)
    })
  })
})

function getFixturePath(filename: string) {
  return path.join(__dirname, `fixtures/${filename}`)
}

function fetchBuffer(path: string): Promise<Buffer> {
  return fs.readFile(getFixturePath(path))
}
