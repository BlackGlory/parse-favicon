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
import { Icon, TextFetcher, BufferFetcher } from './types'
import { Observable } from 'rxjs'

export { Icon, TextFetcher, BufferFetcher }

export function parseFavicon(url: string, textFetcher: TextFetcher, bufferFetcher?: BufferFetcher): Observable<Icon> {
  return new Observable(observer => {
    ;(async () => {
      const html = await textFetcher(url)

      const pendings: Array<Promise<any>> = []

      parseAppleTouchIcons(html).forEach(icon =>
        pendings.push(tryEnhanceIcon(icon, bufferFetcher).then(x => observer.next(x)))
      )

      parseFluidIcons(html).forEach(icon =>
        pendings.push(tryEnhanceIcon(icon, bufferFetcher).then(x => observer.next(x)))
      )

      parseIcons(html).forEach(icon =>
        pendings.push(tryEnhanceIcon(icon, bufferFetcher).then(x => observer.next(x)))
      )

      parseIE11Tiles(html).forEach(icon =>
        pendings.push(tryEnhanceIcon(icon, bufferFetcher).then(x => observer.next(x)))
      )

      parseMaskIcons(html).forEach(icon =>
        pendings.push(tryEnhanceIcon(icon, bufferFetcher).then(x => observer.next(x)))
      )

      parseShortcutIcons(html).forEach(icon =>
        pendings.push(tryEnhanceIcon(icon, bufferFetcher).then(x => observer.next(x)))
      )

      parseWindows8Tiles(html).forEach(icon =>
        pendings.push(tryEnhanceIcon(icon, bufferFetcher).then(x => observer.next(x)))
      )

      if (bufferFetcher) {
        getUrls().forEach(url => {
          pendings.push((async () => {
            const image = await getResultAsync(() => parseImage(url, bufferFetcher))
            if (image) {
              observer.next({
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
            pendings.push(tryEnhanceIcon(icon, bufferFetcher).then(x => observer.next(x)))
          })
        }
      , async () => {
          ;(await parseManifest(html, textFetcher)).forEach(icon => {
            pendings.push(tryEnhanceIcon(icon, bufferFetcher).then(x => observer.next(x)))
          })
        }
      ])

      await Promise.all(pendings)

      observer.complete()
    })()
  })
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

async function tryEnhanceIcon(icon: Icon, bufferFetcher?: BufferFetcher): Promise<Icon> {
  if (bufferFetcher) {
    const image = await getResultAsync(() => parseImage(icon.url, bufferFetcher))
    if (image) {
      return Object.assign({}, icon, {
        type: image.type
      , size: image.size
      })
    }
  }
  return icon
}
