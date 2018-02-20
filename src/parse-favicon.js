'use strict'

import cheerio from 'cheerio'
import axios from 'axios'
import url from 'url'
import mime from 'mime-types'
import hash from 'object-hash'
import sizeOf from 'image-size'
import icoSizeOf from 'ico-size'

const sizeRegexp = /^\d+x\d+$/ // example: 16x16
const faviconDefaultPath = '/favicon.ico'

function addRefer(refer) {
  return obj => Object.assign({}, obj, { refer })
}

function isAbsoluteURL(urlObject) {
  if (typeof urlObject === 'string') {
    urlObject = url.parse(urlObject)
  }
  return !!urlObject.host
}

function uniqueDeep(arr) {
  const result = {}
  arr.forEach(x => result[hash(x)] = x)
  return Object.values(result)
}

export async function parseFavicon(html, { baseURI = '', allowUseNetwork = false, allowParseImage = false, timeout = 1000 * 60 }, ignoreException = false) {
  const $ = cheerio.load(html)

  async function createIcon(uri, type = mime.lookup(uri), size) {
    const result = {
      url: null
    , path: null
    , size: null
    , type: type || null
    , refer: null
    }

    Object.assign(result, ((baseURI, uri) => {
      if (isAbsoluteURL(uri)) {
        return { url: uri, path: url.parse(uri).pathname }
      } else {
        if (baseURI) {
          const absoluteURL = url.resolve(baseURI, uri)
          if (isAbsoluteURL(absoluteURL)) {
            return { url: absoluteURL, path: uri }
          }
        }
        return { path: uri }
      }
    })(baseURI, uri))

    if (allowParseImage) {
      if (result.url) {
        try {
          const { data, headers: { 'content-type': type }} = await axios.get(result.url, {
            responseType: 'arraybuffer', timeout
          })

          let width, height

          try {
            if (mime.extension(type) === 'ico'
            || ['image/vnd.microsoft.icon', 'image/x-icon'].includes(type)) {
              const info = icoSizeOf(data)
              width = info.width
              height = info.height
            } else if (['bmp', 'gif', 'jpeg', 'jpg', 'png', 'webp'].includes(mime.extension(type))) {
              const info = sizeOf(new Buffer(new Uint8Array(data)))
              width = info.width
              height = info.height
            }

            if (width && height) {
              result.size = `${ width }x${ height }`
            }

            if (type) {
              result.type = type
            }
          } catch(e) {
            if (!ignoreException) {
              throw e
            }
          }
        } catch(e) {
          if (!ignoreException) {
            throw e
          }
        }
      }
    } else {
      if (size && sizeRegexp.test(size)) {
        result.size = size
      }
    }

    return result
  }

  async function getMsapplicationTileImage() {
    const icons = []

    for (let el of $('meta[name="msapplication-TileImage"][content]').toArray()) {
      const content = $(el).attr('content')
      const sizes = $(el).attr('sizes')
      try {
        icons.push(await createIcon(content, undefined, sizes))
      } catch(e) {
        if (!ignoreException) {
          throw e
        }
      }
    }

    return icons
  }

  async function getAppleTouchIconPrecomposed() {
    const icons = []

    for (const el of $('link[rel="apple-touch-icon-precomposed"][href]').toArray()) {
      const href = $(el).attr('href')
      const sizes = $(el).attr('sizes')
      try {
        icons.push(await createIcon(href, undefined, sizes))
      } catch(e) {
        if (!ignoreException) {
          throw e
        }
      }
    }

    return icons
  }

  async function getAppleTouchIcons() {
    const icons = []

    for (const el of $('link[rel="apple-touch-icon"][href]').toArray()) {
      const href = $(el).attr('href')
      const sizes = $(el).attr('sizes')
      try {
        icons.push(await createIcon(href, undefined, sizes))
      } catch(e) {
        if (!ignoreException) {
          throw e
        }
      }
    }

    return icons
  }

  async function getIcons() {
    const icons = []

    for (const el of $('link[rel~="icon"][href]').toArray()) {
      const href = $(el).attr('href')
      const sizes = $(el).attr('sizes')
      try {
        icons.push(await createIcon(href, undefined, sizes))
      } catch(e) {
        if (!ignoreException) {
          throw e
        }
      }
    }

    return icons
  }

  async function getDefaultPathFavicion() {
    const icons = []

    if (allowUseNetwork) {
      if (baseURI) {
        const faviconURI = url.resolve(baseURI, faviconDefaultPath)
        if (!icons.find(x => x.absoluteURL === faviconURI)) {
          try {
            const { headers: { 'content-type': contentType }} = await axios.get(faviconURI, { timeout })
            if (mime.extension(contentType) === 'ico') {
              icons.push(await createIcon(faviconDefaultPath, contentType))
            }
          } catch(e) {
            void 0
          }
        }
      }
    }

    return icons
  }

  const msapplicationTileImage = (await getMsapplicationTileImage()).map(addRefer('msapplication-TileImage'))
  const appleTouchIcons = (await getAppleTouchIcons()).map(addRefer('apple-touch-icon'))
  const appleTouchIconPrecomposed = (await getAppleTouchIconPrecomposed()).map(addRefer('apple-touch-icon-precomposed'))
  const icons = (await getIcons()).map(addRefer('icon'))

  const result = [
    ...msapplicationTileImage
  , ...appleTouchIcons
  , ...appleTouchIconPrecomposed
  , ...icons
  ]

  if (!result.find(x => x.path === '/favicon.ico')) {
    result.push(...(await getDefaultPathFavicion()).map(addRefer('/favicon.ico')))
  }

  return uniqueDeep(result)
}

export default parseFavicon
