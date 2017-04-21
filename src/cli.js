'use strict'

import axios from 'axios'
import parseFavicon from './parse-favicon'

(async () => {
  try {
    const [,, ...urls] = process.argv
    const htmlCollection = await Promise.all(urls.map(axios.get))
    const infoCollection = await Promise.all(
      htmlCollection.map(x =>
        parseFavicon(x.data, {
          baseURI: x.config.url
        , allowUseNetwork: true
        , allowParseImage: true
        }, true)
      )
    )
    console.log(JSON.stringify(infoCollection, undefined, 2))
  } catch(e) {
    console.error(e)
  }
})()
