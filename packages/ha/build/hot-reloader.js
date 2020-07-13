import webpackDevMiddleware from '../compiled/webpack-dev-middleware';
import webpackHotMiddleware from '../compiled/webpack-hot-middleware';

export default class HotReloader {
    constructor() {
        this.webpackDevMiddleware = webpackDevMiddleware
        this.webpackHotMiddleware = webpackHotMiddleware
        this.middlewares = [
            webpackDevMiddleware,
            webpackHotMiddleware
        ];
    }
    async run(req, res, parsedUrl) {
        for (const fn of this.middlewares) {
            await new Promise((resolve, reject) => {
              fn(req, res, (err) => {
                if (err) return reject(err)
                resolve()
              })
            })
        }
    }
}