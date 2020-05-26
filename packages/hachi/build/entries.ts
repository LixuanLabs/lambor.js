import chalk from 'chalk'
import { join } from 'path'
import { stringify } from 'querystring'
import { API_ROUTE, DOT_NEXT_ALIAS, PAGES_DIR_ALIAS } from '../lib/constants'


export function createPagesMapping(
  pagePaths: string[],
  extensions: string[]
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

export function createEntrypoints(
  dev,
  pages,
  target,
  config
) {
  const client = {}
  const server = {}

  Object.keys(pages).forEach((page) => {
    const absolutePagePath = pages[page]
    const bundleFile = absolutePagePath
    const isApiRoute = page.match(API_ROUTE)

    const bundlePath = join('static', 'pages', bundleFile)

    if (isApiRoute || target === 'server') {
      server[bundlePath] = [absolutePagePath]
      client[bundlePath] = [absolutePagePath]
    } 

    // if (page === '/_document') {
    //   return
    // }
  })

  return {
    client,
    server,
  }
}
