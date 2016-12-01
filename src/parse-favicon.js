const cheerio = require('cheerio')
const axios = require('axios')
const url = require('url')
const mime = require('mime-types')
const co = require('co')
const sizeOf = require('image-size')
const icoSizeOf = require('ico-size')

const parseFavicon = co.wrap(function *(html, { baseURI = '', allowUseNetwork = false, allowParseImage = false, timeout = 1000 * 60 }, ignoreException = false) {
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

  const createIcon = co.wrap(function *(uri, type = mime.lookup(uri), size) {
    let result = {}

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

    if (size && /^\d+x\d+$/.test(size)) {
      Object.assign(result, { size })
    } else if (result.url) {
      try {
        let { data, headers: { 'content-type': type }} = yield axios.get(result.url, { responseType: 'arraybuffer', timeout })

        let width, height
        try {
          if (mime.extension(type) === 'ico') {
            let info = icoSizeOf(data)
            width = info.width
            height = info.height
          } else {
            let info = sizeOf(new Buffer(new Uint8Array(data)))
            width = info.width
            height = info.height
            type = info.type
          }
        } catch(e) {
          if (!ignoreException) {
            throw e
          }
        }

        if (width && height) {
          Object.assign(result, { size: `${ width }x${ height }` })
        }

        if (type) {
          Object.assign(result, { type })
        }
      } catch(e) {
        if (!ignoreException) {
          throw e
        }
      }
    }

    if (!result.type) {
      Object.assign(result, { type })
    }

    return result
  })

  const $ = cheerio.load(html)

  let msapplicationTileImage = yield co(function *() {
    let icons = []

    for (let el of $('meta[name="msapplication-TileImage"][content]').toArray()) {
      let content = $(el).attr('content')
      let sizes = $(el).attr('sizes')
      try {
        icons.push(yield createIcon(content, undefined, sizes))
      } catch(e) {
        if (!ignoreException) {
          throw e
        }
      }
    }

    return icons
  })

  let appleTouchIconPrecomposed = yield co(function *() {
    let icons = []

    for (let el of $('link[rel="apple-touch-icon-precomposed"][href]').toArray()) {
      let href = $(el).attr('href')
      let sizes = $(el).attr('sizes')
      try {
        icons.push(yield createIcon(href, undefined, sizes))
      } catch(e) {
        if (!ignoreException) {
          throw e
        }
      }
    }

    return icons
  })

  let appleTouchIcons = yield co(function *() {
    let icons = []

    for (let el of $('link[rel="apple-touch-icon"][href]').toArray()) {
      let href = $(el).attr('href')
      let sizes = $(el).attr('sizes')
      try {
        icons.push(yield createIcon(href, undefined, sizes))
      } catch(e) {
        if (!ignoreException) {
          throw e
        }
      }
    }

    return icons
  })

  let icons = yield co(function *() {
    let icons = []

    for (let el of $('link[rel~="icon"][href]').toArray()) {
      let href = $(el).attr('href')
      let sizes = $(el).attr('sizes')
      try {
        icons.push(yield createIcon(href, undefined, sizes))
      } catch(e) {
        if (!ignoreException) {
          throw e
        }
      }
    }

    return icons
  })

  let defaultPathFavicon = []

  if (allowUseNetwork) {
    if (baseURI) {
      const FAVICON_DEFAULT_PATH = '/favicon.ico'
      let faviconURI = url.resolve(baseURI, FAVICON_DEFAULT_PATH)
      if (!icons.find(x => x.absoluteURL === faviconURI)) {
        try {
          let { headers: { 'content-type': contentType }} = yield axios.get(faviconURI, { timeout })
          if (mime.extension(contentType) === 'ico') {
            defaultPathFavicon.push(yield createIcon(FAVICON_DEFAULT_PATH, contentType))
          }
        } catch(e) {
          if (!ignoreException) {
            throw e
          }
        }
      }
    }
  }

  return [
    ...msapplicationTileImage.map(addRefer('msapplication-TileImage'))
  , ...appleTouchIcons.map(addRefer('apple-touch-icon'))
  , ...appleTouchIconPrecomposed.map(addRefer('apple-touch-icon-precomposed'))
  , ...icons.map(addRefer('icon'))
  , ...defaultPathFavicon.map(addRefer('/favicon.ico'))
  ]
})

if (require.main === module) {
  const [,, ...urls] = process.argv
  Promise.all(urls.map(axios.get))
  .then(results => Promise.all(
    results
    .map(x => parseFavicon(x.data, { baseURI: x.config.url, allowUseNetwork: true, allowParseImage: true }, true))
  ))
  .then(x => JSON.stringify(x, undefined, 2))
  .then(console.log)
  .catch(console.error)
} else {
  module.exports = parseFavicon
}
