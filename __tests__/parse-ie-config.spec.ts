import { getErrorAsync } from 'return-style'
import { dedent } from 'extra-tags'
import { parseIEConfig } from '@src/parse-ie-config.js'
import { jest } from '@jest/globals'

describe('parseIEConfig', () => {
  it('call fetcher to get resource', async () => {
    const fetcher = jest.fn(() => { throw new Error() })
    const html = `
      <meta name="msapplication-config" content="path/to/ieconfig.xml">
    `

    getErrorAsync(() => parseIEConfig(html, fetcher))

    expect(fetcher).toBeCalledTimes(1)
    expect(fetcher).toBeCalledWith('path/to/ieconfig.xml')
  })

  test('config cannot fetch', async () => {
    const fetcher = () => { throw new Error() }
    const html = `
      <meta name="msapplication-config" content="path/to/ieconfig.xml">
    `

    const result = await parseIEConfig(html, fetcher)

    expect(result).toEqual([])
  })

  describe('config can fetch', () => {
    test('square70x70logo', async () => {
      const html = `
        <meta name="msapplication-config" content="path/to/ieconfig.xml">
      `
      const config = dedent`
        <?xml version="1.0" encoding="utf-8"?>
        <browserconfig>
          <msapplication>
            <tile>
              <square70x70logo/>
              <square70x70logo src="path/to/icon.png"/>
            </tile>
          </msapplication>
        </browserconfig>
      `

      const result = await parseIEConfig(html, () => config)

      expect(result).toMatchObject([
        {
          url: 'path/to/path/to/icon.png'
        , reference: 'msapplication-config'
        , type: null
        , size: { width: 70, height: 70 }
        }
      ])
    })

    test('square150x150logo', async () => {
      const html = `
        <meta name="msapplication-config" content="path/to/ieconfig.xml">
      `
      const config = dedent`
        <?xml version="1.0" encoding="utf-8"?>
        <browserconfig>
          <msapplication>
            <tile>
              <square150x150logo/>
              <square150x150logo src="path/to/icon.png"/>
            </tile>
          </msapplication>
        </browserconfig>
      `

      const result = await parseIEConfig(html, () => config)

      expect(result).toMatchObject([
        {
          url: 'path/to/path/to/icon.png'
        , reference: 'msapplication-config'
        , type: null
        , size: { width: 150, height: 150 }
        }
      ])
    })

    test('wide310x150logo', async () => {
      const html = `
        <meta name="msapplication-config" content="path/to/ieconfig.xml">
      `
      const config = dedent`
        <?xml version="1.0" encoding="utf-8"?>
        <browserconfig>
          <msapplication>
            <tile>
              <wide310x150logo/>
              <wide310x150logo src="path/to/icon.png"/>
            </tile>
          </msapplication>
        </browserconfig>
      `

      const result = await parseIEConfig(html, () => config)

      expect(result).toMatchObject([
        {
          url: 'path/to/path/to/icon.png'
        , reference: 'msapplication-config'
        , type: null
        , size: { width: 310, height: 150 }
        }
      ])
    })

    test('square310x310logo', async () => {
      const html = `
        <meta name="msapplication-config" content="path/to/ieconfig.xml">
      `
      const config = dedent`
        <?xml version="1.0" encoding="utf-8"?>
        <browserconfig>
          <msapplication>
            <tile>
              <square310x310logo/>
              <square310x310logo src="path/to/icon.png"/>
            </tile>
          </msapplication>
        </browserconfig>
      `

      const result = await parseIEConfig(html, () => config)

      expect(result).toMatchObject([
        {
          url: 'path/to/path/to/icon.png'
        , reference: 'msapplication-config'
        , type: null
        , size: { width: 310, height: 310 }
        }
      ])
    })
  })
})
