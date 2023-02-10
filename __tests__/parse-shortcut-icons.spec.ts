import { parseShortcutIcons } from '@src/parse-shortcut-icons.js'

describe('parseShortcutIcons', () => {
  test('basic', () => {
    const html = `
      <link rel="shortcut icon" href>
      <link rel="shortcut icon" href="path/to/icon.ico">
    `

    const result = parseShortcutIcons(html)

    expect(result).toMatchObject([
      {
        url: 'path/to/icon.ico'
      , reference: 'shortcut-icon'
      , size: null
      , type: null
      }
    ])
  })

  test('type', () => {
    const html = `
      <link rel="shortcut icon" type href="path/to/icon-1.png">
      <link rel="shortcut icon" type="image/ico" href="path/to/icon-2.ico">
    `

    const result = parseShortcutIcons(html)

    expect(result).toMatchObject([
      {
        url: 'path/to/icon-1.png'
      , reference: 'shortcut-icon'
      , size: null
      , type: null
      }
    , {
        url: 'path/to/icon-2.ico'
      , reference: 'shortcut-icon'
      , size: null
      , type: 'image/ico'
      }
    ])
  })

  test('sizes', () => {
    const html = `
      <link rel="shortcut icon" sizes href="path/to/icon-1.ico">
      <link rel="shortcut icon" sizes="size" href="path/to/icon-2.ico">
      <link rel="shortcut icon" sizes="16x16" href="path/to/icon-3.ico">
      <link rel="shortcut icon" sizes="16x16 32x32" href="path/to/icon-4.icns">
      <link rel="shortcut icon" sizes="any" href="path/to/icon-5.svg">
    `

    const result = parseShortcutIcons(html)

    expect(result).toMatchObject([
      {
        url: 'path/to/icon-1.ico'
      , reference: 'shortcut-icon'
      , size: null
      , type: null
      }
    , {
        url: 'path/to/icon-2.ico'
      , reference: 'shortcut-icon'
      , size: null
      , type: null
      }
    , {
        url: 'path/to/icon-3.ico'
      , reference: 'shortcut-icon'
      , size: { width: 16, height: 16 }
      , type: null
      }
    , {
        url: 'path/to/icon-4.icns'
      , reference: 'shortcut-icon'
      , size: [{ width: 16, height: 16 }, { width: 32, height: 32 }]
      , type: null
      }
    , {
        url: 'path/to/icon-5.svg'
      , reference: 'shortcut-icon'
      , size: 'any'
      , type: null
      }
    ])
  })
})
