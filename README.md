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

const pageURL = 'https://github.com'

parseFavicon(pageURL, fetchText, fetchBuffer)
  .subscribe(icon => console.log(icon))

function fetchText(url: string): Promise<string> {
  return fetch(url)
    .then(res => res.text())
}

function fetchBuffer(url: string): Promise<ArrayBuffer> {
  return fetch(url)
    .then(res => res.arrayBuffer())
}
```

## API
### parseFavicon
```ts
type TextFetcher = (url: string) => Awaitable<string> // string | PromiseLike<string>
type BufferFetcher = (url: string) => Awaitable<ArrayBuffer> // ArrayBuffer | PromiseLike<ArrayBuffer>

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
  pageURL: string
, textFetcher: TextFetcher
, bufferFetcher?: BufferFetcher
): Observable<IIcon>
```

`parseFavicon` accepts `textFetcher` and `bufferFetcher` for further fetching requests when parsing icons, `bufferFetcher` is optional.
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

## Supported references
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
