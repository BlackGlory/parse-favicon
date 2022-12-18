import { parseIcons } from '@src/parse-icons'

describe('parseIcons(html: string): Icon[]', () => {
  describe('basic', () => {
    it('return Icon[]', () => {
      const html = `
        <link rel="icon" href>
        <link rel="icon" href="path/to/icon.png">
      `

      const result = parseIcons(html)

      expect(result).toMatchObject([
        {
          url: 'path/to/icon.png'
        , reference: 'icon'
        , size: null
        , type: null
        }
      ])
    })
  })

  describe('type', () => {
    it('return Icon[]', () => {
      const html = `
        <link rel="icon" type href="path/to/icon-1.png">
        <link rel="icon" type="image/svg+xml" href="path/to/icon-2.svg">
      `

      const result = parseIcons(html)

      expect(result).toMatchObject([
        {
          url: 'path/to/icon-1.png'
        , reference: 'icon'
        , type: null
        , size: null
        }
      , {
          url: 'path/to/icon-2.svg'
        , reference: 'icon'
        , size: null
        , type: 'image/svg+xml'
        }
      ])
    })
  })

  describe('sizes', () => {
    it('return Icon[]', () => {
      const html = `
        <link rel="icon" sizes href="path/to/icon-1.png">
        <link rel="icon" sizes="size" href="path/to/icon-2.png">
        <link rel="icon" sizes="72x72" href="path/to/icon-3.png">
        <link rel="icon" sizes="72x72 144x144" href="path/to/icon-4.png">
        <link rel="icon" sizes="any" href="path/to/icon-5.svg">
      `

      const result = parseIcons(html)

      expect(result).toMatchObject([
        {
          url: 'path/to/icon-1.png'
        , reference: 'icon'
        , size: null
        , type: null
        }
      , {
          url: 'path/to/icon-2.png'
        , reference: 'icon'
        , size: null
        , type: null
        }
      , {
          url: 'path/to/icon-3.png'
        , reference: 'icon'
        , size: { width: 72, height: 72 }
        , type: null
        }
      , {
          url: 'path/to/icon-4.png'
        , reference: 'icon'
        , size: [{ width: 72, height: 72 }, { width: 144, height: 144 }]
        , type: null
        }
      , {
          url: 'path/to/icon-5.svg'
        , reference: 'icon'
        , size: 'any'
        , type: null
        }
      ])
    })
  })
})
