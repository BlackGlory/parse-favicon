import { isPromise } from 'extra-promise'

/* eslint-disable */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeIterable(): R
      toBeAsyncIterable(): R
      toBePromise(): R
    }
  }
}
/* eslint-enable */

expect.extend({
  toBePromise(received: unknown) {
    if (isPromise(received)) {
      return {
        message: () => `expected ${received} not to be a Promise`
      , pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a Promise`
      , pass: false
      }
    }
  }
})
