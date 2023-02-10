import { fileTypeFromBuffer } from 'file-type'
import { imageSize as getImageSize } from 'image-size'
import isSvg from 'is-svg'
import { IImage } from '@src/types.js'
import { map, uniqBy, toArray } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { CustomError } from '@blackglory/errors'

export class UnknownImageFormatError extends CustomError {}

export async function parseImage(buffer: Buffer): Promise<IImage> {
  const type = await fileTypeFromBuffer(buffer)
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

function parseAsSvg(buffer: Buffer): IImage {
  return {
    type: 'image/svg+xml'
  , size: getSize(buffer)
  }
}

function getSize(buffer: Buffer): IImage['size'] {
  const result = getImageSize(buffer)
  if (result.images) {
    return pipe(
      result.images
    , xs => map(xs, x => createSize(x.width!, x.height!))
    , xs => uniqBy(xs, sizeToString)
    , toArray
    )
  } else {
    return createSize(result.width!, result.height!)
  }

  function createSize(width: number, height: number): {
    width: number
    height: number
  } {
    return { width, height }
  }

  function sizeToString(size: { width: number; height: number }): string {
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
