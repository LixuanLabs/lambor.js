import * as Loadable from 'react-loadable';
import dva from 'dva';
import { createMemoryHistory } from 'history';
import router from '../router';
import { loadComponents } from './load-components';
import { generateRoutes } from '../lib/routes';

export default class SSR {
    constructor({
        distDir
    }) {
        this.distDir = distDir;
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
          const { Document, App } = await loadComponents(app, this.distDir);
          let modules = [];
          const html = renderToString(
              <Loadable.Capture report={module => { modules.push(module); }} >
                  <DApp context={{
                    routesList: generateRoutes(),
                    Document,
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