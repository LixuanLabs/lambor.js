import { RawSource } from 'webpack-sources'
import {
  PAGES_MANIFEST,
  ROUTE_NAME_REGEX,
  SERVERLESS_ROUTE_NAME_REGEX,
} from '../../lib/constants'

// This plugin creates a pages-manifest.json from page entrypoints.
// This is used for mapping paths like `/` to `.next/server/static/<buildid>/pages/index.js` when doing SSR
// It's also used by next export to provide defaultPathMap
export default class PagesManifestPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('HachiPagesManifest', (compilation) => {
      const { chunks } = compilation
      const pages = {}
      
      for (const chunk of chunks) {
        const result = ROUTE_NAME_REGEX.exec(chunk.name)

        if (!result) {
          continue
        }

        const pagePath = result[1]

        if (!pagePath) {
          continue
        }
        if (pages[`/${pagePath.replace(/\\/g, '/')}`]) {
          pages[`/${pagePath.replace(/\\/g, '/')}`].push(chunk.name.replace(
            /\\/g,
            '/'
          ) + '.js')
        } else {
          pages[`/${pagePath.replace(/\\/g, '/')}`] = [chunk.name.replace(
            /\\/g,
            '/'
          ) + '.js'];

        }
      }

      if (typeof pages['/index'] !== 'undefined') {
        pages['/'] = pages['/index']
      }

      compilation.assets[PAGES_MANIFEST] = new RawSource(JSON.stringify(pages))
    })
  }
}
