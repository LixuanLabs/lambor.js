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
            <NextScript />
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
    const { files } = this.context._documentProps
    const cssFiles =
      files && files.length ? files.filter((f) => /\.css$/.test(f)) : []

    const cssLinkElements = []
    cssFiles.forEach((file) => {
      cssLinkElements.push(
        <link
          key={`${file}-preload`}
          nonce={this.props.nonce}
          rel="preload"
          href={`${encodeURI(
            file
          )}`}
          as="style"
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
        />,
        <link
          key={file}
          nonce={this.props.nonce}
          rel="stylesheet"
          href={`${encodeURI(
            file
          )}`}
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
        />
      )
    })

    return cssLinkElements.length === 0 ? null : cssLinkElements
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
    return <div id="__hachi" dangerouslySetInnerHTML={{__html: children}} />;
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


  getScripts() {
    const { files } = this.context._documentProps
    
    const normalScripts = files.filter((file) => file && file.publicPath.endsWith('.js'))
    
    return [...normalScripts].map((file) => {
      return (
        <script
          key={file}
          src={`${encodeURI(
            file.publicPath
          )}`}
          nonce={this.props.nonce}
          async
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
        />
      )
    })
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      if (this.props.crossOrigin)
        console.warn(
          'Warning: `NextScript` attribute `crossOrigin` is deprecated. https://err.sh/next.js/doc-crossorigin-deprecated'
        )
    }


    return (
      <>
        <script
          nonce={this.props.nonce}
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
          noModule={true}
          dangerouslySetInnerHTML={{
            __html: NextScript.safariNomoduleFix,
          }}
        />
        {this.getScripts()}
      </>
    )
  }
}

function getPageFile(page, buildId) {
  const startingUrl = page === '/' ? '/index' : page
  return buildId ? `${startingUrl}.${buildId}.js` : `${startingUrl}.js`
}
