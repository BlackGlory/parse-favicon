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
  return function(obj) {
    return Object.assign({}, obj, { refer })
  }
}

function isAbsoluteURL(urlObject) {
  if (typeof urlObject === 'string') {
    urlObject = url.parse(urlObject)
  }
  return !!urlObject.host
}

function uniqueDeep(arr) {
  let result = {}
  arr.forEach(x => result[hash(x)] = x)
  return Object.values(result)
}

export async function parseFavicon(html, { baseURI = '', allowUseNetwork = false, allowParseImage = false, timeout = 1000 * 60 }, ignoreException = false) {
  const $ = cheerio.load(html)

  async function createIcon(uri, type = mime.lookup(uri), size) {
    let result = {
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
          let absoluteURL = url.resolve(baseURI, uri)
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
          let { data, headers: { 'content-type': type }} = await axios.get(result.url, {
            responseType: 'arraybuffer', timeout
          })

          let width, height

          try {
            if (mime.extension(type) === 'ico'
            || ['image/vnd.microsoft.icon', 'image/x-icon'].includes(type)) {
              let info = icoSizeOf(data)
              width = info.width
              height = info.height
            } else if (['bmp', 'gif', 'jpeg', 'jpg', 'png', 'webp'].includes(mime.extension(type))) {
              let info = sizeOf(new Buffer(new Uint8Array(data)))
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
    let icons = []

    for (let el of $('meta[name="msapplication-TileImage"][content]').toArray()) {
      let content = $(el).attr('content')
      let sizes = $(el).attr('sizes')
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
    let icons = []

    for (let el of $('link[rel="apple-touch-icon-precomposed"][href]').toArray()) {
      let href = $(el).attr('href')
      let sizes = $(el).attr('sizes')
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
    let icons = []

    for (let el of $('link[rel="apple-touch-icon"][href]').toArray()) {
      let href = $(el).attr('href')
      let sizes = $(el).attr('sizes')
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
    let icons = []

    for (let el of $('link[rel~="icon"][href]').toArray()) {
      let href = $(el).attr('href')
      let sizes = $(el).attr('sizes')
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
    let icons = []

    if (allowUseNetwork) {
      if (baseURI) {
        let faviconURI = url.resolve(baseURI, faviconDefaultPath)
        if (!icons.find(x => x.absoluteURL === faviconURI)) {
          try {
            let { headers: { 'content-type': contentType }} = await axios.get(faviconURI, { timeout })
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

  let msapplicationTileImage = (await getMsapplicationTileImage()).map(addRefer('msapplication-TileImage'))
    , appleTouchIcons = (await getAppleTouchIcons()).map(addRefer('apple-touch-icon'))
    , appleTouchIconPrecomposed = (await getAppleTouchIconPrecomposed()).map(addRefer('apple-touch-icon-precomposed'))
    , icons = (await getIcons()).map(addRefer('icon'))

  let result = [
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
