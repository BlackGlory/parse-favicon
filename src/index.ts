import { getResultAsync } from 'return-style'
import { parseAppleTouchIcons } from '@src/parse-apple-touch-icons.js'
import { parseFluidIcons } from '@src/parse-fluid-icons.js'
import { parseIcons } from '@src/parse-icons.js'
import { parseIEConfig } from '@src/parse-ie-config.js'
import { parseIE11Tiles } from '@src/parse-ie11-tiles.js'
import { parseManifest } from '@src/parse-manifest.js'
import { parseMaskIcons } from '@src/parse-mask-icons.js'
import { parseWindows8Tiles } from '@src/parse-windows8-tiles.js'
import { parseImage, IImage } from '@utils/parse-image.js'
import { Observable } from 'rxjs'
import { IIcon, TextFetcher, BufferFetcher } from './types.js'
import { Awaitable, go } from '@blackglory/prelude'
import { each } from 'extra-promise'
import { memoizeAsync } from 'extra-memoize'
import { Cache } from '@extra-memoize/memory-cache'

export { IIcon, TextFetcher, BufferFetcher } from './types.js'

export function parseFavicon(
  pageURL: string
, _fetchText: TextFetcher
, _fetchBuffer?: BufferFetcher
): Observable<IIcon> {
  const fetchText: TextFetcher = (url: string): Awaitable<string> => {
    const absoluteURL = new URL(url, pageURL).href
    return _fetchText(absoluteURL)
  }
  const fetchBuffer: BufferFetcher | undefined =
    _fetchBuffer
    ? (url: string): Awaitable<ArrayBuffer> => {
        const absoluteURL = new URL(url, pageURL).href
        return _fetchBuffer(absoluteURL)
      }
    : undefined

  return new Observable(observer => {
    parse(icon => observer.next(icon))
      .then(() => observer.complete())
      .catch(err => observer.error(err))
  })

  async function parse(publish: (icon: IIcon) => void): Promise<void> {
    const html = await fetchText(pageURL)

    const icons = [
      ...parseAppleTouchIcons(html)
    , ...parseFluidIcons(html)
    , ...parseIcons(html)
    , ...parseIE11Tiles(html)
    , ...parseMaskIcons(html)
    , ...parseWindows8Tiles(html)
    ]

    if (fetchBuffer) {
      const fetchImage = memoizeAsync(
        { cache: new Cache<IImage | null>() }
      , async (url: string): Promise<IImage | null> => {
          const arrayBuffer = await getResultAsync(() => fetchBuffer(url))
          if (!arrayBuffer) return null
          const buffer = Buffer.from(arrayBuffer)

          try {
            return await parseImage(buffer)
          } catch {
            return null
          }
        }
      )

      await Promise.all([
        each(icons, async icon => {
          const image = await fetchImage(icon.url)
          const newIcon = await createIconBasedOnIconAndImage(icon, image)
          publish(newIcon)
        })
      , go(async () => {
          const icons = await parseIEConfig(html, fetchText)
          await each(icons, async icon => {
            const image = await fetchImage(icon.url)
            const newIcon = await createIconBasedOnIconAndImage(icon, image)
            publish(newIcon)
          })
        })
      , go(async () => {
          const icons = await parseManifest(html, fetchText)
          await each(icons, async icon => {
            const image = await fetchImage(icon.url)
            const newIcon = await createIconBasedOnIconAndImage(icon, image)
            publish(newIcon)
          })
        })
      , each(getDefaultIconUrls(), async url => {
          const image = await fetchImage(url)

          if (image) {
            publish({
              url
            , reference: url
            , type: image.type
            , size: image.size
            })
          }
        })
      ])
    } else {
      icons.forEach(publish)

      await Promise.all([
        go(async () => {
          const icons = await parseIEConfig(html, fetchText)
          icons.forEach(publish)
        })
      , go(async () => {
          const icons = await parseManifest(html, fetchText)
          icons.forEach(publish)
        })
      ])
    }
  }
}

async function createIconBasedOnIconAndImage(
  icon: IIcon
, image: IImage | null
): Promise<IIcon> {
  return {
    ...icon
  , ...image && {
      type: image.type
    , size: image.size
    }
  }
}

function getDefaultIconUrls() {
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
