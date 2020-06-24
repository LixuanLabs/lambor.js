import PropTypes from 'prop-types'
import React, { Component } from 'react'

const ESCAPE_LOOKUP = {
  '&': '\\u0026',
  '>': '\\u003e',
  '<': '\\u003c',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
}

const ESCAPE_REGEX = /[&><\u2028\u2029]/g

export function htmlEscapeJsonString(str) {
  return str.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match])
}

export const DocumentComponentContext = React.createContext()


export async function middleware({ req, res }) {}

function dedupe(bundles) {
  const files = new Set()
  const kept = []

  for (const bundle of bundles) {
    if (files.has(bundle.file)) continue
    files.add(bundle.file)
    kept.push(bundle)
  }
  return kept
}

function getOptionalModernScriptVariant(path) {
  if (process.env.__NEXT_MODERN_BUILD) {
    return path.replace(/\.js$/, '.module.js')
  }
  return path
}

/**
 * `Document` component handles the initial `document` markup and renders only on the server side.
 * Commonly used for implementing server side rendering for `css-in-js` libraries.
 */
export default class Document extends Component {
  /**
   * `getInitialProps` hook returns the context object with the addition of `renderPage`.
   * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
   */
  static async getInitialProps(
    ctx
  ){
    const enhanceApp = (App) => {
      return (props) => <App {...props} />
    }

    const { html, head } = await ctx.renderPage({ enhanceApp })
    const styles = []
    return { html, head, styles }
  }

  static renderDocument(
    Document,
    props
  ) {
    return (
      <DocumentComponentContext.Provider
        value={{
          _documentProps: props,
          // In dev we invalidate the cache by appending a timestamp to the resource URL.
          // This is a workaround to fix https://github.com/zeit/next.js/issues/5860
          // TODO: remove this workaround when https://bugs.webkit.org/show_bug.cgi?id=187726 is fixed.
          _devOnlyInvalidateCacheQueryString:
            process.env.NODE_ENV !== 'production' ? '?ts=' + Date.now() : '',
        }}
      >
        <Document {...props} />
      </DocumentComponentContext.Provider>
    )
  }

  render() {
    return (
        <Html>
          <Head />
          <body>
            <Main />
            {/* <NextScript /> */}
          </body>
        </Html>
    )
  }
}

export class Html extends Component {
  static contextType = DocumentComponentContext

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    const { htmlProps } = this.context._documentProps
    return (
      <html
        {...htmlProps}
        {...this.props}
      />
    )
  }
}

export class Head extends Component {
  static contextType = DocumentComponentContext

  static propTypes = {
    nonce: PropTypes.string,
    crossOrigin: PropTypes.string,
  }


  getCssLinks() {
    const { assetPrefix, files } = this.context._documentProps
    const { _devOnlyInvalidateCacheQueryString } = this.context
    const cssFiles =
      files && files.length ? files.filter((f) => /\.css$/.test(f)) : []

    const cssLinkElements = []
    cssFiles.forEach((file) => {
      cssLinkElements.push(
        <link
          key={`${file}-preload`}
          nonce={this.props.nonce}
          rel="preload"
          href={`${assetPrefix}/_next/${encodeURI(
            file
          )}${_devOnlyInvalidateCacheQueryString}`}
          as="style"
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
        />,
        <link
          key={file}
          nonce={this.props.nonce}
          rel="stylesheet"
          href={`${assetPrefix}/_next/${encodeURI(
            file
          )}${_devOnlyInvalidateCacheQueryString}`}
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
        />
      )
    })

    return cssLinkElements.length === 0 ? null : cssLinkElements
  }

  getPreloadMainLinks() {
    const { assetPrefix, files } = this.context._documentProps
    const { _devOnlyInvalidateCacheQueryString } = this.context

    const preloadFiles =
      files && files.length
        ? files.filter((file) => {
            // `dynamicImports` will contain both `.js` and `.module.js` when
            // the feature is enabled. This clause will filter down to the
            // modern variants only.
            return file.endsWith(getOptionalModernScriptVariant('.js'))
          })
        : []

    return !preloadFiles.length
      ? null
      : preloadFiles.map((file) => (
          <link
            key={file}
            nonce={this.props.nonce}
            rel="preload"
            href={`${assetPrefix}/_next/${encodeURI(
              file
            )}${_devOnlyInvalidateCacheQueryString}`}
            as="script"
            crossOrigin={this.props.crossOrigin || process.crossOrigin}
          />
        ))
  }

