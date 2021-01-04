import { fromBuffer } from 'file-type'
import imageSize from 'image-size'
import isSvg from 'is-svg'
import { Image } from '@src/types'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'

export class UnknownImageFormatError extends Error {
  name = this.constructor.name
}

export async function parseImage(buffer: Buffer): Promise<Image> {
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
      .map(x => createSize(x.width!, x.height!))
      .uniqBy(sizeToString)
      .toArray()
  } else {
    return createSize(result.width!, result.height!)
  }

  function createSize(width: number, height: number) {
    return { width, height }
  }

  function sizeToString(size: { width: number, height: number }) {
    return `${size.width}x${size.height}`
  }
}

function isXML(mime: string): boolean {
  return mime === 'application/xml'
      || mime === 'text/xml'
}

function isImage(mime: string): boolean {
  return mime.startsWith('image')
}
