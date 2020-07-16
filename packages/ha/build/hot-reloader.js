import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';

const ignored = [
    /[\\/]\.git[\\/]/,
    /[\\/]node_modules[\\/]/,
]

export default class HotReloader {
    constructor(multiCompiler) {
        const webpackDevMiddleware = WebpackDevMiddleware(
            multiCompiler[0],
            {
                // noInfo: true,
                // logLevel: 'silent',
                watchOptions: { ignored },
                // writeToDisk: true,
            }
        )

        const webpackHotMiddleware = WebpackHotMiddleware(
            multiCompiler[0],
            {
                path: '/__webpack-hmr',
                log: console.log,
                heartbeat: 2500,
            }
        )
        this.webpackDevMiddleware = webpackDevMiddleware
        this.webpackHotMiddleware = webpackHotMiddleware
        this.middlewares = [
            webpackDevMiddleware,
            webpackHotMiddleware
        ];
        // multiCompiler[1].hooks.done.tap('HotReloaderForServer', (stats) => {
        //     console.log('HotReloaderForServer');
        //     this.send('reloadPage')
        // })
        multiCompiler[0].hooks.done.tap('HotReloaderForClient', (stats) => {
            this.send('reloadPage')
        })
    }
    send = (action, ...args) => {
        this.webpackHotMiddleware.publish({ action, data: args })
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