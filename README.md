# parse-favicon

[![npm](https://img.shields.io/npm/v/parse-favicon.svg?maxAge=2592000)](https://www.npmjs.com/package/parse-favicon)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/parse-favicon/master/LICENSE)

Parse HTML to get favicon information.

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

## Defined

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

### Example

```js
const parseFavicon = require('parse-favicon')
const axios = require('axios')

axios.get('https://github.com')
.then(({ data: html }) => parseFavicon(html, { baseURI: 'https://github.com', allowUseNetwork: true, allowParseImage: true }))
.then(console.log)
.catch(console.error)
/*
[ { url: 'https://github.com/windows-tile.png',
  path: '/windows-tile.png',
  size: '512x512',
  type: 'png',
  refer: 'msapplication-TileImage' },
  ...
  { url: 'https://github.com/favicon.ico',
    path: '/favicon.ico',
    size: '16x16',
    type: 'image/x-icon',
    refer: '/favicon.ico' } ]
 */
```

### CLI

```sh
> node ./src/parse-favicon.js https://github.com

[
  [
    {
      "url": "https://github.com/windows-tile.png",
      "path": "/windows-tile.png",
      "size": "512x512",
      "type": "png",
      "refer": "msapplication-TileImage"
    },
    {
      "url": "https://github.com/apple-touch-icon.png",
      "path": "/apple-touch-icon.png",
      "size": "120x120",
      "type": "png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://github.com/apple-touch-icon-57x57.png",
      "path": "/apple-touch-icon-57x57.png",
      "size": "57x57",
      "type": "image/png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://github.com/apple-touch-icon-60x60.png",
      "path": "/apple-touch-icon-60x60.png",
      "size": "60x60",
      "type": "image/png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://github.com/apple-touch-icon-72x72.png",
      "path": "/apple-touch-icon-72x72.png",
      "size": "72x72",
      "type": "image/png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://github.com/apple-touch-icon-76x76.png",
      "path": "/apple-touch-icon-76x76.png",
      "size": "76x76",
      "type": "image/png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://github.com/apple-touch-icon-114x114.png",
      "path": "/apple-touch-icon-114x114.png",
      "size": "114x114",
      "type": "image/png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://github.com/apple-touch-icon-120x120.png",
      "path": "/apple-touch-icon-120x120.png",
      "size": "120x120",
      "type": "image/png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://github.com/apple-touch-icon-144x144.png",
      "path": "/apple-touch-icon-144x144.png",
      "size": "144x144",
      "type": "image/png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://github.com/apple-touch-icon-152x152.png",
      "path": "/apple-touch-icon-152x152.png",
      "size": "152x152",
      "type": "image/png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://github.com/apple-touch-icon-180x180.png",
      "path": "/apple-touch-icon-180x180.png",
      "size": "180x180",
      "type": "image/png",
      "refer": "apple-touch-icon"
    },
    {
      "url": "https://assets-cdn.github.com/favicon.ico",
      "path": "/favicon.ico",
      "size": "16x16",
      "type": "image/x-icon",
      "refer": "icon"
    },
    {
      "url": "https://github.com/favicon.ico",
      "path": "/favicon.ico",
      "size": "16x16",
      "type": "image/x-icon",
      "refer": "/favicon.ico"
    }
  ]
]
```

## Installation

### NPM

```sh
npm install parse-favicon
```

### Yarn

```sh
yarn add parse-favicon
```

## Related Projects

[BlackGlory/ico-size: A Node module to get dimensions of ico & cur image file](https://github.com/BlackGlory/ico-size)

## References

https://github.com/audreyr/favicon-cheat-sheet