  render() {
    const {
      styles,
      assetPrefix,
      page,
      headTags,
      unstable_runtimeJS,
    } = this.context._documentProps
    const disableRuntimeJS = unstable_runtimeJS === false
    const { _devOnlyInvalidateCacheQueryString } = this.context

    let { head } = this.context._documentProps
    let children = this.props.children
    // show a warning if Head contains <title> (only in development)
    if (process.env.NODE_ENV !== 'production') {
      children = React.Children.map(children, (child) => {
        const isReactHelmet = child?.props?.['data-react-helmet']
        if (child?.type === 'title' && !isReactHelmet) {
          console.warn(
            "Warning: <title> should not be used in _document.js's <Head>. https://err.sh/next.js/no-document-title"
          )
        }
        return child
      })
      if (this.props.crossOrigin)
        console.warn(
          'Warning: `Head` attribute `crossOrigin` is deprecated. https://err.sh/next.js/doc-crossorigin-deprecated'
        )
    }

    let hasAmphtmlRel = false
    let hasCanonicalRel = false

    // show warning and remove conflicting amp head tags
    head = React.Children.map(head || [], (child) => {
      if (!child) return child
      const { type, props } = child

      // non-amp mode
      if (type === 'link' && props.rel === 'amphtml') {
        hasAmphtmlRel = true
      }
      return child
    })

    // try to parse styles from fragment for backwards compat
    const curStyles = Array.isArray(styles)
      ? (styles)
      : []

    return (
      <head {...this.props}>
        {this.context._documentProps.isDevelopment && (
          <>
            <style
              data-next-hide-fouc
              dangerouslySetInnerHTML={{
                __html: `body{display:none}`,
              }}
            />
            <noscript
              data-next-hide-fouc
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `body{display:block}`,
                }}
              />
            </noscript>
          </>
        )}
        {children}
        {head}
        <meta
          name="next-head-count"
          content={React.Children.count(head || []).toString()}
        />
          {this.getCssLinks()}
          {!disableRuntimeJS && (
            <link
              rel="preload"
              href={
                assetPrefix +
                getOptionalModernScriptVariant(
                  encodeURI(`/_next/static/pages/_app.js`)
                ) +
                _devOnlyInvalidateCacheQueryString
              }
              as="script"
              nonce={this.props.nonce}
              crossOrigin={this.props.crossOrigin || process.crossOrigin}
            />
          )}
          {!disableRuntimeJS && page !== '/_error' && (
            <link
              rel="preload"
              href={
                assetPrefix +
                getOptionalModernScriptVariant(
                  encodeURI(
                    `/_next/static/pages${getPageFile(page)}`
                  )
                ) +
                _devOnlyInvalidateCacheQueryString
              }
              as="script"
              nonce={this.props.nonce}
              crossOrigin={this.props.crossOrigin || process.crossOrigin}
            />
          )}
          {!disableRuntimeJS && this.getPreloadMainLinks()}
          {this.context._documentProps.isDevelopment && (
            // this element is used to mount development styles so the
            // ordering matches production
            // (by default, style-loader injects at the bottom of <head />)
            <noscript id="__next_css__DO_NOT_USE__" />
          )}
          {styles || null}
        {React.createElement(React.Fragment, {}, ...(headTags || []))}
      </head>
    )
  }
}

export class Main extends Component {
  static contextType = DocumentComponentContext

  render() {
    const { children } = this.context._documentProps
    return <div id="__hachi">{children}</div>;
  }
}

export class NextScript extends Component {
  static contextType = DocumentComponentContext

  static propTypes = {
    nonce: PropTypes.string,
    crossOrigin: PropTypes.string,
  }

  // Source: https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc
  static safariNomoduleFix =
    '!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();'

  getDynamicChunks() {
    const { dynamicImports, assetPrefix, files } = this.context._documentProps
    const { _devOnlyInvalidateCacheQueryString } = this.context

    return dedupe(dynamicImports).map((bundle) => {
      let modernProps = {}
      if (process.env.__NEXT_MODERN_BUILD) {
        modernProps = /\.module\.js$/.test(bundle.file)
          ? { type: 'module' }
          : { noModule: true }
      }

      if (!/\.js$/.test(bundle.file) || files.includes(bundle.file)) return null

      return (
        <script
          async
          key={bundle.file}
          src={`${assetPrefix}/_next/${encodeURI(
            bundle.file
          )}${_devOnlyInvalidateCacheQueryString}`}
          nonce={this.props.nonce}
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
          {...modernProps}
        />
      )
    })
  }

  getScripts() {
    const { assetPrefix, files, lowPriorityFiles } = this.context._documentProps
    const { _devOnlyInvalidateCacheQueryString } = this.context

    const normalScripts = files?.filter((file) => file.endsWith('.js'))
    const lowPriorityScripts = lowPriorityFiles?.filter((file) =>
      file.endsWith('.js')
    )

    return [...normalScripts, ...lowPriorityScripts].map((file) => {
      let modernProps = {}
      if (process.env.__NEXT_MODERN_BUILD) {
        modernProps = file.endsWith('.module.js')
          ? { type: 'module' }
          : { noModule: true }
      }
      return (
        <script
          key={file}
          src={`${assetPrefix}/_next/${encodeURI(
            file
          )}${_devOnlyInvalidateCacheQueryString}`}
          nonce={this.props.nonce}
          async
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
          {...modernProps}
        />
      )
    })
  }

