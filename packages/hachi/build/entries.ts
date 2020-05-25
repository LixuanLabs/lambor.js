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

  const hasRuntimeConfig =
    Object.keys(config.publicRuntimeConfig).length > 0 ||
    Object.keys(config.serverRuntimeConfig).length > 0

  const defaultServerlessOptions = {
    absoluteAppPath: pages['/_app'],
    absoluteDocumentPath: pages['/_document'],
    absoluteErrorPath: pages['/_error'],
    distDir: DOT_NEXT_ALIAS,
    assetPrefix: config.assetPrefix,
    generateEtags: config.generateEtags,
    canonicalBase: config.canonicalBase,
    basePath: config.experimental.basePath,
    runtimeConfig: hasRuntimeConfig
      ? JSON.stringify({
          publicRuntimeConfig: config.publicRuntimeConfig,
          serverRuntimeConfig: config.serverRuntimeConfig,
        })
      : '',
  }

  Object.keys(pages).forEach((page) => {
    const absolutePagePath = pages[page]
    const bundleFile = absolutePagePath
    const isApiRoute = page.match(API_ROUTE)

    const bundlePath = join('static', 'pages', bundleFile)

    if (isApiRoute || target === 'server') {
      server[bundlePath] = [absolutePagePath]
    } 

    if (page === '/_document') {
      return
    }

    if (!isApiRoute) {
      const pageLoaderOpts = {
        page,
        absolutePagePath,
      }
      const pageLoader = `next-client-pages-loader?${stringify(
        pageLoaderOpts
      )}!`

      // Make sure next/router is a dependency of _app or else granularChunks
      // might cause the router to not be able to load causing hydration
      // to fail

      client[bundlePath] =
        page === '/_app'
          ? [pageLoader, require.resolve('../client/router')]
          : pageLoader
    }
  })

  return {
    client,
    server,
  }
}
