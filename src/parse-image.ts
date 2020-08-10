import { fromBuffer } from 'file-type'
import { imageSize } from 'image-size'
import isSvg from 'is-svg'
import { Image, BufferFetcher } from '@src/types'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'

export class UnknownImageFormatError extends Error {
  name = this.constructor.name
}

export async function parseImage(url: string, bufferFetcher: BufferFetcher): Promise<Image> {
  const buffer = Buffer.from(await bufferFetcher(url))
  const type = await fromBuffer(buffer)
  if (type) {
    if (isImage(type.mime)) {
      return {
        type: type.mime
      , size: getSize(buffer)
      }
    }
    if (isXML(type.mime) && isSvg(buffer)) return parseAsSvg(buffer)
  } else {
    if (isSvg(buffer)) return parseAsSvg(buffer)
  }
  throw new UnknownImageFormatError()
}

function parseAsSvg(buffer: Buffer): Image {
  return {
    type: 'image/svg+xml'
  , size: getSize(buffer)
  }
}

function getSize(buffer: Buffer): Image['size'] {
  const result = imageSize(buffer)
  if (result.images) {
    return new IterableOperator(result.images)
      .map(x => ({ width: x.width!, height: x.height! }))
      .uniqBy(x => `${x.width}x${x.height}`)
      .toArray()
  } else {
    return { width: result.width!, height: result.height! }
  }
}

function isXML(mime: string): boolean {
  return mime === 'application/xml'
      || mime === 'text/xml'
}

function isImage(mime: string): boolean {
  return mime.startsWith('image')
}
