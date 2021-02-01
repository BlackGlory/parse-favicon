export interface Icon {
  url: string
  reference: string
  type: null | string
  size: null | 'any' | Size | Size[]
}

export interface Image {
  type: string
  size: 'any' | Size | Size[]
}

export type TextFetcher = (url: string) => PromiseLike<string>
export type BufferFetcher = (url: string) => PromiseLike<ArrayBuffer>

export interface Size {
  width: number
  height: number
}
