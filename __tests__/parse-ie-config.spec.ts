import { getErrorAsync } from 'return-style'
import { dedent } from 'extra-tags'
import { parseIEConfig } from '@src/parse-ie-config'
import '@blackglory/jest-matchers'
import 'jest-extended'

describe('parseIEConfig(html: string, fetcher: Fetcher): Promise<Icon[]>', () => {
  it('call fetcher to get resource', async () => {
    const fetcher = jest.fn(() => { throw new Error() })
    const html = `
      <meta name="msapplication-config" content="path/to/ieconfig.xml">
    `

    getErrorAsync(() => parseIEConfig(html, fetcher))

    expect(fetcher).toBeCalledTimes(1)
    expect(fetcher).toBeCalledWith('path/to/ieconfig.xml')
  })

  describe('config cannot fetch', () => {
    it('return []', async () => {
      const fetcher = () => { throw new Error() }
      const html = `
        <meta name="msapplication-config" content="path/to/ieconfig.xml">
      `

      const result = parseIEConfig(html, fetcher)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toEqual([])
    })
  })

  describe('config can fetch', () => {
    describe('square70x70logo', () => {
      it('return Icon[]', async () => {
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

        const result = parseIEConfig(html, async () => config)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toIncludeSameMembers([
          {
            url: 'path/to/path/to/icon.png'
          , reference: 'msapplication-config'
          , type: null
          , size: { width: 70, height: 70 }
          }
        ])
      })
    })

    describe('square150x150logo', () => {
      it('return Icon[]', async () => {
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

        const result = parseIEConfig(html, async () => config)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toIncludeSameMembers([
          {
            url: 'path/to/path/to/icon.png'
          , reference: 'msapplication-config'
          , type: null
          , size: { width: 150, height: 150 }
          }
        ])
      })
    })

    describe('wide310x150logo', () => {
      it('return Icon[]', async () => {
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

        const result = parseIEConfig(html, async () => config)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toIncludeSameMembers([
          {
            url: 'path/to/path/to/icon.png'
          , reference: 'msapplication-config'
          , type: null
          , size: { width: 310, height: 150 }
          }
        ])
      })
    })

    describe('square310x310logo', () => {
      it('return Icon[]', async () => {
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

        const result = parseIEConfig(html, async () => config)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toIncludeSameMembers([
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
})
