import { parseMaskIcons } from '@src/parse-mask-icons'
import 'jest-extended'

describe('parseMackIcons(html: string): Icon[]', () => {
  describe('basic', () => {
    it('return Icon[]', () => {
      const html = `
        <link rel="mask-icon" href>
        <link rel="mask-icon" href="path/to/icon.svg">
      `

      const result = parseMaskIcons(html)

      expect(result).toIncludeSameMembers([
        {
          url: 'path/to/icon.svg'
        , reference: 'mask-icon'
        , type: null
        , size: null
        }
      ])
    })
  })

  describe('type', () => {
    it('return Icon[]', () => {
      const html = `
        <link rel="mask-icon" type href="path/to/icon-1.svg">
        <link rel="mask-icon" type="image/svg+xml" href="path/to/icon-2.svg">
      `

      const result = parseMaskIcons(html)

      expect(result).toIncludeSameMembers([
        {
          url: 'path/to/icon-1.svg'
        , reference: 'mask-icon'
        , type: null
        , size: null
        }
      , {
          url: 'path/to/icon-2.svg'
        , reference: 'mask-icon'
        , type: 'image/svg+xml'
        , size: null
        }
      ])
    })
  })

  describe('size', () => {
    it('return Icon[]', () => {
      const html = `
        <link rel="mask-icon" sizes href="path/to/icon-1.svg">
        <link rel="mask-icon" sizes="size" href="path/to/icon-2.svg">
        <link rel="mask-icon" sizes="128x128" href="path/to/icon-3.svg">
        <link rel="mask-icon" sizes="128x128 256x256" href="path/to/icon-4.svg">
        <link rel="mask-icon" sizes="any" href="path/to/icon-5.svg">
      `

      const result = parseMaskIcons(html)

      expect(result).toIncludeSameMembers([
        {
          url: 'path/to/icon-1.svg'
        , reference: 'mask-icon'
        , type: null
        , size: null
        }
      , {
          url: 'path/to/icon-2.svg'
        , reference: 'mask-icon'
        , type: null
        , size: null
        }
      , {
          url: 'path/to/icon-3.svg'
        , reference: 'mask-icon'
        , type: null
        , size: { width: 128, height: 128 }
        }
      , {
          url: 'path/to/icon-4.svg'
        , reference: 'mask-icon'
        , type: null
        , size: [{ width: 128, height: 128 }, { width: 256, height: 256 }]
        }
      , {
          url: 'path/to/icon-5.svg'
        , reference: 'mask-icon'
        , type: null
        , size: 'any'
        }
      ])
    })
  })
})
