import { isSuccess } from 'return-style'
import { isString } from '@blackglory/prelude'

export function isURLString(val: unknown): boolean {
  const base = 'http://localhost'
  return isString(val)
      && isSuccess(() => new URL(val.toString(), base))
}
