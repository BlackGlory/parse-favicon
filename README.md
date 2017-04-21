# parse-favicon [![npm](https://img.shields.io/npm/v/parse-favicon.svg?maxAge=2592000)](https://www.npmjs.com/package/parse-favicon) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/parse-favicon/master/LICENSE)

Parse HTML to get favicon information.

Support `icon`, `msapplication-TileImage`, `apple-touch-icon-precomposed`, `apple-touch-icon`.

## Install

### CLI

```sh
npm install -g parse-favicon
```

### Module

```sh
npm install parse-favicon --save
```

## Usage

```js
parseFavicon(
  html: string
, options: Object = {
    baseURI: URI = ''
  , allowUseNetwork: boolean = false
  , allowParseImage: boolean = false
  , timeout: number = 1000 * 60
  }
, ignoreException: boolean = false
) : Promise
```

### Example

```js
import parseFavicon from 'parse-favicon'
import axios from 'axios'

axios.get('https://github.com')
.then(({ data: html }) => parseFavicon(html, { baseURI: 'https://github.com', allowUseNetwork: true, allowParseImage: true }))
.then(console.log)
.catch(console.error)

/* Output:
[ { url: 'https://assets-cdn.github.com/favicon.ico',
    path: '/favicon.ico',
    size: '16x16',
    type: 'image/x-icon',
    refer: 'icon' } ]
*/
```

### CLI

```sh
> parse-favicon https://twitter.com
[
  [
    {
      "url": "https://abs.twimg.com/favicons/win8-tile-144.png",
      "path": "//abs.twimg.com/favicons/win8-tile-144.png",
      "size": "144x144",
      "type": "png",
      "refer": "msapplication-TileImage"
    },
    {
      "url": "https://abs.twimg.com/icons/apple-touch-icon-192x192.png",
      "path": "/icons/apple-touch-icon-192x192.png",
      "size": "192x192",
      "type": "image/png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://abs.twimg.com/favicons/favicon.ico",
      "path": "//abs.twimg.com/favicons/favicon.ico",
      "size": "16x16",
      "type": "image/vnd.microsoft.icon",
      "refer": "icon"
    },
    {
      "url": "https://twitter.com/favicon.ico",
      "path": "/favicon.ico",
      "size": "16x16",
      "type": "image/x-icon",
      "refer": "/favicon.ico"
    }
  ]
]
```

## Declaration

```ts
declare module "parse-favicon" {
  interface IconInfo{
    url: string
    path: string
    size: string
    type: string
    refer: string
  }

  interface ParseOptions {
    baseURI?: string
    allowUseNetwork?: boolean
    allowParseImage?: boolean
    timeout?: number
  }

  let parseFavicon: (html: string, options?: ParseOptions, ignoreException?: boolean) => Promise<IconInfo[]>

  export default parseFavicon
}
```

See also: [parse-favicon.d.ts](https://raw.githubusercontent.com/BlackGlory/parse-favicon/master/src/parse-favicon.d.ts)

## Related projects

[BlackGlory/ico-size: A Node module to get dimensions of ico & cur image file](https://github.com/BlackGlory/ico-size)

## Projects using parse-favicon

Chrome extension:

* [favicon-detector: A simple way to detect website icons.](https://github.com/BlackGlory/favicon-detector)

## References

https://github.com/audreyr/favicon-cheat-sheet
