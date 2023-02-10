import { fileTypeFromBuffer } from 'file-type'
import { imageSize } from 'image-size'
import isSvg from 'is-svg'
import { IImage } from '@src/types.js'
import { map, uniqBy, toArray, filter } from 'iterable-operator'
import { isntUndefined, pipe } from 'extra-utils'
import { CustomError } from '@blackglory/errors'

export class UnknownImageFormatError extends CustomError {}

export async function parseImage(buffer: Buffer): Promise<IImage> {
  const type = await fileTypeFromBuffer(buffer)
  if (type) {
    if (isImage(type.mime)) {
      return {
        type: type.mime
      , size: getImageSize(buffer)
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
  , size: getImageSize(buffer)
  }
}

function getImageSize(buffer: Buffer): IImage['size'] {
  const result = imageSize(buffer)
  if (result.images) {
    return pipe(
      result.images
    , imageSizes => filter(imageSizes, x => {
        return isntUndefined(x.width)
            && isntUndefined(x.height)
      })
    , imageSizes => map(imageSizes, x => {
        return {
          width: x.width!
        , height: x.height!
        }
      })
    , xs => uniqBy(xs, sizeToString)
    , toArray
    )
  } else {
    return {
      width: result.width!
    , height: result.height!
    }
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
