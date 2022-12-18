import { parseIE11Tiles } from '@src/parse-ie11-tiles'

describe('parseIE11Tiles(html: string): Icon[]', () => {
  describe('square70x70logo', () => {
    it('return Icon[]', () => {
      const html = `
        <meta name="msapplication-square70x70logo" content>
        <meta name="msapplication-square70x70logo" content="path/to/icon.png">
      `

      const result = parseIE11Tiles(html)

      expect(result).toMatchObject([
        {
          url: 'path/to/icon.png'
        , reference: 'msapplication-square70x70logo'
        , size: { width: 70, height: 70 }
        , type: null
        }
      ])
    })
  })

  describe('square150x150logo', () => {
    it('return Icon[]', () => {
      const html = `
        <meta name="msapplication-square150x150logo" content>
        <meta name="msapplication-square150x150logo" content="path/to/icon.png">
      `

      const result = parseIE11Tiles(html)

      expect(result).toMatchObject([
        {
          url: 'path/to/icon.png'
        , reference: 'msapplication-square150x150logo'
        , size: { width: 150, height: 150 }
        , type: null
        }
      ])
    })
  })

  describe('square310x310logo', () => {
    it('return Icon[]', () => {
      const html = `
        <meta name="msapplication-square310x310logo" content>
        <meta name="msapplication-square310x310logo" content="path/to/icon.png">
      `

      const result = parseIE11Tiles(html)

      expect(result).toMatchObject([
        {
          url: 'path/to/icon.png'
        , reference: 'msapplication-square310x310logo'
        , size: { width: 310, height: 310 }
        , type: null
        }
      ])
    })
  })

  describe('wide310x150logo', () => {
    it('return Icon[]', () => {
      const html = `
        <meta name="msapplication-wide310x150logo" content>
        <meta name="msapplication-wide310x150logo" content="path/to/icon.png">
      `

      const result = parseIE11Tiles(html)

      expect(result).toMatchObject([
        {
          url: 'path/to/icon.png'
        , reference: 'msapplication-wide310x150logo'
        , size: { width: 310, height: 150 }
        , type: null
        }
      ])
    })
  })
})
