import * as React from 'react';
import { join, resolve } from 'path';
import fs from 'fs';
import dva from 'dva';
import { createMemoryHistory } from 'history';
import { parse as parseQs, ParsedUrlQuery } from 'querystring'
import { format as formatUrl, parse as parseUrl } from 'url'
import { renderToString } from 'react-dom/server';
import loadConfig from './config'
import { CLIENT_PUBLIC_FILES_PATH, SERVER_DIRECTORY, ROUTES_MANIFEST, BUILD_MANIFEST } from '../lib/constants';
import { registerModel, sendHTML } from '../lib/utils';
import router from '../router';
import { loadComponents } from './load-components';


export default class SSRController {
    constructor({
        dir = '.',
        staticMarkup = false,
        quiet = false,
        conf = null,
        dev = false,
        customServer = true,
    }) {
        this.dir = resolve(dir);
        this.hachiConfig = loadConfig(this.dir, conf);
        this.distDir = join(this.dir, this.hachiConfig.distDir);
        this.publicDir = join(this.dir, CLIENT_PUBLIC_FILES_PATH);
        this.serverBuildDir = join(this.distDir,SERVER_DIRECTORY);
        this.routesJson = join(this.dir, 'routes.json');
        const buildManifestPath = join(this.distDir, BUILD_MANIFEST);
        const buildManifestModule = require(buildManifestPath)
        this.buildManifest = buildManifestModule.default || buildManifestModule;
        if (fs.existsSync(this.routesJson)) {
          this.routesMap = require(this.routesJson);
        }

        // const pagesManifestPath = join(this.serverBuildDir, PAGES_MANIFEST)

        // if (!dev) {
        //     this.pagesManifest = require(pagesManifestPath)
        // }
        this.router = router;

    }


    async run(
        req,
        res,
        parsedUrl
      ) {
        this.initDva({router: this.router, url: req.url});
        const app = this.app;
        const DApp = app.start();
        try {
          const { Document, App, routesList } = await loadComponents(app, this.distDir, this.routesMap);
          // const matched = await this.router.execute(req, res, parsedUrl, app)
          const html = renderToString(
            <DApp context={{
              routesList,
              Document,
              App,
              buildManifest: this.buildManifest
            }} />
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

    initDva({router, url, initModel = []}) {
        // 初始化DvaApp
        const history = createMemoryHistory();
        history.push(url);
        
        // let initialState = this.initLocale(this.initialState);

        this.app = dva({history, onError: e => {
            console.log(e.message);
        }});
        this.app.router(router);

        if (initModel.length) {
            initModel.forEach(model => {
                registerModel(this.app, model);
            });
        }
    }

    getInitState(locale) {
      return {
        _hachi: {
          locale: locale || 'en'
        }
      }
    }

    getInitModel() {
      
    }

    getCustomInitState() {
      return {};
    }

    getCustomInitModel() {
      return [];
    }

    handleRequest = async (req, res, parsedUrl) => {
        // Parse url if parsedUrl not provided
        if (!parsedUrl || typeof parsedUrl !== 'object') {
          parsedUrl = parseUrl(req.url, true)
        }

        // 检测是否为数据请求
        if (this.hachiConfig.apiReg.test(parsedUrl.pathname)) {
            console.log('api接口', parsedUrl.pathname);
            res.end();
            return;
        }

        // 是否为静态文件
        if (parsedUrl.pathname.startsWith('/static')) {
          res.write(
            fs.readFileSync(
              join(
                this.distDir,
                '/static/',
                parsedUrl.pathname.slice('/static/'.length)
              ),
              'utf8'
            )
          )
          return res.end()
        }

        if (parsedUrl.pathname === '/favicon.ico') {
          res.end();
          return;
        }
    
        // Parse the querystring ourselves if the user doesn't handle querystring parsing
        if (typeof parsedUrl.query === 'string') {
          parsedUrl.query = parseQs(parsedUrl.query)
        }

    
        try {
          return await this.run(req, res, parsedUrl)
        } catch (err) {
          console.error(err)
          res.statusCode = 500
          res.end('Internal Server Error')
        }
    }
    
}