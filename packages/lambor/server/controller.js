import loadable from 'lambor-utils/loadable';
import { join, resolve } from 'path';
import fs from 'fs';
import { parse as parseQs } from 'querystring'
import { parse as parseUrl } from 'url'
import loadConfig from './config'
import { ENTRY_FILES, REACT_LOADABLE_MANIFEST, SERVER_DIRECTORY, DOCUMENTJS, SERVEROUTPUT } from '../lib/constants';
import build from '../build';

export default class Controller {
    async init({
      dir = '.',
      dev = false
    }) {
      this.dev = dev;
      const rootDir = resolve(dir);
      this.lamborCon = loadConfig(rootDir);
      this.distDir = join(rootDir, this.lamborCon.distDir);
      if (dev) {
        try {
          const { 
            Document,
            entryFiles,
            Ssr,
            clientBundles,
            mfs,
            hotReloader
          } = await build(rootDir, {dev});
            this.clientBundles = clientBundles;
            this.Document = Document;
            this.entryFiles = entryFiles;
            this.Ssr = Ssr;
            this.mfs = mfs;
            this.hotReloader = hotReloader; 
        } catch (error) {
          console.log('error', error);
        }
      } else {
        this.clientBundles = require(join(this.distDir, REACT_LOADABLE_MANIFEST));
        this.Document = require(join(this.distDir, SERVER_DIRECTORY, DOCUMENTJS)).default;
        this.entryFiles = require(join(this.distDir, ENTRY_FILES)).default;
        this.Ssr = require(join(this.distDir, SERVER_DIRECTORY, SERVEROUTPUT)).default;
      }
      this.ssr = new this.Ssr({
        rootDir,
        distDir: this.distDir,
        Document: this.Document,
        entryFiles: this.entryFiles,
        clientBundles: this.clientBundles
      });
    }

    preload = async () => {
      await loadable.preloadAll();
    }

    handleRequest = async (req, res, parsedUrl) => {
      try {
        if (!parsedUrl || typeof parsedUrl !== 'object') {
          parsedUrl = parseUrl(req.url, true)
        }
        if (this.dev) {
          await this.hotReloader.run(req, res, parsedUrl);
        }

        // 检测是否为数据请求
        if (this.lamborCon.apiReg.test(parsedUrl.pathname)) {
            console.log('api接口', parsedUrl.pathname);
            res.end();
            return;
        }

        // 是否为静态文件
        if (parsedUrl.pathname.startsWith('/dist')) {
          if (this.dev) {
            res.write(
              this.mfs.readFileSync(parsedUrl.pathname, 'utf8')
            )
          } else {
            res.write(
              fs.readFileSync(
                join(
                  this.distDir,
                  parsedUrl.pathname.slice('/dist/'.length)
                ),
                'utf8'
              )
            )
          }
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

          return await this.ssr.run(req, res, parsedUrl)
        } catch (err) {
          console.error(err)
          res.statusCode = 500
          res.end('Internal Server Error')
        }
    }
    
}
