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

  let parseFavicon: (html: string, options?: ParseOptions, ignoreException?: boolean) => PromiseLike<IconInfo[]>

  export default parseFavicon
}
