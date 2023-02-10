import { parseWindows8Tiles } from '@src/parse-windows8-tiles.js'

test('parseWindows8Tiles', () => {
  const html = `
    <meta name="msapplication-TileImage" content>
    <meta name="msapplication-TileImage" content="path/to/icon.png">
  `

  const result = parseWindows8Tiles(html)

  expect(result).toMatchObject([
    {
      url: 'path/to/icon.png'
    , reference: 'msapplication-TileImage'
    , type: null
    , size: null
    }
  ])
})
