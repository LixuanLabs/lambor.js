import React from 'react'
// import {
//   loadGetInitialProps,
// } from '../../lib/utils'


/**
 * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
 * This allows for keeping state between navigation, custom error handling, injecting additional data.
 */
async function appGetInitialProps({
  Component,
  ctx,
}) {
  // const pageProps = await loadGetInitialProps(Component, ctx)
  // return { pageProps }
  return {  }
}

export default class App extends React.Component {
  // static origGetInitialProps = appGetInitialProps
  // static getInitialProps = appGetInitialProps

  // Kept here for backwards compatibility.
  // When someone ended App they could call `super.componentDidCatch`.
  // @deprecated This method is no longer needed. Errors are caught at the top level
  componentDidCatch(error, _errorInfo) {
    throw error
  }

  render() {
    const { router, Component, pageProps, __N_SSG, __N_SSP } = this.props

    return (
      <Component
        {...pageProps}
        {
          // we don't add the legacy URL prop if it's using non-legacy
          // methods like getStaticProps and getServerSideProps
          ...(!(__N_SSG || __N_SSP) ? { url: createUrl(router) } : {})
        }
      />
    )
  }
}

let warnContainer
let warnUrl

if (process.env.NODE_ENV !== 'production') {
  warnContainer = () => {
    console.warn(
      `Warning: the \`Container\` in \`_app\` has been deprecated and should be removed. https://err.sh/zeit/next.js/app-container-deprecated`
    )
  }

  warnUrl = () => {
    console.error(
      `Warning: the 'url' property is deprecated. https://err.sh/zeit/next.js/url-deprecated`
    )
  }
}

// @deprecated noop for now until removal
export function Container(p) {
  if (process.env.NODE_ENV !== 'production') warnContainer()
  return p.children
}

export function createUrl(router) {
  // This is to make sure we don't references the router object at call time
  const { pathname, asPath, query } = router
  return {
    get query() {
      if (process.env.NODE_ENV !== 'production') warnUrl()
      return query
    },
    get pathname() {
      if (process.env.NODE_ENV !== 'production') warnUrl()
      return pathname
    },
    get asPath() {
      if (process.env.NODE_ENV !== 'production') warnUrl()
      return asPath
    },
    back: () => {
      if (process.env.NODE_ENV !== 'production') warnUrl()
      router.back()
    },
    push: (url, as) => {
      if (process.env.NODE_ENV !== 'production') warnUrl()
      return router.push(url, as)
    },
    pushTo: (href, as) => {
      if (process.env.NODE_ENV !== 'production') warnUrl()
      const pushRoute = as ? href : ''
      const pushUrl = as || href

      return router.push(pushRoute, pushUrl)
    },
    replace: (url, as) => {
      if (process.env.NODE_ENV !== 'production') warnUrl()
      return router.replace(url, as)
    },
    replaceTo: (href, as) => {
      if (process.env.NODE_ENV !== 'production') warnUrl()
      const replaceRoute = as ? href : ''
      const replaceUrl = as || href

      return router.replace(replaceRoute, replaceUrl)
    },
  }
}
