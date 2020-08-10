import { isSuccess } from 'return-style'
import { isString } from '@shared/is-string'

export function isUrl(val: unknown): boolean {
  const base = 'http://localhost'
  return isString(val) && isSuccess(() => new URL(val, base))
}
