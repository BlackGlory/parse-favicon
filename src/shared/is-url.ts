import { isSuccess } from 'return-style'
import { isString } from '@blackglory/types'

export function isUrl(val: unknown): boolean {
  const base = 'http://localhost'
  return isString(val) && isSuccess(() => new URL(val.toString(), base))
}
