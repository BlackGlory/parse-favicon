import { parallel } from 'extra-promise'
import { getResultAsync } from 'return-style'
import { parseAppleTouchIcons } from '@src/parse-apple-touch-icons'
import { parseFluidIcons } from '@src/parse-fluid-icons'
import { parseIcons } from '@src/parse-icons'
import { parseIEConfig } from '@src/parse-ie-config'
import { parseIE11Tiles } from '@src/parse-ie11-tiles'
import { parseManifest } from '@src/parse-manifest'
import { parseMaskIcons } from '@src/parse-mask-icons'
import { parseShortcutIcons } from '@src/parse-shortcut-icons'
import { parseWindows8Tiles } from '@src/parse-windows8-tiles'
import { parseImage } from '@src/parse-image'
import { Observable } from 'rxjs'
import { produce } from '@shared/immer'

import { Icon, TextFetcher, BufferFetcher } from './types'
export { Icon, TextFetcher, BufferFetcher }

export function parseFavicon(url: string, textFetcher: TextFetcher, bufferFetcher?: BufferFetcher): Observable<Icon> {
  return new Observable(observer => {
    parse(val => observer.next(val))
      .then(() => observer.complete())
      .catch(err => observer.error(err))
  })

  async function parse(publish: (val: Icon) => void) {
    const html = await textFetcher(url)

    const pendings: Array<Promise<void>> = []

    parseAppleTouchIcons(html).forEach(icon => pendings.push(updateIcon(icon).then(publish)))
    parseFluidIcons(html).forEach(icon => pendings.push(updateIcon(icon).then(publish)))
    parseIcons(html).forEach(icon => pendings.push(updateIcon(icon).then(publish)))
    parseIE11Tiles(html).forEach(icon => pendings.push(updateIcon(icon).then(publish)))
    parseMaskIcons(html).forEach(icon => pendings.push(updateIcon(icon).then(publish)))
    parseShortcutIcons(html).forEach(icon => pendings.push(updateIcon(icon).then(publish)))
    parseWindows8Tiles(html).forEach(icon => pendings.push(updateIcon(icon).then(publish)))

    if (bufferFetcher) {
      getUrls().forEach(url => {
        pendings.push((async () => {
          const image = await getResultAsync(() => parseImage(url, bufferFetcher))
          if (image) {
            publish({
              url
            , reference: url
            , type: image.type
            , size: image.size
            })
          }
        })())
      })
    }

    await parallel([
      async () => {
        ;(await parseIEConfig(html, textFetcher)).forEach(icon => {
          pendings.push(updateIcon(icon).then(publish))
        })
      }
    , async () => {
        ;(await parseManifest(html, textFetcher)).forEach(icon => {
          pendings.push(updateIcon(icon).then(publish))
        })
      }
    ])

    await Promise.all(pendings)
  }

  async function updateIcon(icon: Icon): Promise<Icon> {
    if (bufferFetcher) {
      const image = await getResultAsync(() => parseImage(icon.url, bufferFetcher))
      if (image) {
        return produce(icon, icon => {
          icon.type = image.type
          icon.size = image.size
        })
      }
    }
    return icon
  }
}

function getUrls() {
  return [
    '/favicon.ico'
  , '/apple-touch-icon-57x57-precomposed.png'
  , '/apple-touch-icon-57x57.png'
  , '/apple-touch-icon-72x72-precomposed.png'
  , '/apple-touch-icon-72x72.png'
  , '/apple-touch-icon-114x114-precomposed.png'
  , '/apple-touch-icon-114x114.png'
  , '/apple-touch-icon-120x120-precomposed.png'
  , '/apple-touch-icon-120x120.png'
  , '/apple-touch-icon-144x144-precomposed.png'
  , '/apple-touch-icon-144x144.png'
  , '/apple-touch-icon-152x152-precomposed.png'
  , '/apple-touch-icon-152x152.png'
  , '/apple-touch-icon-180x180-precomposed.png'
  , '/apple-touch-icon-180x180.png'
  , '/apple-touch-icon-precomposed.png'
  , '/apple-touch-icon.png'
  ]
}
