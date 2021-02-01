import { parseAppleTouchIcons } from '@src/parse-apple-touch-icons'
import 'jest-extended'

describe('parseAppleTouchIcons(html: string): Icon[]', () => {
  describe('apple-touch-icon', () => {
    describe('basic', () => {
      it('return Icon[]', () => {
        const html = `
          <link rel="apple-touch-icon" href>
          <link rel="apple-touch-icon" href="path/to/icon.png">
        `

        const result = parseAppleTouchIcons(html)

        expect(result).toIncludeSameMembers([
          {
            url: 'path/to/icon.png'
          , reference: 'apple-touch-icon'
          , size: null
          , type: null
          }
        ])
      })
    })

    describe('type', () => {
      it('return Icon[]', () => {
        const html = `
          <link rel="apple-touch-icon" type href="path/to/icon-1.png">
          <link rel="apple-touch-icon" type="image/png" href="path/to/icon-2.png">
        `

        const result = parseAppleTouchIcons(html)

        expect(result).toIncludeSameMembers([
          {
            url: 'path/to/icon-1.png'
          , reference: 'apple-touch-icon'
          , type: null
          , size: null
          }
        , {
            url: 'path/to/icon-2.png'
          , reference: 'apple-touch-icon'
          , size: null
          , type: 'image/png'
          }
        ])
      })
    })

    describe('sizes', () => {
      it('return Icon[]', () => {
        const html = `
          <link rel="apple-touch-icon" sizes href="path/to/icon-1.png">
          <link rel="apple-touch-icon" sizes="size" href="path/to/icon-2.png">
          <link rel="apple-touch-icon" sizes="72x72" href="path/to/icon-3.png">
          <link rel="apple-touch-icon" sizes="72x72 144x144" href="path/to/icon-4.png">
          <link rel="apple-touch-icon" sizes="any" href="path/to/icon-5.svg">
        `

        const result = parseAppleTouchIcons(html)

        expect(result).toIncludeSameMembers([
          {
            url: 'path/to/icon-1.png'
          , reference: 'apple-touch-icon'
          , size: null
          , type: null
          }
        , {
            url: 'path/to/icon-2.png'
          , reference: 'apple-touch-icon'
          , size: null
          , type: null
          }
        , {
            url: 'path/to/icon-3.png'
          , reference: 'apple-touch-icon'
          , size: { width: 72, height: 72 }
          , type: null
          }
        , {
            url: 'path/to/icon-4.png'
          , reference: 'apple-touch-icon'
          , size: [{ width: 72, height: 72 }, { width: 144, height: 144 }]
          , type: null
          }
        , {
            url: 'path/to/icon-5.svg'
          , reference: 'apple-touch-icon'
          , size: 'any'
          , type: null
          }
        ])
      })
    })
  })

  describe('apple-touch-icon-precomposed', () => {
    describe('basic', () => {
      it('return Icon[]', () => {
        const html = `
          <link rel="apple-touch-icon-precomposed" href>
          <link rel="apple-touch-icon-precomposed" href="path/to/icon.png">
        `

        const result = parseAppleTouchIcons(html)
        expect(result).toIncludeSameMembers([
          {
            url: 'path/to/icon.png'
          , reference: 'apple-touch-icon-precomposed'
          , size: null
          , type: null
          }
        ])
      })
    })

    describe('type', () => {
      it('return Icon[]', () => {
        const html = `
          <link rel="apple-touch-icon-precomposed" type href="path/to/icon-1.png">
          <link rel="apple-touch-icon-precomposed" type="image/png" href="path/to/icon-2.png">
        `

        const result = parseAppleTouchIcons(html)
        expect(result).toIncludeSameMembers([
          {
            url: 'path/to/icon-1.png'
          , reference: 'apple-touch-icon-precomposed'
          , size: null
          , type: null
          }
        , {
            url: 'path/to/icon-2.png'
          , reference: 'apple-touch-icon-precomposed'
          , size: null
          , type: 'image/png'
          }
        ])
      })
    })

    describe('sizes', () => {
      it('return Icon[]', () => {
        const html = `
          <link rel="apple-touch-icon-precomposed" sizes href="path/to/icon-1.png">
          <link rel="apple-touch-icon-precomposed" sizes="size" href="path/to/icon-2.png">
          <link rel="apple-touch-icon-precomposed" sizes="72x72" href="path/to/icon-3.png">
          <link rel="apple-touch-icon-precomposed" sizes="72x72 144x144" href="path/to/icon-4.png">
          <link rel="apple-touch-icon-precomposed" sizes="any" href="path/to/icon-5.svg">
        `

        const result = parseAppleTouchIcons(html)

        expect(result).toIncludeSameMembers([
          {
            url: 'path/to/icon-1.png'
          , reference: 'apple-touch-icon-precomposed'
          , size: null
          , type: null
          }
        , {
            url: 'path/to/icon-2.png'
          , reference: 'apple-touch-icon-precomposed'
          , size: null
          , type: null
          }
        , {
            url: 'path/to/icon-3.png'
          , reference: 'apple-touch-icon-precomposed'
          , size: { width: 72, height: 72 }
          , type: null
          }
        , {
            url: 'path/to/icon-4.png'
          , reference: 'apple-touch-icon-precomposed'
          , size: [{ width: 72, height: 72 }, { width: 144, height: 144 }]
          , type: null
          }
        , {
            url: 'path/to/icon-5.svg'
          , reference: 'apple-touch-icon-precomposed'
          , size: 'any'
          , type: null
          }
        ])
      })
    })
  })
})