  getPolyfillScripts() {
    // polyfills.js has to be rendered as nomodule without async
    // It also has to be the first script to load
    const { assetPrefix, polyfillFiles } = this.context._documentProps
    const { _devOnlyInvalidateCacheQueryString } = this.context

    return polyfillFiles
      .filter(
        (polyfill) =>
          polyfill.endsWith('.js') && !/\.module\.js$/.test(polyfill)
      )
      .map((polyfill) => (
        <script
          key={polyfill}
          nonce={this.props.nonce}
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
          noModule={true}
          src={`${assetPrefix}/_next/${polyfill}${_devOnlyInvalidateCacheQueryString}`}
        />
      ))
  }

  static getInlineScriptSource(documentProps) {
    const { __NEXT_DATA__ } = documentProps
    try {
      const data = JSON.stringify(__NEXT_DATA__)
      return htmlEscapeJsonString(data)
    } catch (err) {
      if (err.message.indexOf('circular structure')) {
        throw new Error(
          `Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://err.sh/zeit/next.js/circular-structure`
        )
      }
      throw err
    }
  }

  render() {
    const {
      staticMarkup,
      assetPrefix,
      inAmpMode,
      devFiles,
      __NEXT_DATA__,
      bodyTags,
      unstable_runtimeJS,
    } = this.context._documentProps
    const disableRuntimeJS = unstable_runtimeJS === false

    const { _devOnlyInvalidateCacheQueryString } = this.context

    const { page, buildId } = __NEXT_DATA__

    if (process.env.NODE_ENV !== 'production') {
      if (this.props.crossOrigin)
        console.warn(
          'Warning: `NextScript` attribute `crossOrigin` is deprecated. https://err.sh/next.js/doc-crossorigin-deprecated'
        )
    }

    const pageScript = [
      <script
        async
        data-next-page={page}
        key={page}
        src={
          assetPrefix +
          encodeURI(`/_next/static/pages${getPageFile(page)}`) +
          _devOnlyInvalidateCacheQueryString
        }
        nonce={this.props.nonce}
        crossOrigin={this.props.crossOrigin || process.crossOrigin}
        {...(process.env.__NEXT_MODERN_BUILD ? { noModule: true } : {})}
      />,
      process.env.__NEXT_MODERN_BUILD && (
        <script
          async
          data-next-page={page}
          key={`${page}-modern`}
          src={
            assetPrefix +
            getOptionalModernScriptVariant(
              encodeURI(`/_next/static/pages${getPageFile(page)}`)
            ) +
            _devOnlyInvalidateCacheQueryString
          }
          nonce={this.props.nonce}
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
          type="module"
        />
      ),
    ]

    const appScript = [
      <script
        async
        data-next-page="/_app"
        src={
          assetPrefix +
          `/_next/static/pages/_app.js` +
          _devOnlyInvalidateCacheQueryString
        }
        key="_app"
        nonce={this.props.nonce}
        crossOrigin={this.props.crossOrigin || process.crossOrigin}
        {...(process.env.__NEXT_MODERN_BUILD ? { noModule: true } : {})}
      />,
      process.env.__NEXT_MODERN_BUILD && (
        <script
          async
          data-next-page="/_app"
          src={
            assetPrefix +
            `/_next/static/pages/_app.module.js` +
            _devOnlyInvalidateCacheQueryString
          }
          key="_app-modern"
          nonce={this.props.nonce}
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
          type="module"
        />
      ),
    ]

    return (
      <>
        {!disableRuntimeJS && devFiles
          ? devFiles.map(
              (file) =>
                !file.match(/\.js\.map/) && (
                  <script
                    key={file}
                    src={`${assetPrefix}/_next/${encodeURI(
                      file
                    )}${_devOnlyInvalidateCacheQueryString}`}
                    nonce={this.props.nonce}
                    crossOrigin={this.props.crossOrigin || process.crossOrigin}
                  />
                )
            )
          : null}
        {staticMarkup || disableRuntimeJS ? null : (
          <script
            id="__NEXT_DATA__"
            type="application/json"
            nonce={this.props.nonce}
            crossOrigin={this.props.crossOrigin || process.crossOrigin}
            dangerouslySetInnerHTML={{
              __html: NextScript.getInlineScriptSource(
                this.context._documentProps
              ),
            }}
          />
        )}
        {process.env.__NEXT_MODERN_BUILD && !disableRuntimeJS ? (
          <script
            nonce={this.props.nonce}
            crossOrigin={this.props.crossOrigin || process.crossOrigin}
            noModule={true}
            dangerouslySetInnerHTML={{
              __html: NextScript.safariNomoduleFix,
            }}
          />
        ) : null}
        {!disableRuntimeJS && this.getPolyfillScripts()}
        {!disableRuntimeJS && appScript}
        {!disableRuntimeJS && page !== '/_error' && pageScript}
        {disableRuntimeJS || staticMarkup ? null : this.getDynamicChunks()}
        {disableRuntimeJS || staticMarkup ? null : this.getScripts()}
        {React.createElement(React.Fragment, {}, ...(bodyTags || []))}
      </>
    )
  }
}

function getPageFile(page, buildId) {
  const startingUrl = page === '/' ? '/index' : page
  return buildId ? `${startingUrl}.${buildId}.js` : `${startingUrl}.js`
}
