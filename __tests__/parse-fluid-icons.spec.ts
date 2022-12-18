import { parseFluidIcons } from '@src/parse-fluid-icons'

describe('parseFluidIcons(html: string): Icon[]', () => {
  describe('basic', () => {
    it('return Icon[]', () => {
      const html = `
        <link rel="fluid-icon" href>
        <link rel="fluid-icon" href="path/to/icon.png">
      `

      const result = parseFluidIcons(html)

      expect(result).toMatchObject([
        {
          url: 'path/to/icon.png'
        , reference: 'fluid-icon'
        , type: null
        , size: null
        }
      ])
    })
  })

  describe('type', () => {
    it('return Icon[]', () => {
      const html = `
        <link rel="fluid-icon" type href="path/to/icon-1.png">
        <link rel="fluid-icon" type="image/png" href="path/to/icon-2.png">
      `

      const result = parseFluidIcons(html)

      expect(result).toMatchObject([
        {
          url: 'path/to/icon-1.png'
        , reference: 'fluid-icon'
        , type: null
        , size: null
        }
      , {
          url: 'path/to/icon-2.png'
        , reference: 'fluid-icon'
        , type: 'image/png'
        , size: null
        }
      ])
    })
  })

  describe('size', () => {
    it('return Icon[]', () => {
      const html = `
        <link rel="fluid-icon" sizes href="path/to/icon-1.png">
        <link rel="fluid-icon" sizes="size" href="path/to/icon-2.png">
        <link rel="fluid-icon" sizes="128x128" href="path/to/icon-3.png">
        <link rel="fluid-icon" sizes="128x128 256x256" href="path/to/icon-4.png">
      `

      const result = parseFluidIcons(html)

      expect(result).toMatchObject([
        {
          url: 'path/to/icon-1.png'
        , reference: 'fluid-icon'
        , type: null
        , size: null
        }
      , {
          url: 'path/to/icon-2.png'
        , reference: 'fluid-icon'
        , type: null
        , size: null
        }
      , {
          url: 'path/to/icon-3.png'
        , reference: 'fluid-icon'
        , type: null
        , size: { width: 128, height: 128 }
        }
      , {
          url: 'path/to/icon-4.png'
        , reference: 'fluid-icon'
        , type: null
        , size: [{ width: 128, height: 128 }, { width: 256, height: 256 }]
        }
      ])
    })
  })
})
