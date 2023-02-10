# parse-favicon
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

parseFavicon(pageUrl, textFetcher, bufferFetcher)
  .subscribe(icon => console.log(icon))

function textFetcher(url: string): Promise<string> {
  return fetch(resolveURL(url, pageUrl))
    .then(res => res.text())
}

function bufferFetcher(url: string): Promise<ArrayBuffer> {
  return fetch(resolveURL(url, pageUrl))
    .then(res => res.arrayBuffer())
}

function resolveURL(url: string, base: string): string {
  return new URL(url, base).href
}
```

## API
### parseFavicon
```ts
type TextFetcher = (url: string) => PromiseLike<string>
type BufferFetcher = (url: string) => PromiseLike<ArrayBuffer>

interface IIcon {
  url: string
  reference: string
  type: null | string
  size: null | 'any' | ISize | ISize[]
}

interface ISize {
  width: number
  height: number
}

function parseFavicon(
  url: string
, textFetcher: TextFetcher
, bufferFetcher?: BufferFetcher
): Observable<IIcon>
```

`parseFavicon` accepts `textFetcher` and `bufferFetcher` for further fetching requests when parsing icons, bufferFetcher is optional.
If you need actual icon sizes and type, should provide `bufferFetcher`.

References related to `textFetcher`:
- `<meta name="msapplication-config" content="path/to/ieconfig.xml">`
- `<link rel="manifest" href="path/to/manifest.webmanifest">`

References related to `bufferFetcher`:
- `/favicon.ico`
- `/apple-touch-icon-57x57-precomposed.png`
- `/apple-touch-icon-57x57.png`
- `/apple-touch-icon-72x72-precomposed.png`
- `/apple-touch-icon-72x72.png`
- `/apple-touch-icon-114x114-precomposed.png`
- `/apple-touch-icon-114x114.png`
- `/apple-touch-icon-120x120-precomposed.png`
- `/apple-touch-icon-120x120.png`
- `/apple-touch-icon-144x144-precomposed.png`
- `/apple-touch-icon-144x144.png`
- `/apple-touch-icon-152x152-precomposed.png`
- `/apple-touch-icon-152x152.png`
- `/apple-touch-icon-180x180-precomposed.png`
- `/apple-touch-icon-180x180.png`
- `/apple-touch-icon-precomposed.png`
- `/apple-touch-icon.png`

## Support references
- `<link rel="icon" href="path/to/icon.png">`
- `<link rel="shortcut icon" href="path/to/icon.ico">`
- `<link rel="apple-touch-icon" href="path/to/icon.png">`
- `<link rel="apple-touch-icon-precomposed" href="path/to/icon.png">`
- `<link rel="manifest" href="path/to/manifest.webmanifest">`
- `<link rel="fluid-icon" href="path/to/icon.png">`
- `<link rel="mask-icon" href="path/to/icon.svg">`
- `<meta name="msapplication-TileImage" content="path/to/icon.png">`
- `<meta name="msapplication-config" content="path/to/ieconfig.xml">`
- `<meta name="msapplication-square70x70logo" content="path/to/icon.png">`
- `<meta name="msapplication-square150x150logo" content="path/to/icon.png">`
- `<meta name="msapplication-square310x310logo" content="path/to/icon.png">`
- `<meta name="msapplication-wide310x150logo" content="path/to/icon.png">`
- `/favicon.ico`
- `/apple-touch-icon-57x57-precomposed.png`
- `/apple-touch-icon-57x57.png`
- `/apple-touch-icon-72x72-precomposed.png`
- `/apple-touch-icon-72x72.png`
- `/apple-touch-icon-114x114-precomposed.png`
- `/apple-touch-icon-114x114.png`
- `/apple-touch-icon-120x120-precomposed.png`
- `/apple-touch-icon-120x120.png`
- `/apple-touch-icon-144x144-precomposed.png`
- `/apple-touch-icon-144x144.png`
- `/apple-touch-icon-152x152-precomposed.png`
- `/apple-touch-icon-152x152.png`
- `/apple-touch-icon-180x180-precomposed.png`
- `/apple-touch-icon-180x180.png`
- `/apple-touch-icon-precomposed.png`
- `/apple-touch-icon.png`

## Related projects
- [favicon-detector](https://github.com/BlackGlory/favicon-detector)
