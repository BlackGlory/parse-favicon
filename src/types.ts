import { Awaitable } from '@blackglory/prelude'

export interface IIcon {
  url: string
  reference: string
  type: null | string
  size: null | 'any' | ISize | ISize[]
}

export interface ISize {
  width: number
  height: number
}

export type TextFetcher = (url: string) => Awaitable<string>
export type BufferFetcher = (url: string) => Awaitable<ArrayBuffer>
