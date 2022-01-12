import chalk from 'chalk'
import { join } from 'path'
import { PAGES_DIR_ALIAS } from '../lib/constants'


export function createPagesMapping(
  pagePaths,
  extensions
) {
  const previousPages = {}
  const pages = pagePaths.reduce(
    (result, pagePath) => {
      let page = `${pagePath
        .replace(new RegExp(`\\.+(${extensions.join('|')})$`), '')
        .replace(/\\/g, '/')}`.replace(/\/index$/, '')
      page = page === '/index' ? '/' : page

      const pageKey = page === '' ? '/' : page

      if (pageKey in result) {
        warn(
          `Duplicate page detected. ${chalk.cyan(
            join('pages', previousPages[pageKey])
          )} and ${chalk.cyan(
            join('pages', pagePath)
          )} both resolve to ${chalk.cyan(pageKey)}.`
        )
      } else {
        previousPages[pageKey] = pagePath
      }
      result[pageKey] = join(PAGES_DIR_ALIAS, pagePath).replace(/\\/g, '/')
      return result
    },
    {}
  )

  pages['/_app'] = pages['/_app'] || 'next/dist/pages/_app'
  pages['/_error'] = pages['/_error'] || 'next/dist/pages/_error'
  pages['/_document'] = pages['/_document'] || 'next/dist/pages/_document'

  return pages
}

export function createEntrypoints({dev}) {
  const dynamicEntry = {};
  // for (const url in mappedPages) {
  //   if (BLOCKED_PAGES_REG.test(url)) {
  //     dynamicEntry[url] = mappedPages[url];
  //   }
  // }
  if (dev) {
    return {
      client: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true', join(__dirname, '../client/index.js')],
      server: {
        server: [join(__dirname, '../server/ssr.js')],
        ...dynamicEntry
      }
    }
  }
  
  return {
    client: {
      client: [join(__dirname, '../client/index.js')]
    },
    server: {
      server: join(__dirname, '../server/ssr.js'),
      ...dynamicEntry
    }
  }
}
