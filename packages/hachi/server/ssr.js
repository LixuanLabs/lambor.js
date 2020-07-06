import * as React from 'react';
import * as Loadable from 'react-loadable';
import dva from 'dva';
import { createMemoryHistory } from 'history';
import router from '../router';
import { generateRoutes } from '../lib/routes';
import { renderToString } from 'react-dom/server';
import { sendHTML } from '../lib/utils';

export default class Ssr {
    constructor({
        rootDir,
        distDir,
        Document
    }) {
        this.rootDir = rootDir;
        this.distDir = distDir;
        this.Document = Document;
        this.Loadable = Loadable;
        this.routesList = generateRoutes();
    }
    
    async run(
        req,
        res,
        parsedUrl
      ) {
        this.initDva({url: req.url});
        const app = this.app;
        const DApp = app.start();
        try {
          let modules = [];
          const html = renderToString(
              <Loadable.Capture report={module => { modules.push(module); }} >
                  <DApp context={{
                    routesList: this.routesList,
                    Document: this.Document,
                    app
                  }} />
              </Loadable.Capture>
          );
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