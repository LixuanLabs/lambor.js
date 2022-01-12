
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

export function registerModels (app, modelList) {
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
      )}.getInitialProps()" is defined as an instance method - visit https://err.sh/zeit/ha.js/get-initial-props-as-an-instance-method for more information.`
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
        )} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://err.sh/zeit/ha.js/empty-object-getInitialProps`
      )
    }
  }

  return props
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

export function isAsyncFunction(fn) {
  let fnStr =fn.toString();
  return Object.prototype.toString.call(fn) === '[object AsyncFunction]' || fnStr.includes("return _regenerator.default.async(function")
}
