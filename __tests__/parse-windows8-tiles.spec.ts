import { parseWindows8Tiles } from '@src/parse-windows8-tiles'
import 'jest-extended'

describe('parseWindows8Tiles(html: string): Icon[]', () => {
  it('return Icon[] ', () => {
    const html = `
      <meta name="msapplication-TitleImage" content>
      <meta name="msapplication-TitleImage" content="path/to/icon.png">
    `

    const result = parseWindows8Tiles(html)

    expect(result).toIncludeSameMembers([
      {
        url: 'path/to/icon.png'
      , reference: 'msapplication-TitleImage'
      , type: undefined
      , size: undefined
      }
    ])
  })
})
