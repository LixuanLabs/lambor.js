import * as React from 'react';
import * as Loadable from 'react-loadable';
import dva from 'dva';
import { createMemoryHistory } from 'history';
import { matchRoutes } from 'react-router-config';
import { getBundles } from 'react-loadable/webpack';
import router from '../router';
import { generateRoutes } from '../lib/routes';
import { renderToString } from 'react-dom/server';
import { sendHTML, registerModel } from '../lib/utils';

export default class Ssr {
    constructor({
        rootDir,
        distDir,
        Document,
        entryFiles,
        clientBundles
    }) {
        this.rootDir = rootDir;
        this.distDir = distDir;
        this.Document = Document;
        this.entryFiles = entryFiles;
        this.clientBundles = clientBundles;
        this.Loadable = Loadable;
        this.routesList = generateRoutes();
    }

    matchComponents = async (app, pathname) => {
      // 组件匹配（包含Loadable组件）
      const components = [];
      const preload = [];
      matchRoutes(this.routesList, pathname).map((routers) => {
          const route = routers.route;
          const preloadFun = route.component['preload'];
          if (!preloadFun) {
              components.push(route.component);
          } else {
              preload.push(preloadFun().then(res => {
                  if (res.default) {
                      components.push(res.default);
                  } else {
                      for (let i in res) {
                          if (res.hasOwnProperty(i)) {
                              if (res[i].default.hasOwnProperty('namespace')) {
                                  registerModel(app, res[i]);
                              } else {
                                  components.push(res[i].default);
                              }
                          }
                      }
                  }
              }));
          }
      });

      await Promise.all(preload).catch((e) => {
          console.log('matchComponents error:', e);

      });
      return components;
      
    }
    
    async run(
        req,
        res,
        parsedUrl
      ) {
        this.initDva({url: req.url});
        const app = this.app;
        const DApp = app.start();
        const components = await this.matchComponents(app, parsedUrl.pathname);
        try {
          let modules = [];
          const C = renderToString(
              <Loadable.Capture report={module => { modules.push(module); }} >
                  <DApp context={{
                    routesList: this.routesList,
                    Document: this.Document,
                    app
                  }} />
              </Loadable.Capture>
          );
          
          let bundles = getBundles(this.clientBundles, modules);
          
          const html = renderToString(this.Document.renderDocument(this.Document,
              {
                  page: parsedUrl.pathname,
                  files: [...bundles, ...this.entryFiles],
                  children: C
              }
          )
          )
          return sendHTML(req, res, html);
        } catch (err) {
          if (err.code === 'DECODE_FAILED') {
            res.statusCode = 400
            return this.renderError(null, req, res, '/_error', {})
          }
          throw err
        }
    
        // await this.render404(req, res, parsedUrl)
    }

    initDva({url}) {
        // 初始化DvaApp
        const history = createMemoryHistory();
        history.push(url);
        
        // let initialState = this.initLocale(this.initialState);

        this.app = dva({history, onError: e => {
            console.log(e.message);
        }});
        this.app.router(router);

        // if (initModel.length) {
        //     initModel.forEach(model => {
        //         registerModel(this.app, model);
        //     });
        // }
    }  
}