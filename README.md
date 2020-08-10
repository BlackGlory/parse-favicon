# parse-favicon [![npm](https://img.shields.io/npm/v/parse-favicon.svg?maxAge=86400)](https://www.npmjs.com/package/parse-favicon) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/parse-favicon/master/LICENSE)

Parse HTML to get icon information.

## Install

```sh
npm install --save parse-favicon
# or
yarn add parse-favicon
```

## Usage

```js
import { parseFavicon } from 'parse-favicon'

const pageUrl = 'https://github.com'

parseFavicion(pageUrl, textFetcher, bufferFetcher).subscribe(icon => console.log(icon))

async function textFetcher(url) {
  return await fetch(resolveUrl(url, pageUrl)).then(res => res.text())
}

async function bufferFetcher(url) {
  return await fetch(resolveUrl(url, pageUrl)).then(res => res.arrayBuffer())
}

function resolveUrl(url, base) {
  return new URL(url, base).href
}
```

## API

### parseFavicon

```ts
parseFavicon(
  url: string
, textFetcher: TextFetcher
, bufferFetcher?: BufferFetcher
): Observable<Icon>

type TextFetcher = (url: string) => PromiseLike<string>
type BufferFetcher = (url: string) => PromiseLike<ArrayBuffer>

interface Icon {
  url: string
  reference: string
  type: undefined | string
  size: undefined | 'any' | Size | Size[]
}

type Size = {
  width: number
  height: number
}
```

`parseFavicon` accepts `textFetcher` and `bufferFetcher` for further fetching requests when parsing icons, bufferFetcher is optional.
If you need actual icon sizes and type, should provide `bufferFetcher`.

References related to `textFetcher`:
* `msapplication-config`
* `manifest`

References related to `bufferFetcher`:
* `/favicon.ico`
* `/apple-touch-icon-57x57-precomposed.png`
* `/apple-touch-icon-57x57.png`
* `/apple-touch-icon-72x72-precomposed.png`
* `/apple-touch-icon-72x72.png`
* `/apple-touch-icon-114x114-precomposed.png`
* `/apple-touch-icon-114x114.png`
* `/apple-touch-icon-120x120-precomposed.png`
* `/apple-touch-icon-120x120.png`
* `/apple-touch-icon-144x144-precomposed.png`
* `/apple-touch-icon-144x144.png`
* `/apple-touch-icon-152x152-precomposed.png`
* `/apple-touch-icon-152x152.png`
* `/apple-touch-icon-180x180-precomposed.png`
* `/apple-touch-icon-180x180.png`
* `/apple-touch-icon-precomposed.png`
* `/apple-touch-icon.png`

## Support Icon References

* `<link rel="icon" href="path/to/icon.png">`
* `<link rel="shortcut icon" href="path/to/icon.ico">`
* `<link rel="apple-touch-icon" href="path/to/icon.png">`
* `<link rel="apple-touch-icon-precomposed" href="path/to/icon.png">`
* `<link rel="manifest" href="path/to/manifest.webmanifest">`
* `<link rel="fluid-icon" href="path/to/icon.png">`
* `<link rel="mask-icon" href="path/to/icon.svg">`
* `<meta name="msapplication-TitleImage" content="path/to/icon.png">`
* `<meta name="msapplication-config" content="path/to/ieconfig.xml">`
* `<meta name="msapplication-square70x70logo" content="path/to/icon.png">`
* `<meta name="msapplication-square150x150logo" content="path/to/icon.png">`
* `<meta name="msapplication-square310x310logo" content="path/to/icon.png">`
* `<meta name="msapplication-wide310x150logo" content="path/to/icon.png">`
* `/favicon.ico`
* `/apple-touch-icon-57x57-precomposed.png`
* `/apple-touch-icon-57x57.png`
* `/apple-touch-icon-72x72-precomposed.png`
* `/apple-touch-icon-72x72.png`
* `/apple-touch-icon-114x114-precomposed.png`
* `/apple-touch-icon-114x114.png`
* `/apple-touch-icon-120x120-precomposed.png`
* `/apple-touch-icon-120x120.png`
* `/apple-touch-icon-144x144-precomposed.png`
* `/apple-touch-icon-144x144.png`
* `/apple-touch-icon-152x152-precomposed.png`
* `/apple-touch-icon-152x152.png`
* `/apple-touch-icon-180x180-precomposed.png`
* `/apple-touch-icon-180x180.png`
* `/apple-touch-icon-precomposed.png`
* `/apple-touch-icon.png`

## Related projects

* [favicon-detector: A simple way to detect website icons.](https://github.com/BlackGlory/favicon-detector):
