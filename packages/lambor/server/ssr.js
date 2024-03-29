import * as React from 'react';
import Loadable from 'lambor-utils/loadable';
import dva from 'dva';
import { createMemoryHistory } from 'history';
import { matchRoutes } from 'react-router-config';
import { getBundles } from 'lambor-utils/webpack';
import router from '../router';
import { generateRoutes } from '../lib/routes';
import { renderToString } from 'react-dom/server';
import { sendHTML, registerModel } from '../lib/utils';

export default class Ssr {
    constructor({
        dev,
        rootDir,
        distDir,
        Document,
        entryFiles,
        clientBundles
    }) {
        this.dev = dev;
        this.rootDir = rootDir;
        this.distDir = distDir;
        this.Document = Document;
        this.entryFiles = entryFiles;
        this.clientBundles = clientBundles;
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

    dispatchActions = async (app, components, parsedUrl) => {
        // dispatch action
        // 获取所有匹配组件的fetching方法
        const fetchList = [];
        for (const component of components) {
            if (component.fetching) {
                fetchList.push(component.fetching({
                    ...app._store,
                    ...component.props,
                    isServerFetching: true, // 是否是服务端获取数据
                    query: parsedUrl.query,
                    path: parsedUrl.pathname
                }));
            }
        }
    
        // 获取所有fetching方法中需要执行的action并过滤null
        const actionList = [];
        fetchList.forEach((actions) => {
            (actions || []).forEach((action) => {
                actionList.push(action);
            });
        });
        // 执行所有action
        await Promise.all(actionList).catch(e => {
            debug('dispatchActions error:', e.toString());
        });
    }

    prepare = async () => {
        
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
        await this.dispatchActions(app, components, parsedUrl)
        const PRELOADED_STATE = app._store.getState();
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
                  PRELOADED_STATE,
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
