import path from 'path';

import { PAGES_MANIFEST, BLOCKED_PAGES_REG } from './constants';


export function printAndExit(message, code = 1) {
    if (code === 0) {
      // tslint:disable-next-line no-console
      console.log(message)
    } else {
      console.error(message)
    }
  
    process.exit(code)
  }
  
export function getNodeOptionsWithoutInspect() {
  const NODE_INSPECT_RE = /--inspect(-brk)?(=\S+)?( |$)/
  return (process.env.NODE_OPTIONS || '').replace(NODE_INSPECT_RE, '')
}

function hasNamespace (model = [], namespace) {
  return model.filter(item => {
    return item.namespace === namespace;
  }).length > 0;
}

export function registerModel(app, model) {
 model = model.default || model;
 if (!hasNamespace(app._models, model.namespace)) {
   app.model(model);
 }
}

export function registerRouterModel (modelList) {
  modelList.forEach(model => {
      registerModel(app, model);
  });
};

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

export async function loadGetInitialProps (App, ctx) {
  if (process.env.NODE_ENV !== 'production') {
    if (App.prototype?.getInitialProps) {
      const message = `"${getDisplayName(
        App
      )}.getInitialProps()" is defined as an instance method - visit https://err.sh/zeit/next.js/get-initial-props-as-an-instance-method for more information.`
      throw new Error(message)
    }
  }
  // when called from _app `ctx` is nested in `ctx`
  const res = ctx.res || (ctx.ctx && ctx.ctx.res)

  if (!App.getInitialProps) {
    if (ctx.ctx && ctx.Component) {
      // @ts-ignore pageProps default
      return {
        pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx),
      }
    }
    return {}
  }

  const props = await App.getInitialProps(ctx)

  if (res && isResSent(res)) {
    return props
  }

  if (!props) {
    const message = `"${getDisplayName(
      App
    )}.getInitialProps()" should resolve to an object. But found "${props}" instead.`
    throw new Error(message)
  }

  if (process.env.NODE_ENV !== 'production') {
    if (Object.keys(props).length === 0 && !ctx.ctx) {
      console.warn(
        `${getDisplayName(
          App
        )} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://err.sh/zeit/next.js/empty-object-getInitialProps`
      )
    }
  }

  return props
}

export function getPagePath (page, distDir, server) {
  const serverBuildPath = path.join(distDir, server);
  const pagesManifest = require(path.join(serverBuildPath, PAGES_MANIFEST))
  return  pagesManifest[page];
}

export async function requirePage(app, page, distDir, server) {
  console.log('page', page);
  const serverBuildPath = path.join(distDir, server);
  if (BLOCKED_PAGES_REG.test(page)) {
    return require(path.join(serverBuildPath, page))
  }
  const pagePath = getPagePath(page, distDir, server)
  if (Array.isArray(pagePath)) {
    let comPath = null,
        modelPath = null,
        langPath = null;
    for (const filePath of pagePath) {
      if (/aModel\.js$/.test(filePath)) {
        modelPath = path.join(serverBuildPath, filePath);
      } else if (/aLang\.js$/.test(filePath)) {
        langPath = path.join(serverBuildPath, filePath)
      } else if (/aIndex\.js$/.test(filePath)) {
        comPath = path.join(serverBuildPath, filePath);
      } else {

      }
    }
    console.log('modelPath', modelPath);
    
    const langModule = require(langPath)
    const modelModule = require(modelPath)
    console.log('modelModule', modelModule);
    
    const model = modelModule.default || modelModule;
    model.state._Lang = langModule.default || langModule;
    registerModel(app, model.default || model);
    return require(comPath);
  }
}
  

export function sendHTML(
  req,
  res,
  html
) {

  if (!res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
  }
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(req.method === 'HEAD' ? null : html)
}