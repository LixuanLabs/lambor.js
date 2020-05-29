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
  